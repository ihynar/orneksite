import pool from "@/lib/db";
import { verifyAuth } from "@/lib/auth";

export async function GET() {
  try {
    const { rows } = await pool.query(
      "SELECT id, title, slug, excerpt, content, cover_image, created_at FROM posts ORDER BY created_at DESC",
    );
    return Response.json(rows);
  } catch (err) {
    console.error(err);
    return Response.json({ message: "Yazılar alınamadı" }, { status: 500 });
  }
}

export async function POST(request) {
  const user = verifyAuth(request);
  if (!user) return Response.json({ message: "Yetkisiz" }, { status: 401 });
  const body = await request.json();
  const { title, excerpt, content, cover_image } = body || {};
  if (!title || !content) {
    return Response.json({ message: "Başlık ve içerik zorunlu" }, { status: 400 });
  }
  const slug = title.toLowerCase().replace(/[^a-z0-9ğüşıöç\s-]/gi, "").trim().replace(/\s+/g, "-");
  try {
    const { rows } = await pool.query(
      "INSERT INTO posts (title, slug, excerpt, content, cover_image) VALUES ($1,$2,$3,$4,$5) RETURNING *",
      [title, slug, excerpt || "", content, cover_image || ""],
    );
    return Response.json(rows[0], { status: 201 });
  } catch (err) {
    console.error(err);
    return Response.json({ message: "Yazı eklenemedi" }, { status: 500 });
  }
}
