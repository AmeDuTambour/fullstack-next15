import EditorSteps from "@/components/shared/editor-steps";
import {
  getAllProductCategories,
  getProductById,
} from "@/lib/actions/product.actions";
import { Metadata } from "next";
import BaseProductForm from "./base-product-form";

export const metadata: Metadata = {
  title: "Create a product",
};

const BaseProductPage = async (props: {
  params: Promise<{
    id: string;
  }>;
}) => {
  const { id } = await props.params;
  const categories = await getAllProductCategories();

  const product = id && id !== "new" ? await getProductById(id) : undefined;

  return (
    <>
      <EditorSteps current={0} mode="product" />
      <div className="flex flex-col p-4 gap-4">
        <h1 className="h2-bold mt-4">Create a product</h1>
      </div>
      <BaseProductForm product={product} categories={categories} />
    </>
  );
};

export default BaseProductPage;
