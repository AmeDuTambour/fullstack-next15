"use client";

import * as React from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  createArticleCategory,
  deleteArticleCategory,
  updateArticleCategory,
} from "@/lib/actions/article.actions";
import { ArticleCategory } from "@prisma/client";
import { formatError } from "@/lib/utils";

type FormData = {
  name: string;
};

type CategoryFormProps = {
  category?: ArticleCategory;
  articleId?: string;
  onClose: () => void;
};

export function CategoryForm({
  category,
  articleId,
  onClose,
}: CategoryFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: { name: "" },
  });

  const { toast } = useToast();

  useEffect(() => {
    if (category) {
      reset({ name: category.name });
    }
  }, [category, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      const result = category
        ? await updateArticleCategory(category.id, data.name, articleId)
        : await createArticleCategory(data.name, articleId);

      if (!result.success) {
        toast({ variant: "destructive", description: result.message });
        return;
      }

      toast({
        description: category
          ? "Category updated successfully"
          : "Category created successfully",
      });

      reset();
      onClose();
    } catch (error) {
      toast({
        variant: "destructive",
        description: formatError(error),
      });
    }
  };

  const handleDelete = async () => {
    if (category?.id) {
      const res = await deleteArticleCategory(category.id, articleId);
      if (!res.success) {
        toast({ variant: "destructive", description: res.message });
        return;
      }
      toast({ description: "Category deleted successfully" });
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
      <div className="w-full flex justify-center font-semibold">
        {category ? "Update Category" : "Create Category"}
      </div>

      <Input
        placeholder="Category name"
        {...register("name", { required: "This field is required" })}
      />
      {errors.name && (
        <p className="text-red-500 text-sm">{errors.name.message}</p>
      )}

      <Button type="submit" className="w-full">
        {category ? "Update" : "Create"} Category
      </Button>

      {category && (
        <Button
          variant="destructive"
          className="w-full"
          type="button"
          onClick={handleDelete}
        >
          Delete
        </Button>
      )}
    </form>
  );
}
