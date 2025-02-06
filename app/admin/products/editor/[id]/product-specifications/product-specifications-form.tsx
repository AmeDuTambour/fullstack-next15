"use client";

import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";

type ProductSpecificationsProps = {
  category: string;
  formOptions?: Record<string, Record<string, string>[]>;
};

const ProductSpecificationsForm = ({
  category,
  formOptions,
}: ProductSpecificationsProps) => {
  const form = useForm();

  console.log("====================================");
  console.log(category);
  console.log(formOptions);
  console.log("====================================");

  const onSubmit = () => {
    return;
  };

  // Check product type and render the form accordingly

  return (
    <>
      <Form {...form}>
        <form
          method="POST"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8"
        >
          <div className="flex flex-col md:flex-row gap-5"></div>
        </form>
      </Form>
    </>
  );
};

export default ProductSpecificationsForm;
