import { Metadata } from "next";
import { Suspense } from "react";

import ArticleCarousel from "@/components/shared/article-carousel";
import EmptyState from "@/components/shared/empty-state";
import { ArticleGridSkeleton } from "@/components/shared/skeletons";
import { getAllArticles } from "@/lib/actions/article.actions";
import { blog as t } from "@/lib/labels";
import { Article } from "@/types";

export const metadata: Metadata = { title: t.title };

/**
 * Rendu à la demande, jamais au build : cette page lit la base.
 */
export const dynamic = "force-dynamic";

/**
 * Isolée pour être suspendable. Une frontière posée ici ne concerne que cette
 * page — contrairement à un `loading.tsx` sur `/blog`, qui couvrirait aussi
 * `/blog/[slug]` et rendrait ses 404 muets.
 */
const CategorySections = async () => {
  const { data } = (await getAllArticles({
    filter: "published",
    withSorting: true,
  })) as { data: Record<string, Article[]> };

  const categories = Object.keys(data ?? {});
  if (categories.length === 0) return <EmptyState message={t.noArticles} />;

  return (
    <div className="space-y-12">
      {categories.map((category) => (
        <ArticleCarousel
          key={category}
          title={category === "uncategorized" ? t.uncategorized : category}
          data={data[category]}
        />
      ))}
    </div>
  );
};

const BlogPage = () => (
  <div className="space-y-8">
    <h1 className="page-title">{t.title}</h1>
    <Suspense fallback={<ArticleGridSkeleton count={4} />}>
      <CategorySections />
    </Suspense>
  </div>
);

export default BlogPage;
