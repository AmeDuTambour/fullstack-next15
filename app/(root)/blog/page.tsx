import ArticleCarousel from "@/components/shared/article-carousel";
import { getAllArticles } from "@/lib/actions/article.actions";
import { Article } from "@/types";

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
