import { db } from "../../lib/db";

export async function POST(req) {
  let { long, code } = await req.json();

  if (!long || !long.includes(".") || !code || code === "undefined") {
    return new Response(null, { status: 400 });
  }

  const row = db.prepare("SELECT COUNT(*) AS count FROM links WHERE code = ?").get(code);
  if (row.count > 0) {
    return new Response(null, { status: 409 });
  }

  if (!/^https?:\/\//i.test(long)) {
    long = "https://" + long;
  }

  db.prepare("INSERT INTO links (long, code) VALUES (?, ?)").run(long, code);

  return new Response(null, { status: 200 });
}
