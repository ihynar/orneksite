import pool from "@/lib/db";
import { verifyAuth } from "@/lib/auth";

export async function GET() {
  try {
    const { rows } = await pool.query(
      "SELECT id, title, description, image_url, created_at FROM gallery_items ORDER BY created_at DESC",
    );
    return Response.json(rows);
  } catch (err) {
    console.error(err);
    return Response.json({ message: "Galeri alınamadı" }, { status: 500 });
  }
}

export async function POST(request) {
  const user = verifyAuth(request);
  if (!user) return Response.json({ message: "Yetkisiz" }, { status: 401 });
  const body = await request.json();
  const { title, description, image_url } = body || {};
  if (!image_url) return Response.json({ message: "Görsel URL zorunlu" }, { status: 400 });
  try {
    const { rows } = await pool.query(
      "INSERT INTO gallery_items (title, description, image_url) VALUES ($1,$2,$3) RETURNING *",
      [title || "", description || "", image_url],
    );
    return Response.json(rows[0], { status: 201 });
  } catch (err) {
    console.error(err);
    return Response.json({ message: "Galeri öğesi eklenemedi" }, { status: 500 });
  }
}
