import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export async function POST(req) {
  try {
    const { long, code } = await req.json();

    if (!long || !long.includes(".") || !code || code === "undefined") {
      return new Response(null, { status: 400 });
    }

    // Check if code already exists
    const { data: existing, error: selectError } = await supabase
      .from("links")
      .select("id")
      .eq("short_code", code)
      .single();

    if (selectError && selectError.code !== "PGRST116") {
      // Some error other than "no rows"
      return new Response(JSON.stringify({ message: selectError.message }), { status: 500 });
    }
    if (existing) {
      return new Response(null, { status: 409 }); // Conflict
    }

    // Prefix http if missing
    let url = long;
    if (!/^https?:\/\//i.test(url)) {
      url = "https://" + url;
    }

    const { error: insertError } = await supabase
      .from("links")
      .insert({ original_url: url, short_code: code });

    if (insertError) {
      return new Response(JSON.stringify({ message: insertError.message }), { status: 500 });
    }

    return new Response(null, { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ message: err.message }), { status: 500 });
  }
}
