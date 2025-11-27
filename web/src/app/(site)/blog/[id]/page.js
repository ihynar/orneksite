"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";

export default function BlogDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/posts/${id}`)
      .then(({ data }) => setPost(data))
      .catch(() => setError("Yazı bulunamadı"));
  }, [id]);

  if (error) {
    return (
      <div className="container py-5">
        <p className="text-muted">{error}</p>
        <Link href="/blog" className="btn btn-outline-primary">
          Bloga dön
        </Link>
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="container py-5">
      <Link href="/blog" className="btn btn-link mb-3">
        &larr; Tüm yazılar
      </Link>
      {post.cover_image && (
        <img src={post.cover_image} alt={post.title} className="img-fluid rounded shadow mb-4" />
      )}
      <h1 className="mb-3">{post.title}</h1>
      <p className="text-muted">
        {new Date(post.created_at).toLocaleDateString("tr-TR", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })}
      </p>
      <p className="lead">{post.excerpt}</p>
      <article className="fs-5">{post.content}</article>
    </div>
  );
}
