"use client";

import { Button } from "@/components/ui/button";
import { SubmitHandler, useForm } from "react-hook-form";
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
import { useEffect, useState, useTransition } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import Link from "next/link";
import Image from "next/image";
import { UploadButton } from "@/lib/uploadthing";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EditIcon, PlusIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CategoryForm } from "./category-form";
import CategorySelectItem from "@/components/admin/category-select-item";
import { ArticleCategory } from "@prisma/client";

type ArticleTitleFormProps = {
  article?: Article;
  categories: ArticleCategory[];
};

const ArticleTitleForm: React.FC<ArticleTitleFormProps> = ({
  article,
  categories,
}) => {
  const [openEditCategoryId, setOpenEditCategoryId] = useState<string | null>(
    null
  );
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof insertArticleSchema>>({
    resolver: zodResolver(insertArticleSchema),
    defaultValues: article || articleFormDefaultValues,
    mode: "onChange",
  });

  const { watch, setValue, getValues, formState } = form;
  const title = watch("title");
  const slug = watch("slug");
  const categoryId = watch("categoryId");
  const thumbnail = watch("thumbnail");

  const debouncedTitle = useDebounce(title, 1000);
  const debouncedSlug = useDebounce(slug, 500);
  const debouncedCategory = useDebounce(categoryId, 500);
  const debouncedThumbnail = useDebounce(thumbnail, 500);

  const saveArticle: SubmitHandler<
    z.infer<typeof insertArticleSchema>
  > = async (values) => {
    startTransition(async () => {
      const action = article
        ? () => updateArticle({ ...values, id: article.id })
        : () => createArticle(values);

      const res = await action();
      if (!res.success) {
        toast({ variant: "destructive", description: res.message });
      } else {
        toast({ description: res.message });
        if (!article) {
          router.replace(`/admin/articles/editor/${res.data?.id}/enter-title`);
        }
      }
    });
  };

  useEffect(() => {
    if (formState.isValid) {
      saveArticle(getValues());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedTitle, debouncedSlug, debouncedCategory, debouncedThumbnail]);

  return (
    <>
      <Form {...form}>
        <form method="POST" className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
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

          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-4">
                    <Select
                      value={field.value ?? undefined}
                      onValueChange={(value) => {
                        form.setValue("categoryId", value, {
                          shouldValidate: true,
                        });
                      }}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <div key={category.id}>
                            <SelectItem value={category.id}>
                              <CategorySelectItem category={category} />
                            </SelectItem>
                            <Popover
                              open={openEditCategoryId === category.id}
                              onOpenChange={(isOpen) =>
                                setOpenEditCategoryId(
                                  isOpen ? category.id : null
                                )
                              }
                            >
                              <PopoverTrigger asChild>
                                <div className="w-full flex justify-end p-1">
                                  <Button variant="ghost" size="icon">
                                    <EditIcon className="h-4 w-4 text-blue-500" />
                                  </Button>
                                </div>
                              </PopoverTrigger>
                              <PopoverContent className="p-4 w-64">
                                <CategoryForm
                                  category={category}
                                  onClose={() => setOpenEditCategoryId(null)}
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                        ))}
                      </SelectContent>
                    </Select>

                    <Popover open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                      <PopoverTrigger>
                        <PlusIcon className="h-6 w-6 text-blue-700 cursor-pointer" />
                      </PopoverTrigger>
                      <PopoverContent className="p-4 w-64">
                        <CategoryForm onClose={() => setIsCreateOpen(false)} />
                      </PopoverContent>
                    </Popover>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="thumbnail"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Thumbnail</FormLabel>
                <div className="flex items-center space-x-2">
                  {field.value && (
                    <Image
                      src={field.value}
                      alt={`Thumbnial`}
                      className="w-20 h-20 object-cover object-center rounded-sm"
                      width={100}
                      height={100}
                    />
                  )}
                  <FormControl>
                    <UploadButton
                      endpoint="imageUploader"
                      onClientUploadComplete={(res: { url: string }[]) => {
                        form.setValue("thumbnail", res[0].url, {
                          shouldValidate: true,
                        });
                      }}
                      onUploadError={(error: Error) => {
                        toast({
                          variant: "destructive",
                          description: `Error: ${error.message}`,
                        });
                      }}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
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
