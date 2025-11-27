import pool from "@/lib/db";
import { verifyAuth } from "@/lib/auth";
import { safeNumber } from "@/lib/utils";

export async function PUT(request, { params }) {
  const user = verifyAuth(request);
  if (!user) return Response.json({ message: "Yetkisiz" }, { status: 401 });
  const id = safeNumber(params.id);
  if (!id) return Response.json({ message: "Geçersiz ID" }, { status: 400 });
  const body = await request.json();
  const { status } = body || {};
  try {
    const { rows } = await pool.query(
      "UPDATE contact_requests SET status=$1 WHERE id=$2 RETURNING *",
      [status || "işleniyor", id],
    );
    return Response.json(rows[0]);
  } catch (err) {
    console.error(err);
    return Response.json({ message: "Durum güncellenemedi" }, { status: 500 });
  }
}
