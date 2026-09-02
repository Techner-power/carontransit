-- Adds per-listing "Price on Request" support. When true, the public site
-- hides CIF/duty/OTR figures and shows "Message dealer for pricing" instead
-- — matches dealers who only disclose price once a buyer reaches out
-- directly, rather than publishing it on the listing.
alter table transit_inventory
add column price_hidden boolean default false;
