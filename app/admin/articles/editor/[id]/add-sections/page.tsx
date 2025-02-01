import AddSectionsForm from "@/components/admin/add-sections-form";
import EditorSteps from "@/components/shared/editor-steps";
import {
  getAllArticleSections,
  getArticleById,
} from "@/lib/actions/article.actions";
import { notFound } from "next/navigation";

const AddSectionsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const articleId = (await params).id;
  const sections = await getAllArticleSections(articleId);
  if (!sections) notFound();

  return (
    <>
      <EditorSteps current={1} />
      <div className="space-y-8 max-w-5xl mx-auto">
        <h1 className="h2-bold">Add Sections</h1>
        <AddSectionsForm articleId={articleId} sections={sections.data} />
      </div>
    </>
  );
};

export default AddSectionsPage;
