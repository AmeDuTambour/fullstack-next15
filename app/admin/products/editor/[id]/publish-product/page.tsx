import EditorSteps from "@/components/shared/editor-steps";
import { getProductById } from "@/lib/actions/product.actions";
import PublishProductForm from "./publish-product-form";

const PublishArticlePage = async (props: {
  params: Promise<{
    id: string;
  }>;
}) => {
  const { id } = await props.params;

  let product = null;
  if (id && id !== "new") {
    product = await getProductById(id);
  }
  return (
    <>
      <EditorSteps current={2} mode="product" />
      <div className="space-y-8 max-w-5xl mx-auto">
        <h1 className="h2-bold">Publish Product</h1>
        <PublishProductForm product={product ?? undefined} />
      </div>
    </>
  );
};

export default PublishArticlePage;
