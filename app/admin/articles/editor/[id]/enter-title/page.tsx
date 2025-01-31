import EditorSteps from "@/components/shared/editor-steps";
import ArticleTitleForm from "./article-title-form";
import { getArticleById } from "@/lib/actions/article.actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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

  return (
    <>
      <EditorSteps current={0} />
      <div className="flex flex-col p-4 gap-4">
        <h1 className="h2-bold mt-4">Enter a title, and generate a slug</h1>
      </div>
      <ArticleTitleForm article={article ?? undefined} />
      {/* <div className="flex justify-end">
        <Button disabled={!article} type="button" variant="default">
          <Link href={`/admin/articles/editor/${article?.id}/add-sections`}>
            Next
          </Link>
        </Button>
      </div> */}
    </>
  );
};

export default EnterTitlePage;
