// Public development project only; never place secret/service_role keys here.
// recoveryUrl is where password-recovery e-mails land; production replaces the local callback with the published HTTPS page and allows it in Auth.
// paused: the cloud service is on hold (D6 = A, panel 10): Cuenta offers no sign-up and no deletion until it returns.
export const CLOUD_CONFIG=Object.freeze({url:'https://eghmydqxsicqmbmeprgq.supabase.co',publishableKey:'sb_publishable_ecxsCTYp34g5YvxBLNLKMw_HPiCuVMk',recoveryUrl:'http://localhost:3000/',paused:true});
