import pool from "@/lib/db";
import { verifyAuth } from "@/lib/auth";

export async function GET(request) {
  const user = verifyAuth(request);
  if (!user) return Response.json({ message: "Yetkisiz" }, { status: 401 });
  try {
    const { rows } = await pool.query(
      "SELECT id, full_name, phone, email, message, preferred_service, status, created_at FROM contact_requests ORDER BY created_at DESC",
    );
    return Response.json(rows);
  } catch (err) {
    console.error(err);
    return Response.json({ message: "Talepler alınamadı" }, { status: 500 });
  }
}

export async function POST(request) {
  const body = await request.json();
  const { full_name, phone, email, message, preferred_service } = body || {};
  if (!full_name || !phone) {
    return Response.json({ message: "İsim ve telefon zorunlu" }, { status: 400 });
  }
  try {
    const { rows } = await pool.query(
      "INSERT INTO contact_requests (full_name, phone, email, message, preferred_service) VALUES ($1,$2,$3,$4,$5) RETURNING *",
      [full_name, phone, email || "", message || "", preferred_service || ""],
    );
    return Response.json(rows[0], { status: 201 });
  } catch (err) {
    console.error(err);
    return Response.json({ message: "Talep gönderilemedi" }, { status: 500 });
  }
}
