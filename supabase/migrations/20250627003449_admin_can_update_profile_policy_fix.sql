drop policy if exists "Admins can update any profile" on profiles;

create policy "Admins can update any profile"
on profiles for update
using (
  auth.uid() IN (select id from admin_user_ids)
);