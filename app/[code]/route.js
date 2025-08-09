import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export async function GET(req, context) {
  const { params } = await context;
  const code = params.code;

  const { data, error } = await supabase
    .from("links")
    .select("original_url")
    .eq("short_code", code)
    .single();

  if (error || !data) {
    return new Response(null, { status: 404 });
  }

  return new Response(null, {
    status: 302,
    headers: {
      Location: data.original_url,
    },
  });
}
