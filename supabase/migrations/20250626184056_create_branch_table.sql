
create table branches (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  location text,
  latitude float8 not null,
  longitude float8 not null,
  created_by uuid references profiles(id)
);

