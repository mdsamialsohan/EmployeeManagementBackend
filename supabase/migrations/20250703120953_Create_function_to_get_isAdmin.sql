create or replace function is_admin()
returns boolean
language sql
stable
as $$
  select role = 'admin'
  from profiles
  where id = auth.uid()
$$;
