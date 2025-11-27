import pool from "@/lib/db";
import { verifyAuth } from "@/lib/auth";

export async function GET() {
  try {
    const { rows } = await pool.query(
      "SELECT id, title, description, price, created_at FROM services ORDER BY created_at DESC",
    );
    return Response.json(rows);
  } catch (err) {
    console.error(err);
    return Response.json({ message: "Hizmet listesi alınamadı" }, { status: 500 });
  }
}

export async function POST(request) {
  const user = verifyAuth(request);
  if (!user) return Response.json({ message: "Yetkisiz" }, { status: 401 });
  const body = await request.json();
  const { title, description, price } = body || {};
  if (!title || !description) {
    return Response.json({ message: "Başlık ve açıklama zorunlu" }, { status: 400 });
  }
  try {
    const { rows } = await pool.query(
      "INSERT INTO services (title, description, price) VALUES ($1,$2,$3) RETURNING *",
      [title, description, price ?? null],
    );
    return Response.json(rows[0], { status: 201 });
  } catch (err) {
    console.error(err);
    return Response.json({ message: "Hizmet oluşturulamadı" }, { status: 500 });
  }
}
