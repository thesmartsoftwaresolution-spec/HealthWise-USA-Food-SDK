-- Keep role/status changes server-controlled while avoiding an exposed SECURITY DEFINER RPC.
drop function if exists public.admin_update_profile_role(uuid, text);

create or replace function public.prevent_profile_privilege_escalation()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  if (new.role is distinct from old.role or new.status is distinct from old.status)
     and not private.is_admin() then
    raise exception 'Only an administrator may change profile role or status';
  end if;
  return new;
end;
$$;
revoke all on function public.prevent_profile_privilege_escalation() from public, anon, authenticated;

drop trigger if exists protect_profile_privileges on public.profiles;
create trigger protect_profile_privileges
before update of role, status on public.profiles
for each row execute function public.prevent_profile_privilege_escalation();

grant update (role, status) on public.profiles to authenticated;
drop policy if exists "profiles admin update" on public.profiles;
create policy "profiles admin update" on public.profiles
for update to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

create index if not exists articles_category_id_idx on public.articles(category_id);
create index if not exists recipes_category_id_idx on public.recipes(category_id);
create index if not exists grocery_lists_meal_plan_id_idx on public.grocery_lists(meal_plan_id);
create index if not exists recipe_ratings_user_id_idx on public.recipe_ratings(user_id);
create index if not exists ai_usage_logs_user_id_idx on public.ai_usage_logs(user_id);
