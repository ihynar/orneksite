import pool from "@/lib/db";
import { verifyAuth } from "@/lib/auth";

export async function GET(request) {
  const user = verifyAuth(request);
  if (!user) return Response.json({ message: "Yetkisiz" }, { status: 401 });
  try {
    const [services, projects, gallery, posts, contacts] = await Promise.all([
      pool.query("SELECT COUNT(*) FROM services"),
      pool.query("SELECT COUNT(*) FROM projects"),
      pool.query("SELECT COUNT(*) FROM gallery_items"),
      pool.query("SELECT COUNT(*) FROM posts"),
      pool.query("SELECT COUNT(*) FILTER (WHERE status = $1) FROM contact_requests", ["beklemede"]),
    ]);

    const recentRequests = await pool.query(
      "SELECT id, full_name, phone, preferred_service, status, created_at FROM contact_requests ORDER BY created_at DESC LIMIT 5",
    );

    return Response.json({
      counts: {
        services: Number(services.rows[0].count),
        projects: Number(projects.rows[0].count),
        gallery: Number(gallery.rows[0].count),
        posts: Number(posts.rows[0].count),
        pendingRequests: Number(contacts.rows[0].count),
      },
      recentRequests: recentRequests.rows,
    });
  } catch (err) {
    console.error(err);
    return Response.json({ message: "Panel verisi alınamadı" }, { status: 500 });
  }
}
