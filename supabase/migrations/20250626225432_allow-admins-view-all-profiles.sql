create or replace view admin_user_ids as
select id
from profiles
where role = 'admin';

-- 2. Drop the old problematic policy (if exists)
drop policy if exists "Admins can view all profiles" on profiles;

-- 3. Create a new policy using the view to avoid recursion
create policy "Admins can view all profiles"
on profiles
for select
using (
  auth.uid() IN (select id from admin_user_ids)
);
