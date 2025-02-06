import EditorSteps from "@/components/shared/editor-steps";
import ProductSpecificationsForm from "./product-specifications-form";
import {
  getAllDrumDimensions,
  getAllProductCategories,
  getAllSkinTypes,
  getProductById,
} from "@/lib/actions/product.actions";
import { notFound } from "next/navigation";
import { getProductCategory } from "@/lib/utils";

const SpecificationsPage = async (props: {
  params: Promise<{
    id: string;
  }>;
}) => {
  const { id } = await props.params;

  const product = await getProductById(id, true);
  const categories = await getAllProductCategories();
  if (!product) notFound();

  const { name } = getProductCategory(product.categoryId, categories);

  const formOptions: Record<string, Record<string, string>[]> = {};

  if (name === "Drum") {
    const skinTypes = await getAllSkinTypes();
    const dimensions = await getAllDrumDimensions();
    formOptions["skinTypes"] = skinTypes;
    formOptions["dimensions"] = dimensions;
  }

  return (
    <>
      <EditorSteps current={1} mode="product" />
      <div className="flex flex-col p-4 gap-4">
        <h1 className="h2-bold mt-4">Create a product</h1>
      </div>
      <ProductSpecificationsForm category={name} formOptions={formOptions} />
    </>
  );
};

export default SpecificationsPage;
