import { getArticleBySlug } from "@/lib/actions/article.actions";
import { notFound } from "next/navigation";
import ArticleSectionBlock from "./article-section-block";
import { formatDateTime } from "@/lib/utils";
import ShareButton from "@/components/shared/share-button";
import { Separator } from "@/components/ui/separator";

const ArticlePage = async (props: {
  params: Promise<{
    slug: string;
  }>;
}) => {
  const { slug } = await props.params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  return (
    <div className="space-y-4 p-8 max-w-5xl mx-auto">
      {" "}
      <h1 className="h1-bold text-4xl">{article.title}</h1>{" "}
      <Separator className="my-2" />
      <div className="flex justify-between px-4">
        <p className="text-gray-500 italic pb-4">
          {formatDateTime(article.createdAt).dateOnly}
        </p>
        <ShareButton
          title={article.title}
          url={`https://lamedutambour.com/blog/${slug}`}
        />
      </div>
      <Separator className="my-2" />
      {article.sections.map((section) => (
        <div key={section.sectionId} className="pt-16">
          {" "}
          {/* Espacement réduit */}
          <ArticleSectionBlock section={section} />
        </div>
      ))}
    </div>
  );
};

export default ArticlePage;
