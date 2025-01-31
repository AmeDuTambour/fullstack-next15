"use client";

import { articleSectionFormDefaultValues } from "@/lib/constants";
import {
  insertArticleSectionSchema,
  updateArticleSectionSchema,
} from "@/lib/validators";
import { Article, ArticleSection } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { Form } from "../ui/form";
import { Button } from "../ui/button";
import { PlusIcon, TrashIcon } from "lucide-react";
import { SectionEditor } from "./section-editor";
import Link from "next/link";
import { useEffect, useTransition } from "react";
import {
  createArticleSection,
  updateArticleSection,
} from "@/lib/actions/article.actions";
import { useToast } from "@/hooks/use-toast";

type ArticleFormProps = {
  article: Article;
};

const AddSectionsForm: React.FC<ArticleFormProps> = ({ article }) => {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof updateArticleSectionSchema>>({
    resolver: zodResolver(updateArticleSectionSchema),
    defaultValues: {
      sections: article.sections,
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "sections",
  });

  const addSection = async () => {
    // const res = await createArticleSection();
    append(articleSectionFormDefaultValues);
  };

  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  // TODO Move the section update request toward the SectionEditor component ??
  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

  const handleOnSave: SubmitHandler<ArticleSection> = async (
    section: ArticleSection
  ) => {
    startTransition(async () => {
      console.log("1");

      if (!section.sectionId) {
        console.log("2");
        const validationResult = insertArticleSectionSchema.safeParse({
          ...section,
          articleId: article.id,
        });
        if (validationResult.success) {
          const res = await createArticleSection({
            ...section,
            articleId: article.id,
          });
          if (!res.success) {
            toast({
              variant: "destructive",
              description: res.message,
            });
          }
          // update(res.data?.position - 1, res.data);
        }
      } else {
        console.log("3");
        const res = await updateArticleSection({
          ...section,
          articleId: article.id,
        });
        if (!res.success) {
          toast({
            variant: "destructive",
            description: res.message,
          });
        }
        // update(res.data?.position - 1, res.data);
      }
    });
  };

  return (
    <Form {...form}>
      <form method="POST" className="space-y-8">
        {fields.map((section, i) => (
          <div key={section.id} className="border p-4 rounded-md">
            <SectionEditor index={i} onSave={handleOnSave} data={section} />
            <div className="flex w-full justify-end">
              <Button
                type="button"
                variant="destructive"
                onClick={() => remove(i)}
                className="mt-2"
              >
                <TrashIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
        <div className="flex justify-center">
          <Button type="button" variant="outline" onClick={addSection}>
            <PlusIcon /> Add Section
          </Button>
        </div>
        <div className="flex justify-between">
          <Button asChild disabled={isPending} type="button" variant="outline">
            <Link href={`/admin/articles/editor/${article.id}/enter-title`}>
              Previous
            </Link>
          </Button>

          <Button asChild disabled={isPending} type="button" variant="outline">
            <Link href={`/admin/articles/editor/${article.id}/publish-article`}>
              Next
            </Link>
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddSectionsForm;
