"use client";

import { Button } from "@/components/ui/button";
import { ArrowRightFromLineIcon, Loader } from "lucide-react";
import Link from "next/link";
import { ControllerRenderProps, SubmitHandler, useForm } from "react-hook-form";
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
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { createArticle } from "@/lib/actions/article.actions";
import { useEffect } from "react";

type ArticleTitleFormProps = {
  article?: Article;
};

const ArticleTitleForm: React.FC<ArticleTitleFormProps> = ({ article }) => {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof insertArticleSchema>>({
    resolver: zodResolver(insertArticleSchema),
    defaultValues: article || articleFormDefaultValues,
  });

  const onSubmit: SubmitHandler<z.infer<typeof insertArticleSchema>> = async (
    values
  ) => {
    if (!article) {
      const res = await createArticle(values);
      if (!res.success) {
        toast({
          variant: "destructive",
          description: res.message,
        });
      } else {
        console.log("RESPONSSE : ", res);
        const createdArticleId = res.data?.id;
        router.push(`/admin/articles/editor/${createdArticleId}/add-sections`);
      }
    } else {
      // UPDATE
    }
  };

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
                        form.trigger();
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
        <Button
          variant="outline"
          type="submit"
          className="w-fit"
          disabled={!form.formState.isValid || form.formState.isSubmitting}
        >
          <div className="flex">
            {form.formState.isSubmitting ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <ArrowRightFromLineIcon />
            )}
            Start writing
          </div>
        </Button>
      </form>
    </Form>
  );
};

export default ArticleTitleForm;
