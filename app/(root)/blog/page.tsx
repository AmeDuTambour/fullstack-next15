import ArticleCarousel from "@/components/shared/article-carousel";
import { getAllArticles } from "@/lib/actions/article.actions";

const BlogPage = async () => {
  const { data } = await getAllArticles({
    filter: "published",
    withSorting: true,
  });

  const catKeys = Object.keys(data);

  return (
    <div className="flex flex-col gap-4">
      {catKeys.map((key) => (
        <ArticleCarousel key={key} title={key} data={data[key]} />
      ))}
    </div>
  );
};

export default BlogPage;
