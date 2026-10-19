-- Development schema for a NEW isolated Free project only. Not applied by this change.
begin;
create table public.kubono_saves (
 user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
 scope text not null check (length(scope) between 1 and 512),
 revision bigint not null check (revision > 0),
 state jsonb not null check (jsonb_typeof(state)='object' and octet_length(state::text)<=1048576),
 updated_at timestamptz not null default now(),
 primary key (user_id,scope)
);
alter table public.kubono_saves enable row level security;
revoke all on public.kubono_saves from public, anon;
grant select,insert,update,delete on public.kubono_saves to authenticated;
create policy own_saves on public.kubono_saves to authenticated
 using ((select auth.uid())=user_id and not coalesce((auth.jwt()->>'is_anonymous')::boolean,false))
 with check ((select auth.uid())=user_id and not coalesce((auth.jwt()->>'is_anonymous')::boolean,false));
-- Enforce quotas and revisions even if a client bypasses the RPC and uses the table API.
create function public.kubono_save_guard() returns trigger language plpgsql security invoker set search_path='' as $$
begin
 if not (new.state ? 'worldIdentity') then raise exception 'World identity required'; end if;
 perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(new.user_id::text,0));
 if tg_op='INSERT' then
  if new.revision<>1 or (select count(*) from public.kubono_saves where user_id=new.user_id)>=64 then raise exception 'Save quota/revision invalid'; end if;
 elsif new.user_id<>old.user_id or new.scope<>old.scope or new.revision<>old.revision+1 then raise exception 'Save identity/revision invalid'; end if;
 new.updated_at=now();return new;
end; $$;
revoke all on function public.kubono_save_guard() from public,anon;
create trigger kubono_save_limits before insert or update on public.kubono_saves for each row execute function public.kubono_save_guard();
create function public.kubono_save(p_scope text,p_revision bigint,p_state jsonb)
returns jsonb language plpgsql security invoker set search_path='' as $$
declare v_revision bigint; v_user uuid:=auth.uid();
begin
 if v_user is null or coalesce((auth.jwt()->>'is_anonymous')::boolean,false) then raise exception 'Authentication required'; end if;
 if p_revision is null or p_revision<0 or p_scope is null or length(p_scope) not between 1 and 512 or p_state is null or jsonb_typeof(p_state)<>'object' or octet_length(p_state::text)>1048576 or not (p_state ? 'worldIdentity') then raise exception 'Invalid save'; end if;
 perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(v_user::text,0));
 if p_revision=0 then
  if (select count(*) from public.kubono_saves where user_id=v_user)>=64 then raise exception 'Save quota reached'; end if;
  insert into public.kubono_saves(user_id,scope,revision,state) values(v_user,p_scope,1,p_state) on conflict do nothing returning revision into v_revision;
 else
  update public.kubono_saves set state=p_state,revision=revision+1,updated_at=now() where user_id=v_user and scope=p_scope and revision=p_revision returning revision into v_revision;
 end if;
 return jsonb_build_object('ok',v_revision is not null,'revision',v_revision);
end; $$;
revoke all on function public.kubono_save(text,bigint,jsonb) from public,anon;
grant execute on function public.kubono_save(text,bigint,jsonb) to authenticated;
-- Account deletion needs auth-schema privileges; never accepts a caller-supplied user ID.
create function public.kubono_delete_account() returns void language plpgsql security definer set search_path='' as $$
declare v_user uuid:=auth.uid();
begin
 if v_user is null or not exists(select 1 from auth.sessions where id=(auth.jwt()->>'session_id')::uuid and user_id=v_user and created_at>now()-interval '5 minutes') then raise exception 'Recent sign-in required'; end if;
 delete from auth.sessions where user_id=v_user;
 delete from auth.users where id=v_user;
end; $$;
revoke all on function public.kubono_delete_account() from public,anon;
grant execute on function public.kubono_delete_account() to authenticated;
commit;
