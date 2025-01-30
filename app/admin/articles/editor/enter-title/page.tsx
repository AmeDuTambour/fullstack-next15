"use client";

import EditorSteps from "@/components/shared/editor-steps";
import { Button } from "@/components/ui/button";
import { ArrowRightFromLineIcon } from "lucide-react";
import Link from "next/link";
import { ControllerRenderProps, useForm } from "react-hook-form";
import { insertArticleSchema } from "../../../../../lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { articleFormDefaultValues } from "@/lib/constants";
import { z } from "zod";
import { Article } from "@/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import slugify from "slugify";

type EnterTitlePageProps = {
  article?: Article;
  articleId?: string;
};

const EnterTitlePage: React.FC<EnterTitlePageProps> = ({
  article,
  articleId,
}) => {
  const form = useForm<z.infer<typeof insertArticleSchema>>({
    resolver: zodResolver(insertArticleSchema),
    defaultValues: article || articleFormDefaultValues,
  });

  const onSubmit = () => {
    return;
  };

  return (
    <Form {...form}>
      <form
        method="POST"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        <EditorSteps current={0} />
        <div className="flex flex-col p-4 gap-4">
          <h1 className="h2-bold mt-4">Enter a title, and generate a slug</h1>
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
                    <Input placeholder="Enter title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col md:flex-row gap-5 mb-8">
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
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button asChild variant="outline" type="submit" className="w-fit">
            <Link href={`/admin/articles/editor/${articleId}/add-sections`}>
              <ArrowRightFromLineIcon />
              Start writing
            </Link>
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EnterTitlePage;
