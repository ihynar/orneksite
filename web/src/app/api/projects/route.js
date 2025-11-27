import pool from "@/lib/db";
import { verifyAuth } from "@/lib/auth";

export async function GET() {
  try {
    const { rows } = await pool.query(
      "SELECT id, title, summary, image_url, status, tags, completed_on, created_at FROM projects ORDER BY created_at DESC",
    );
    return Response.json(rows);
  } catch (err) {
    console.error(err);
    return Response.json({ message: "Projeler alınamadı" }, { status: 500 });
  }
}

export async function POST(request) {
  const user = verifyAuth(request);
  if (!user) return Response.json({ message: "Yetkisiz" }, { status: 401 });
  const body = await request.json();
  const { title, summary, image_url, status, tags, completed_on } = body || {};
  if (!title) return Response.json({ message: "Başlık zorunlu" }, { status: 400 });
  try {
    const { rows } = await pool.query(
      "INSERT INTO projects (title, summary, image_url, status, tags, completed_on) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
      [title, summary || "", image_url || "", status || "devam ediyor", tags || [], completed_on || null],
    );
    return Response.json(rows[0], { status: 201 });
  } catch (err) {
    console.error(err);
    return Response.json({ message: "Proje oluşturulamadı" }, { status: 500 });
  }
}
