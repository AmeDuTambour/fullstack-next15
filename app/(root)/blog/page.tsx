import ArticleCarousel from "@/components/shared/article-carousel";
import { getAllArticles } from "@/lib/actions/article.actions";
import { Article } from "@/types";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
};

/**
 * Rendu à la demande, jamais au build.
 *
 * Cette page lit le catalogue : la prérendre obligerait `next build` à joindre
 * la base, et un déploiement échouerait dès que Neon dort. Le contenu reste
 * servi en SSR complet, donc indexable.
 */
export const dynamic = "force-dynamic";

const BlogPage = async () => {
  const { data } = (await getAllArticles({
    filter: "published",
    withSorting: true,
  })) as { data: Record<string, Article[]> };

  return (
    <div className="flex flex-col gap-4">
      {Object.keys(data).map((key) => (
        <ArticleCarousel key={key} title={key} data={data[key]} />
      ))}
    </div>
  );
};

export default BlogPage;
