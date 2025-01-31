"use server";

import { prisma } from "@/db/prisma";
import { convertToPlainObject, formatError } from "../utils";
import {
  insertArticleSchema,
  insertArticleSectionSchema,
  updateArticleSchema,
  updateArticleSectionSchema,
} from "../validators";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { PAGE_SIZE } from "../constants";

export async function getAllArticles({
  limit = PAGE_SIZE,
  page,
  filter,
}: {
  limit?: number;
  page: number;
  filter: "all" | "published" | "draft";
}) {
  const stateFilter: Prisma.ArticleWhereInput =
    filter && filter === "published"
      ? {
          isPublished: true,
        }
      : filter && filter === "draft"
        ? { isPublished: false }
        : {};

  const data = await prisma.article.findMany({
    where: {
      ...stateFilter,
    },
    include: { sections: true, comments: true },
    skip: (page - 1) * limit,
    take: limit,
  });
  const dataCount = await prisma.article.count();

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}

export async function getArticleById(id: string) {
  const data = await prisma.article.findFirst({
    where: { id },
    include: { sections: true, comments: true },
  });
  return convertToPlainObject(data);
}

export async function createArticle(data: z.infer<typeof insertArticleSchema>) {
  try {
    const newArticle = insertArticleSchema.parse(data);
    const res = await prisma.article.create({ data: newArticle });

    revalidatePath("/admin/articles");
    return {
      success: true,
      message: "Article created successfully",
      data: res,
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function updateArticle(data: z.infer<typeof updateArticleSchema>) {
  try {
    const article = updateArticleSchema.parse(data);
    const articleExists = await prisma.article.findFirst({
      where: { id: article.id },
    });
    if (!articleExists) throw new Error("Article not found");

    await prisma.article.update({ where: { id: article.id }, data: article });
    revalidatePath("/admin/articles");

    return { success: true, message: "Article updated successfully" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function deleteArticle(articleId: string) {
  try {
    const articleExists = await prisma.article.findFirst({
      where: { id: articleId },
    });
    if (!articleExists) throw new Error("Article not found");

    await prisma.article.delete({
      where: { id: articleId },
    });

    revalidatePath("/admin/articles");

    return { success: true, message: "Article deleted successfully" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function createArticleSection(
  data: z.infer<typeof insertArticleSectionSchema>
) {
  console.log("Wtf is going on here");

  try {
    console.log("Creating new section... ");
    const newSection = insertArticleSectionSchema.parse(data);
    console.log("... new section validated");

    const res = await prisma.articleSection.create({
      data: newSection,
    });
    console.log("Response from create request: ", res);
    revalidatePath(`/admin/articles/editor/${res.articleId}/add-sections`);
    return { success: true, message: "Section added successfully" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function updateArticleSection(
  data: z.infer<typeof updateArticleSectionSchema>
) {
  try {
    const section = updateArticleSectionSchema.parse(data);

    const sectionExists = await prisma.articleSection.findFirst({
      where: { id: section.id },
    });
    if (!sectionExists) throw new Error("Section not found");

    await prisma.articleSection.update({
      where: { id: section.id },
      data: {
        title: section.title,
        position: section.position,
        body: section.body,
        image: section.image || null,
        youTubeUrl: section.youTubeUrl || null,
      },
    });

    return { success: true, message: "Section updated successfully" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function deleteArticleSection(sectionId: string) {
  try {
    const sectionExists = await prisma.articleSection.findFirst({
      where: { id: sectionId },
    });
    if (!sectionExists) throw new Error("Section not found");

    await prisma.articleSection.delete({
      where: { id: sectionId },
    });

    revalidatePath(
      `/admin/articles/editor/${sectionExists.articleId}/add-sections`
    );

    return { success: true, message: "Section deleted successfully" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
