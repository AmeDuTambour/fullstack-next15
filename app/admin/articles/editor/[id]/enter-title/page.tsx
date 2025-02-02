import EditorSteps from "@/components/shared/editor-steps";
import ArticleTitleForm from "./article-title-form";
import {
  getArticleById,
  getArticleCategories,
} from "@/lib/actions/article.actions";

const EnterTitlePage = async (props: {
  params: Promise<{
    id: string;
  }>;
}) => {
  const { id } = await props.params;

  let article = null;
  if (id && id !== "new") {
    article = await getArticleById(id);
  }

  const { data } = await getArticleCategories();

  return (
    <>
      <EditorSteps current={0} />
      <div className="flex flex-col p-4 gap-4">
        <h1 className="h2-bold mt-4">Create an article</h1>
      </div>
      <ArticleTitleForm
        article={article ?? undefined}
        categories={data ?? []}
      />
    </>
  );
};

export default EnterTitlePage;
