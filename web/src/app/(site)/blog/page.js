"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";

export default function BlogPage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    api
      .get("/posts")
      .then(({ data }) => setPosts(data))
      .catch(() => setPosts([]));
  }, []);

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Blog</h2>
          <p className="text-muted mb-0">Temizlik ipuçları, vaka hikayeleri ve pratik tavsiyeler</p>
        </div>
        <Link className="btn btn-cta" href="/iletisim">
          Teklif Al
        </Link>
      </div>
      <div className="row">
        {posts.map((post) => (
          <div className="col-md-4 mb-4" key={post.id}>
            <div className="card h-100 shadow-sm">
              {post.cover_image && <img src={post.cover_image} className="card-img-top" alt={post.title} />}
              <div className="card-body d-flex flex-column">
                <h5>{post.title}</h5>
                <p className="text-muted flex-grow-1">{post.excerpt || post.content?.slice(0, 120)}</p>
                <Link href={`/blog/${post.id}`} className="btn btn-outline-primary btn-sm">
                  Oku
                </Link>
              </div>
            </div>
          </div>
        ))}
        {!posts.length && <p className="text-muted">Henüz blog yazısı eklenmedi.</p>}
      </div>
    </div>
  );
}
