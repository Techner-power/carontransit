-- Phase 2 migration: dealer self-service + review queue
-- Run this in Supabase SQL Editor on top of your existing schema.

-- Link dealerships to real Supabase Auth accounts. Nullable because your
-- existing manually-added dealers (like KDG) won't have a login yet.
alter table dealerships
add column auth_user_id uuid references auth.users(id);

-- Review queue: dealer-submitted cars start as Pending and stay invisible
-- to the public until you approve them. Admin-added cars (via the old
-- /admin page) are marked Approved immediately.
create type review_status as enum ('Pending', 'Approved', 'Rejected');

alter table transit_inventory
add column review_status review_status default 'Approved';

-- Replace the old blanket "public can view everything" policy on inventory
-- with one that also requires review_status = 'Approved'.
drop policy if exists "Public can view transit inventory" on transit_inventory;

create policy "Public can view approved inventory"
  on transit_inventory for select
  using (review_status = 'Approved');

-- Dealers can see their OWN inventory regardless of review status, so their
-- dashboard shows pending/rejected cars too, not just approved ones.
create policy "Dealers can view their own inventory"
  on transit_inventory for select
  using (
    dealer_id in (
      select id from dealerships where auth_user_id = auth.uid()
    )
  );

-- Dealers can insert vehicles ONLY under their own dealer_id — this is what
-- stops a dealer from adding cars under someone else's name.
create policy "Dealers can insert their own vehicles"
  on transit_inventory for insert
  with check (
    dealer_id in (
      select id from dealerships where auth_user_id = auth.uid()
    )
  );

-- Dealers can sign up and create their own dealership profile, linked to
-- their own auth account only.
create policy "Dealers can insert their own dealership profile"
  on dealerships for insert
  with check (auth_user_id = auth.uid());

-- Dealers can view/update their own dealership profile.
create policy "Dealers can view their own dealership"
  on dealerships for select
  using (auth_user_id = auth.uid());

create policy "Dealers can update their own dealership"
  on dealerships for update
  using (auth_user_id = auth.uid());

-- NOTE: the public "Public can view dealerships" policy from the original
-- schema still exists alongside this one, so business names/locations
-- remain visible on listings as before.
