import { db } from "../lib/db";

export async function GET(req) {
  const code = req.url.split("/").pop();
  const result = db.prepare("SELECT long FROM links WHERE code = ?").get(code);

  return new Response(null, {
    status: 302,
    headers: {
      Location: result ? result.long : "/undefined"
    }
  });
}
