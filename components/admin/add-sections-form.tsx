"use client";

import { ArticleSection } from "@/types";
import { Button } from "../ui/button";
import { PlusIcon, TrashIcon } from "lucide-react";
import { SectionEditor } from "./section-editor";
import Link from "next/link";
import { createArticleSection } from "@/lib/actions/article.actions";
import { useToast } from "@/hooks/use-toast";

type ArticleSectionsFormProps = {
  sections: ArticleSection[];
  articleId: string;
};

const AddSectionsForm: React.FC<ArticleSectionsFormProps> = ({
  sections,
  articleId,
}) => {
  const { toast } = useToast();

  const addSection = async () => {
    const res = await createArticleSection(articleId);
    if (!res.success) {
      toast({ variant: "destructive", description: res.message });
    }
    toast({ description: res.message });
  };

  return (
    <div className="space-y-8">
      {sections.map((section, i) => (
        <div key={section.sectionId} className="border p-4 rounded-md">
          <SectionEditor index={i} data={section} />
          <div className="flex w-full justify-end">
            <Button
              type="button"
              variant="destructive"
              onClick={() => null}
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
        <Button asChild type="button" variant="outline">
          <Link href={`/admin/articles/editor/${articleId}/enter-title`}>
            Previous
          </Link>
        </Button>

        <Button asChild type="button" variant="outline">
          <Link href={`/admin/articles/editor/${articleId}/publish-article`}>
            Next
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default AddSectionsForm;
