begin;
create extension if not exists pgcrypto;
create type public.lead_status as enum ('new','contacted','quoting','won','lost','archived');
create table public.artists (
 id uuid primary key default gen_random_uuid(), slug text not null unique, name text not null,
 bio text, email text, phone text, profile_image text, location text, service_areas jsonb not null default '[]', active boolean not null default true, created_at timestamptz not null default now()
);
create table public.projects (
 id uuid primary key default gen_random_uuid(), artist_id uuid not null references public.artists(id), slug text not null, title text not null, description text, city text,state text,category text,featured boolean not null default false,created_at timestamptz not null default now(),unique(artist_id,slug)
);
create table public.project_images (id uuid primary key default gen_random_uuid(),project_id uuid not null references public.projects(id) on delete cascade,image_url text not null,alt_text text not null,sort_order integer not null default 0);
create table public.project_requests (
 id uuid primary key default gen_random_uuid(),assigned_artist_id uuid references public.artists(id),
 customer_name text not null,customer_email text not null,customer_phone text,preferred_contact text not null check(preferred_contact in ('email','phone')),
 city text not null,state text not null,zip text not null,indoor_outdoor text not null check(indoor_outdoor in ('indoor','outdoor')),
 wall_width numeric check(wall_width>0),wall_height numeric check(wall_height>0),wall_dimensions_unknown boolean not null default false,wall_units text not null default 'feet' check(wall_units in ('feet','meters')),wall_material text,wall_notes text,
 description text not null,project_type text not null,budget_range text,timeline text not null,status public.lead_status not null default 'new',
 notification_status text not null default 'pending' check(notification_status in ('pending','sent','failed')),created_at timestamptz not null default now()
);
create table public.request_images (id uuid primary key default gen_random_uuid(),project_request_id uuid not null references public.project_requests(id) on delete cascade,image_url text not null,image_type text not null check(image_type in ('wall','inspiration')),created_at timestamptz not null default now());
create index on public.project_requests(created_at desc);
create index on public.project_requests(assigned_artist_id,status);
create index on public.request_images(project_request_id);
create index on public.projects(artist_id);
create index on public.project_images(project_id);
alter table public.artists enable row level security;
alter table public.projects enable row level security;
alter table public.project_images enable row level security;
alter table public.project_requests enable row level security;
alter table public.request_images enable row level security;
-- V1 reads curated public content from lib/content.ts. No anonymous database writes or lead reads.
revoke all on public.artists,public.projects,public.project_images,public.project_requests,public.request_images from anon,authenticated;
grant all on public.artists,public.projects,public.project_images,public.project_requests,public.request_images to service_role;
insert into public.artists(id,slug,name,location,service_areas) values ('b76b7a25-b062-42c8-8dc6-a474bcc2a730','marc-phillips','Marc Phillips','Western Maryland / Cumberland, MD','["Cumberland, MD","Frostburg, MD","Hagerstown, MD","Morgantown, WV"]');
-- Portfolio placeholder is intentionally not seeded as a verified project.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values ('request-images','request-images',false,8388608,array['image/jpeg','image/png','image/webp']) on conflict(id) do update set public=false,file_size_limit=8388608,allowed_mime_types=array['image/jpeg','image/png','image/webp'];
create function public.submit_project_request(lead jsonb, images jsonb) returns uuid language plpgsql security invoker set search_path=public as $$
declare request_id uuid := (lead->>'id')::uuid;
begin
 if jsonb_array_length(images)<1 or jsonb_array_length(images)>12 or not exists(select 1 from jsonb_array_elements(images) x where x->>'image_type'='wall') then raise exception 'Invalid photos';end if;
 insert into public.project_requests(id,assigned_artist_id,customer_name,customer_email,customer_phone,preferred_contact,city,state,zip,indoor_outdoor,wall_width,wall_height,wall_dimensions_unknown,wall_units,wall_material,wall_notes,description,project_type,budget_range,timeline)
 values(request_id,(lead->>'assigned_artist_id')::uuid,lead->>'customer_name',lead->>'customer_email',lead->>'customer_phone',lead->>'preferred_contact',lead->>'city',lead->>'state',lead->>'zip',lead->>'indoor_outdoor',(lead->>'wall_width')::numeric,(lead->>'wall_height')::numeric,(lead->>'wall_dimensions_unknown')::boolean,lead->>'wall_units',lead->>'wall_material',lead->>'wall_notes',lead->>'description',lead->>'project_type',lead->>'budget_range',lead->>'timeline');
 insert into public.request_images(project_request_id,image_url,image_type) select request_id,x->>'image_url',x->>'image_type' from jsonb_array_elements(images) x;
 return request_id;
end;$$;
revoke all on function public.submit_project_request(jsonb,jsonb) from public,anon,authenticated;
grant execute on function public.submit_project_request(jsonb,jsonb) to service_role;
create table public.rate_limits(key text primary key,window_start timestamptz not null,hits integer not null);
alter table public.rate_limits enable row level security;
revoke all on public.rate_limits from anon,authenticated;
grant all on public.rate_limits to service_role;
create function public.consume_rate_limit(rate_key text, max_hits integer,window_seconds integer) returns boolean language plpgsql security invoker set search_path=public as $$
declare current_hits integer;
begin
 insert into public.rate_limits(key,window_start,hits) values(rate_key,now(),1)
 on conflict(key) do update set
 hits=case when rate_limits.window_start < now()-make_interval(secs=>window_seconds) then 1 else rate_limits.hits+1 end,
 window_start=case when rate_limits.window_start < now()-make_interval(secs=>window_seconds) then now() else rate_limits.window_start end
 returning hits into current_hits;
 return current_hits<=max_hits;
end;$$;
revoke all on function public.consume_rate_limit(text,integer,integer) from public,anon,authenticated;
grant execute on function public.consume_rate_limit(text,integer,integer) to service_role;
commit;
