import Link from "next/link";
import { Metadata } from "next";

import ContentImage from "@/components/ui/content-image";
import EmptyState from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { getAllArticles } from "@/lib/actions/article.actions";
import { blog as t } from "@/lib/labels";
import { formatDateTime } from "@/lib/utils";
import { Article } from "@/types";

export const metadata: Metadata = { title: "Le journal de l'atelier" };

/**
 * Rendu à la demande, jamais au build : cette page lit la base.
 */
export const dynamic = "force-dynamic";

const BlogPage = async () => {
  const { data } = (await getAllArticles({
    filter: "published",
  })) as { data: Article[] };

  const articles = Array.isArray(data) ? data : [];

  return (
    <div className="space-y-8">
      <h1 className="page-title">{t.title}</h1>

      {articles.length === 0 ? (
        <EmptyState message={t.noArticles} />
      ) : (
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <li key={article.id}>
              <Link
                href={`/blog/${article.slug}`}
                className="group block space-y-3"
              >
                <ContentImage
                  src={article.thumbnail}
                  alt={article.title}
                  width={600}
                  height={400}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="aspect-[3/2] w-full rounded-lg object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                />
                <div className="space-y-1">
                  {article.category ? (
                    <Badge variant="secondary">{article.category.name}</Badge>
                  ) : null}
                  <h2 className="section-title">{article.title}</h2>
                  <p className="text-sm text-muted-foreground">
                    {formatDateTime(article.createdAt).dateOnly}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BlogPage;
