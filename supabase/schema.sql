-- CarOnTransit.co.ke — Phase 1 Schema
-- Run this in the Supabase SQL editor for a new project.

create extension if not exists "pgcrypto";

create type shipment_stage as enum ('On Water', 'Docked', 'Clearing', 'Available at Yard');

-- Separate from shipment_stage: tracks whether a unit is still available to
-- reserve, independent of where it physically is in transit.
create type listing_status as enum ('Active', 'Reserved', 'Sold');

-- Table 1: Verified Dealerships
create table dealerships (
    id uuid primary key default gen_random_uuid(),
    business_name varchar(120) not null,
    physical_location varchar(150) not null,
    kra_pin varchar(20) unique not null,
    whatsapp_contact varchar(25) not null, -- format: 2547XXXXXXXX
    is_premium_partner boolean default false,
    rating_score numeric(3,2) default 5.00,
    created_at timestamp with time zone default now()
);

-- Table 2: Transit Inventory
create table transit_inventory (
    id uuid primary key default gen_random_uuid(),
    dealer_id uuid references dealerships(id) on delete cascade,
    vehicle_title varchar(200) not null,
    car_make varchar(60) not null,
    car_model varchar(60) not null,
    year_of_manufacture int not null,
    cif_cost_kes numeric(12,2) not null,
    kra_duty_estimated numeric(12,2) not null,
    vessel_identifier varchar(100) not null,
    estimated_arrival_date date not null,
    current_transit_status shipment_stage default 'On Water',
    listing_status listing_status default 'Active',
    chassis_masked_identifier varchar(5) not null,
    vehicle_hero_image text not null,
    is_direct_foreign_listing boolean default false,
    created_at timestamp with time zone default now()
);

-- Row Level Security: public can READ everything (it's a public directory),
-- but only authenticated dealer accounts can write their own rows.
-- For Phase 1 (you managing all uploads manually via Supabase Studio),
-- you don't need write policies yet — just enable read access below.

alter table dealerships enable row level security;
alter table transit_inventory enable row level security;

create policy "Public can view dealerships"
  on dealerships for select
  using (true);

create policy "Public can view transit inventory"
  on transit_inventory for select
  using (true);

-- Phase 2 (dealer self-service dashboard) will add:
--   - lead_events table (listing_id, dealer_id, clicked_at)
--   - write policies scoped to auth.uid() matching a dealer's own account

-- Phase 3 (foreign import overlay) will add:
--   - import_agents table
--   - foreign_listings table
--   - exporters table
--   - claims table (listing_id, buyer_contact, agent_id, claimed_at, expires_at, status)
--     -- do not build the foreign listing pages until this table exists;
--     -- it's what prevents two buyers claiming the same unit.
