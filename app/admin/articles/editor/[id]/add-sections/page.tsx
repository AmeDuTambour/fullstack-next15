import ArticleForm from "@/components/admin/article-form";
import EditorSteps from "@/components/shared/editor-steps";

const AddSectionsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const articleId = (await params).id;

  return (
    <>
      <EditorSteps current={1} />
      <div className="space-y-8 max-w-5xl mx-auto">
        <h1 className="h2-bold">Create Article</h1>
        <ArticleForm type="Create" />
      </div>
    </>
  );
};

export default AddSectionsPage;
