import pool from "@/lib/db";
import { verifyAuth } from "@/lib/auth";
import { safeNumber } from "@/lib/utils";

export async function PUT(request, { params }) {
  const user = verifyAuth(request);
  if (!user) return Response.json({ message: "Yetkisiz" }, { status: 401 });
  const id = safeNumber(params.id);
  if (!id) return Response.json({ message: "Geçersiz ID" }, { status: 400 });
  const body = await request.json();
  const { title, description, price } = body || {};
  try {
    const { rows } = await pool.query(
      "UPDATE services SET title=$1, description=$2, price=$3 WHERE id=$4 RETURNING *",
      [title, description, price ?? null, id],
    );
    return Response.json(rows[0]);
  } catch (err) {
    console.error(err);
    return Response.json({ message: "Hizmet güncellenemedi" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const user = verifyAuth(request);
  if (!user) return Response.json({ message: "Yetkisiz" }, { status: 401 });
  const id = safeNumber(params.id);
  if (!id) return Response.json({ message: "Geçersiz ID" }, { status: 400 });
  try {
    await pool.query("DELETE FROM services WHERE id=$1", [id]);
    return new Response(null, { status: 204 });
  } catch (err) {
    console.error(err);
    return Response.json({ message: "Hizmet silinemedi" }, { status: 500 });
  }
}
