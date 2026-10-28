-- Run in Supabase Dashboard → SQL Editor (or via Supabase CLI).

create extension if not exists "pgcrypto";

do $$ begin
  create type public.app_role as enum ('tutor', 'student');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  email text not null,
  full_name text not null default '',
  active_role public.app_role,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Profiles select own" on public.profiles;
create policy "Profiles select own"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Profiles update own" on public.profiles;
create policy "Profiles update own"
  on public.profiles for update
  using (auth.uid() = id);

create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  tutor_id uuid not null references public.profiles (id) on delete cascade,
  student_id uuid not null references public.profiles (id) on delete cascade,
  subject text not null default 'General',
  created_at timestamptz not null default now(),
  unique (tutor_id, student_id),
  check (tutor_id <> student_id)
);

alter table public.enrollments enable row level security;

drop policy if exists "Enrollments select member" on public.enrollments;
create policy "Enrollments select member"
  on public.enrollments for select
  using (auth.uid() = tutor_id or auth.uid() = student_id);

drop policy if exists "Enrollments insert tutor" on public.enrollments;
create policy "Enrollments insert tutor"
  on public.enrollments for insert
  with check (auth.uid() = tutor_id);

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null unique references public.enrollments (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.conversations enable row level security;

drop policy if exists "Conversations select member" on public.conversations;
create policy "Conversations select member"
  on public.conversations for select
  using (
    exists (
      select 1
      from public.enrollments e
      where e.id = enrollment_id
        and (e.tutor_id = auth.uid() or e.student_id = auth.uid())
    )
  );

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  sender_id uuid not null references public.profiles (id) on delete cascade,
  body text not null check (char_length(body) > 0 and char_length(body) <= 4000),
  created_at timestamptz not null default now()
);

create index if not exists messages_conversation_created
  on public.messages (conversation_id, created_at);

alter table public.messages enable row level security;

drop policy if exists "Messages select member" on public.messages;
create policy "Messages select member"
  on public.messages for select
  using (
    exists (
      select 1
      from public.conversations c
      join public.enrollments e on e.id = c.enrollment_id
      where c.id = conversation_id
        and (e.tutor_id = auth.uid() or e.student_id = auth.uid())
    )
  );

drop policy if exists "Messages insert member" on public.messages;
create policy "Messages insert member"
  on public.messages for insert
  with check (
    sender_id = auth.uid()
    and exists (
      select 1
      from public.conversations c
      join public.enrollments e on e.id = c.enrollment_id
      where c.id = conversation_id
        and (e.tutor_id = auth.uid() or e.student_id = auth.uid())
    )
  );

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  chosen_role public.app_role;
  meta_role text;
begin
  meta_role := new.raw_user_meta_data ->> 'role';
  if meta_role in ('tutor', 'student') then
    chosen_role := meta_role::public.app_role;
  end if;

  insert into public.profiles (id, email, full_name, active_role)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    chosen_role
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

do $$ begin
  alter publication supabase_realtime add table public.messages;
exception
  when duplicate_object then null;
end $$;
