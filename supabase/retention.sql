-- Operational configuration for Kubono Dev; no accounts or saves are deleted.
create extension if not exists pg_cron;
select cron.schedule('kubono-retention-7d','17 * * * *',$job$
-- One hour margin for an hourly sweep, while the project is running.
delete from auth.audit_log_entries where created_at < now()-interval '6 days 23 hours';
delete from cron.job_run_details where jobid in
 (select jobid from cron.job where jobname='kubono-retention-7d')
 and end_time < now()-interval '6 days 23 hours';
$job$);
