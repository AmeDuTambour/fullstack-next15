import EditorSteps from "@/components/shared/editor-steps";
import { getArticleById } from "@/lib/actions/article.actions";
import PublishArticleForm from "./publish-article-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { admin as t, common } from "@/lib/labels";

const PublishArticlePage = async (props: {
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
      <EditorSteps current={2} />
      <div className="space-y-8 max-w-5xl mx-auto">
        <h1 className="h2-bold">{t.publishArticleTitle}</h1>
        <PublishArticleForm article={article ?? undefined} />

        <div className="flex justify-between">
          <Button asChild type="button" variant="outline">
            <Link href={`/admin/articles/editor/${id}/add-sections`}>
              {common.previous}
            </Link>
          </Button>

          <Button asChild type="button" variant="outline">
            <Link href={`/admin/articles`}>{t.returnToArticles}</Link>
          </Button>
        </div>
      </div>
    </>
  );
};

export default PublishArticlePage;
