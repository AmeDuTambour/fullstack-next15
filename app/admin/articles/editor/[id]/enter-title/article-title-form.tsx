"use client";

import { Button } from "@/components/ui/button";
import { ControllerRenderProps, SubmitHandler, useForm } from "react-hook-form";

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
import { createArticle, updateArticle } from "@/lib/actions/article.actions";
import { insertArticleSchema } from "@/lib/validators";
import { useEffect, useTransition } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import Link from "next/link";

type ArticleTitleFormProps = {
  article?: Article;
};

const ArticleTitleForm: React.FC<ArticleTitleFormProps> = ({ article }) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof insertArticleSchema>>({
    resolver: zodResolver(insertArticleSchema),
    defaultValues: article || articleFormDefaultValues,
  });

  const { watch, setValue, getValues, formState } = form;
  const title = watch("title");
  const slug = watch("slug");

  const debouncedTitle = useDebounce(title, 1000);
  const debouncedSlug = useDebounce(slug, 500);

  const saveArticle: SubmitHandler<
    z.infer<typeof insertArticleSchema>
  > = async (values) => {
    startTransition(async () => {
      if (!article) {
        const res = await createArticle(values);
        if (!res.success) {
          toast({ variant: "destructive", description: res.message });
        } else {
          const createdArticleId = res.data?.id;
          toast({ description: res.message });
          router.replace(
            `/admin/articles/editor/${createdArticleId}/enter-title`
          );
        }
      } else {
        const res = await updateArticle({ ...values, id: article.id });
        if (!res.success) {
          toast({ variant: "destructive", description: res.message });
        } else {
          toast({ description: res.message });
        }
      }
    });
  };

  useEffect(() => {
    if (formState.isValid) {
      saveArticle(getValues());
    }
  }, [debouncedTitle, debouncedSlug]);

  return (
    <>
      <Form {...form}>
        <form method="POST" className="space-y-8">
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
                          setValue(
                            "slug",
                            encodeURI(
                              slugify(getValues("title"), { lower: true })
                            )
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
        </form>
      </Form>
      <div className="flex justify-end">
        <Button
          disabled={!article || isPending}
          type="button"
          variant="default"
        >
          <Link href={`/admin/articles/editor/${article?.id}/add-sections`}>
            Next
          </Link>
        </Button>
      </div>
    </>
  );
};

export default ArticleTitleForm;
