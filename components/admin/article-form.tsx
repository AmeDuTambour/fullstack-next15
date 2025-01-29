"use client";

import { articleFormDefaultValues } from "@/lib/constants";
import { insertArticleSchema, updateArticleSchema } from "@/lib/validators";
import { Article } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, ControllerRenderProps } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { z } from "zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import slugify from "slugify";
import { useEffect, useState } from "react";
import { PlusIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ParagraphEditor } from "./paragraph-editor";

type ArticleFormProps = {
  type: "Create" | "Update";
  article?: Article;
  articleId?: string;
};

const ArticleForm: React.FC<ArticleFormProps> = ({
  type,
  article,
  articleId,
}) => {
  const [paragraphFields, setParagraphFields] = useState([""]);

  const form = useForm<Zod.infer<typeof insertArticleSchema>>({
    resolver:
      type === "Create"
        ? zodResolver(insertArticleSchema)
        : zodResolver(updateArticleSchema),
    defaultValues:
      article && type === "Update" ? article : articleFormDefaultValues,
  });

  const addParagraph = () => {
    setParagraphFields([...paragraphFields, ""]);
  };

  const onSubmit = async () => {
    return;
  };

  const images = form.watch("images");
  const isFeatured = form.watch("isFeatured");
  const banner = form.watch("banner");

  return (
    <Form {...form}>
      <form
        method="POST"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        <div className="flex flex-col md:flex-row gap-5">
          <FormField
            control={form.control}
            name="title"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof insertArticleSchema>,
                "title"
              >;
            }) => (
              <FormItem className="w-full">
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter article title" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="slug"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof insertArticleSchema>,
                "slug"
              >;
            }) => (
              <FormItem className="w-full">
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input placeholder="Enter slug" {...field} />
                    <Button
                      type="button"
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-1 mt-2"
                      onClick={() => {
                        form.setValue(
                          "slug",
                          slugify(form.getValues("title"), { lower: true })
                        );
                      }}
                    >
                      Generate
                    </Button>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        {paragraphFields.map((_, i) => (
          <ParagraphEditor key={i} index={i} name={`Paragraph ${i + 1}`} />
        ))}
        <div className="flex justify-center md:flex-row">
          <Button type="button" variant="outline" onClick={addParagraph}>
            <PlusIcon /> Add paragraph
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ArticleForm;
