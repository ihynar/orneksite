"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";

export default function PortfolioDetailPage() {
  const params = useParams();
  const { id } = params;
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/projects")
      .then(({ data }) => {
        const found = data.find((p) => String(p.id) === id);
        setProject(found || null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (!project && !loading) {
    return (
      <div className="container py-5">
        <p className="text-muted">Proje bulunamadı.</p>
        <Link href="/portfoy" className="btn btn-outline-primary">
          Listeye dön
        </Link>
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="container py-5">
      <Link href="/portfoy" className="btn btn-link mb-3">
        &larr; Tüm projeler
      </Link>
      <div className="row">
        <div className="col-md-6 mb-3">
          {project.image_url && (
            <img src={project.image_url} alt={project.title} className="img-fluid rounded shadow" />
          )}
        </div>
        <div className="col-md-6">
          <span className="badge bg-primary-subtle text-primary mb-2 text-uppercase">{project.status}</span>
          <h3>{project.title}</h3>
          <p className="lead">{project.summary}</p>
          {project.tags?.length ? (
            <div className="mb-2">
              {project.tags.map((tag) => (
                <span key={tag} className="badge bg-secondary-subtle text-secondary me-2">
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
          {project.completed_on && (
            <p className="text-muted">
              Tamamlanma: {new Date(project.completed_on).toLocaleDateString("tr-TR")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
