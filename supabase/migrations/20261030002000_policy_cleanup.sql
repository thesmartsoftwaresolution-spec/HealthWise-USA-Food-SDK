-- Consolidate overlapping RLS policies to reduce redundant policy evaluation.
drop policy if exists "articles admin manage" on public.articles;
create policy "articles admin insert" on public.articles for insert to authenticated with check ((select private.is_admin()));
create policy "articles admin update" on public.articles for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "articles admin delete" on public.articles for delete to authenticated using ((select private.is_admin()));

drop policy if exists "recipes admin manage" on public.recipes;
create policy "recipes admin insert" on public.recipes for insert to authenticated with check ((select private.is_admin()));
create policy "recipes admin update" on public.recipes for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "recipes admin delete" on public.recipes for delete to authenticated using ((select private.is_admin()));

drop policy if exists "categories admin manage" on public.categories;
create policy "categories admin insert" on public.categories for insert to authenticated with check ((select private.is_admin()));
create policy "categories admin update" on public.categories for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "categories admin delete" on public.categories for delete to authenticated using ((select private.is_admin()));

drop policy if exists "settings admin manage" on public.site_settings;
create policy "settings admin insert" on public.site_settings for insert to authenticated with check ((select private.is_admin()));
create policy "settings admin update" on public.site_settings for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "settings admin delete" on public.site_settings for delete to authenticated using ((select private.is_admin()));

drop policy if exists "contact admin read manage" on public.contact_messages;
create policy "contact admin read" on public.contact_messages for select to authenticated using ((select private.is_admin()));
create policy "contact admin update" on public.contact_messages for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "contact admin delete" on public.contact_messages for delete to authenticated using ((select private.is_admin()));

drop policy if exists "newsletter admin read manage" on public.newsletter_subscribers;
create policy "newsletter admin read" on public.newsletter_subscribers for select to authenticated using ((select private.is_admin()));
create policy "newsletter admin update" on public.newsletter_subscribers for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "newsletter admin delete" on public.newsletter_subscribers for delete to authenticated using ((select private.is_admin()));

drop policy if exists "profile select own" on public.profiles;
drop policy if exists "profiles admin read" on public.profiles;
create policy "profiles select own or admin" on public.profiles for select to authenticated
using (id = (select auth.uid()) or (select private.is_admin()));

drop policy if exists "profile update own" on public.profiles;
drop policy if exists "profiles admin update" on public.profiles;
create policy "profiles update own or admin" on public.profiles for update to authenticated
using (id = (select auth.uid()) or (select private.is_admin()))
with check (id = (select auth.uid()) or (select private.is_admin()));
