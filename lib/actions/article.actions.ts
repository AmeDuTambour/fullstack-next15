"use server";

import { prisma } from "@/db/prisma";
import { formatError } from "../utils";
import { insertArticleSchema, insertArticleSectionSchema } from "../validators";
import { revalidatePath } from "next/cache";
import { z } from "zod";

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

export async function createArticleSection(
  data: z.infer<typeof insertArticleSectionSchema>
) {
  try {
    const newSection = insertArticleSectionSchema.parse(data);
    await prisma.articleSection.create({
      data: newSection,
    });

    return { success: true, message: "Section added successfully" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
