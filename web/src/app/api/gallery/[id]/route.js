import pool from "@/lib/db";
import { verifyAuth } from "@/lib/auth";
import { safeNumber } from "@/lib/utils";

export async function DELETE(request, { params }) {
  const user = verifyAuth(request);
  if (!user) return Response.json({ message: "Yetkisiz" }, { status: 401 });
  const id = safeNumber(params.id);
  if (!id) return Response.json({ message: "Geçersiz ID" }, { status: 400 });
  try {
    await pool.query("DELETE FROM gallery_items WHERE id=$1", [id]);
    return new Response(null, { status: 204 });
  } catch (err) {
    console.error(err);
    return Response.json({ message: "Galeri öğesi silinemedi" }, { status: 500 });
  }
}
