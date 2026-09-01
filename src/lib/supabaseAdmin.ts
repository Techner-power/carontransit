import { createClient } from "@supabase/supabase-js";

// IMPORTANT: this file must never be imported into a "use client" component.
// It uses the SERVICE ROLE key, which bypasses Row Level Security entirely.
// It only ever runs inside Server Actions (see adminActions.ts), which
// execute on Vercel's servers — this key never reaches the buyer's browser.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabaseAdmin =
  supabaseUrl && serviceRoleKey ? createClient(supabaseUrl, serviceRoleKey) : null;
