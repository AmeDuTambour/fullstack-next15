import EditorSteps from "@/components/shared/editor-steps";
import ArticleTitleForm from "./article-title-form";

const EnterTitlePage = () => {
  return (
    <>
      <EditorSteps current={0} />
      <div className="flex flex-col p-4 gap-4">
        <h1 className="h2-bold mt-4">Enter a title, and generate a slug</h1>
      </div>
      <ArticleTitleForm />
    </>
  );
};

export default EnterTitlePage;
