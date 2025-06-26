create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  role text not null default 'employee',
  dob date,
  profile_image text,  -- URL or file path
  employee_id text unique,
  gender text,
  department text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table profiles enable row level security;

-- Select: users can see only their own profile
create policy "Users can view their own profile"
on profiles for select
using (auth.uid() = id);

-- Update: users can update their own profile
create policy "Users can update their own profile"
on profiles for update
using (auth.uid() = id);

-- Update: admins can update any profile
create policy "Admins can update any profile"
on profiles for update
using (
  exists (
    select 1
    from auth.users
    where id = auth.uid()
      and (select role from profiles where id = auth.uid()) = 'admin'
  )
);

-- Optional: Trigger to auto-update 'updated_at' on row update
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_profiles_updated_at
before update on profiles
for each row
execute procedure set_updated_at();
