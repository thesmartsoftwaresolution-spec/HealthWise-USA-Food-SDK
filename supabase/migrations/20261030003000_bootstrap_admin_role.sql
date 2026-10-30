-- Permit trusted database administrators to bootstrap the first app admin.
-- Browser-authenticated users still must already be admins to change role/status.
create or replace function public.prevent_profile_privilege_escalation()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  if (new.role is distinct from old.role or new.status is distinct from old.status)
     and current_user not in ('postgres','supabase_admin','service_role')
     and not private.is_admin() then
    raise exception 'Only an administrator may change profile role or status';
  end if;
  return new;
end;
$$;
