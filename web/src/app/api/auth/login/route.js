import bcrypt from "bcryptjs";
import pool from "@/lib/db";
import { signToken } from "@/lib/auth";

export async function POST(request) {
  const body = await request.json();
  const { email, password } = body || {};
  if (!email || !password) {
    return Response.json({ message: "E-posta ve şifre zorunlu" }, { status: 400 });
  }

  try {
    const { rows } = await pool.query(
      "SELECT id, email, name, password_hash FROM admins WHERE email=$1 LIMIT 1",
      [email],
    );
    if (!rows.length) {
      return Response.json({ message: "Geçersiz bilgiler" }, { status: 401 });
    }
    const admin = rows[0];
    const match = await bcrypt.compare(password, admin.password_hash);
    if (!match) {
      return Response.json({ message: "Geçersiz bilgiler" }, { status: 401 });
    }
    const token = signToken({ id: admin.id, email: admin.email, name: admin.name });
    return Response.json({
      token,
      admin: { id: admin.id, email: admin.email, name: admin.name },
    });
  } catch (err) {
    console.error(err);
    return Response.json({ message: "Giriş yapılamadı" }, { status: 500 });
  }
}
