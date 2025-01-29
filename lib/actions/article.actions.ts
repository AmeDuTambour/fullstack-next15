import { prisma } from "@/db/prisma";
import { formatError } from "../utils";
import { insertArticleSchema } from "../validators";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function createArticle(data: z.infer<typeof insertArticleSchema>) {
  try {
    const newArticle = insertArticleSchema.parse(data);
    await prisma.article.create({ data: newArticle });

    revalidatePath("/admin/articles");
    return { success: true, message: "Article created successfully" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
