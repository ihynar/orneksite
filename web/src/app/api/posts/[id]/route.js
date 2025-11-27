import pool from "@/lib/db";
import { verifyAuth } from "@/lib/auth";
import { safeNumber } from "@/lib/utils";

export async function GET(_request, { params }) {
  const id = safeNumber(params.id);
  if (!id) return Response.json({ message: "Geçersiz ID" }, { status: 400 });
  try {
    const { rows } = await pool.query(
      "SELECT id, title, slug, excerpt, content, cover_image, created_at FROM posts WHERE id=$1",
      [id],
    );
    if (!rows.length) return Response.json({ message: "Bulunamadı" }, { status: 404 });
    return Response.json(rows[0]);
  } catch (err) {
    console.error(err);
    return Response.json({ message: "Yazı getirilemedi" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const user = verifyAuth(request);
  if (!user) return Response.json({ message: "Yetkisiz" }, { status: 401 });
  const id = safeNumber(params.id);
  if (!id) return Response.json({ message: "Geçersiz ID" }, { status: 400 });
  const body = await request.json();
  const { title, excerpt, content, cover_image } = body || {};
  try {
    const slug =
      title?.toLowerCase().replace(/[^a-z0-9ğüşıöç\s-]/gi, "").trim().replace(/\s+/g, "-") || null;
    const { rows } = await pool.query(
      "UPDATE posts SET title=$1, slug=COALESCE($2, slug), excerpt=$3, content=$4, cover_image=$5 WHERE id=$6 RETURNING *",
      [title, slug, excerpt || "", content, cover_image || "", id],
    );
    return Response.json(rows[0]);
  } catch (err) {
    console.error(err);
    return Response.json({ message: "Yazı güncellenemedi" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const user = verifyAuth(request);
  if (!user) return Response.json({ message: "Yetkisiz" }, { status: 401 });
  const id = safeNumber(params.id);
  if (!id) return Response.json({ message: "Geçersiz ID" }, { status: 400 });
  try {
    await pool.query("DELETE FROM posts WHERE id=$1", [id]);
    return new Response(null, { status: 204 });
  } catch (err) {
    console.error(err);
    return Response.json({ message: "Yazı silinemedi" }, { status: 500 });
  }
}
