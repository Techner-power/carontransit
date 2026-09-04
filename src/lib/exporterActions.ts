"use server";

import { createServerSupabase } from "./supabase/serverClient";
import { supabaseAdmin } from "./supabaseAdmin";
import { redirect } from "next/navigation";

export interface ActionResult {
  success: boolean;
  message: string;
}

export async function exporterSignUp(formData: FormData): Promise<ActionResult> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const companyName = String(formData.get("companyName") ?? "").trim();
  const country = String(formData.get("country") ?? "").trim();
  const whatsapp = String(formData.get("whatsapp") ?? "").trim();

  if (!email || !password || !companyName || !country || !whatsapp) {
    return { success: false, message: "All fields are required." };
  }
  if (password.length < 8) {
    return { success: false, message: "Password must be at least 8 characters." };
  }

  const supabase = await createServerSupabase();

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError || !authData.user) {
    return { success: false, message: authError?.message ?? "Could not create account." };
  }

  // Uses the service-role client for the same reason as dealer signup: the
  // session may not be active yet at this exact moment (Supabase's default
  // email confirmation timing), so an RLS-scoped insert could fail here.
  const { error: exporterError } = await supabaseAdmin!.from("exporters").insert({
    auth_user_id: authData.user.id,
    company_name: companyName,
    country,
    contact_whatsapp: whatsapp,
    // listing_quota defaults to 2 in the database — not set here, so an
    // exporter can never influence their own starting quota via this form.
  });

  if (exporterError) {
    return {
      success: false,
      message: `Account created, but exporter profile failed to save: ${exporterError.message}. Contact support.`,
    };
  }

  redirect("/exporter/dashboard");
}

export async function exporterSignIn(formData: FormData): Promise<ActionResult> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const supabase = await createServerSupabase();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { success: false, message: "Incorrect email or password." };
  }

  redirect("/exporter/dashboard");
}

export async function exporterSignOut() {
  const supabase = await createServerSupabase();
  await supabase.auth.signOut();
  redirect("/exporter/login");
}

export async function getMyExporterProfile() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("exporters")
    .select("*")
    .eq("auth_user_id", user.id)
    .single();
  return data;
}
