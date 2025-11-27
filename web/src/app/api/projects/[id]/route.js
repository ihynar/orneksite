import pool from "@/lib/db";
import { verifyAuth } from "@/lib/auth";
import { safeNumber } from "@/lib/utils";

export async function PUT(request, { params }) {
  const user = verifyAuth(request);
  if (!user) return Response.json({ message: "Yetkisiz" }, { status: 401 });
  const id = safeNumber(params.id);
  if (!id) return Response.json({ message: "Geçersiz ID" }, { status: 400 });
  const body = await request.json();
  const { title, summary, image_url, status, tags, completed_on } = body || {};
  try {
    const { rows } = await pool.query(
      "UPDATE projects SET title=$1, summary=$2, image_url=$3, status=$4, tags=$5, completed_on=$6 WHERE id=$7 RETURNING *",
      [title, summary || "", image_url || "", status || "devam ediyor", tags || [], completed_on || null, id],
    );
    return Response.json(rows[0]);
  } catch (err) {
    console.error(err);
    return Response.json({ message: "Proje güncellenemedi" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const user = verifyAuth(request);
  if (!user) return Response.json({ message: "Yetkisiz" }, { status: 401 });
  const id = safeNumber(params.id);
  if (!id) return Response.json({ message: "Geçersiz ID" }, { status: 400 });
  try {
    await pool.query("DELETE FROM projects WHERE id=$1", [id]);
    return new Response(null, { status: 204 });
  } catch (err) {
    console.error(err);
    return Response.json({ message: "Proje silinemedi" }, { status: 500 });
  }
}
