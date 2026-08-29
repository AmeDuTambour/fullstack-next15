"use server";

import { isDynamicServerError } from "next/dist/client/components/hooks-server-context";

import { prisma } from "@/db/prisma";
import { convertToPlainObject, formatError } from "../utils";
import {
  insertArticleCommentSchema,
  insertArticleSchema,
  updateArticleSchema,
  updateArticleSectionSchema,
} from "../validators";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { articleSectionFormDefaultValues } from "../constants";
import { Article } from "@/types";
import {
  isAdmin,
  requireAdmin,
  requireOwnerOrAdmin,
  requireUser,
} from "../auth-guards";

function sortByCategory(articles: Array<Article>): {
  [key: string]: Article[];
} {
  return articles.reduce(
    (acc, article) => {
      const categoryName =
        article.category?.name?.toLowerCase() || "uncategorized";
      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }
      acc[categoryName].push(article);
      return acc;
    },
    {} as { [key: string]: Article[] }
  );
}

export async function getAllArticles({
  limit = 1000,
  page = 1,
  filter,
  categoryId,
  withSorting,
}: {
  limit?: number;
  page?: number;
  filter: "all" | "published" | "draft";
  categoryId?: string;
  withSorting?: boolean;
}) {
  try {
    // Lister les brouillons est une opération d'administration.
    if (filter !== "published") {
      await requireAdmin();
    }

    const stateFilter: Prisma.ArticleWhereInput =
      filter === "published"
        ? { isPublished: true }
        : filter === "draft"
          ? { isPublished: false }
          : {};

    const whereValues: Prisma.ArticleWhereInput = {
      ...stateFilter,
      ...(categoryId ? { categoryId } : {}),
    };

    const data = await prisma.article.findMany({
      where: whereValues,
      include: {
        sections: true,
        comments: true,
        category: true,
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    const dataCount = await prisma.article.count({
      where: whereValues,
    });

    return {
      success: true,
      data: withSorting ? sortByCategory(data) : data || [],
      totalPages: Math.ceil(dataCount / limit),
    };
  } catch (error) {
    // Next signale le passage en rendu dynamique par une exception : l'avaler
    // ferait rendre une page vide au lieu de la marquer dynamique.
    if (isDynamicServerError(error)) throw error;
    console.error("Error fetching articles:", error);
    return {
      success: false,
      data: [],
      totalPages: 0,
      message: "Failed to fetch articles.",
    };
  }
}

export async function getFeaturedArticles() {
  const data = await prisma.article.findMany({
    where: {
      isPublished: true,
      isFeatured: true,
    },
    orderBy: { createdAt: "desc" },
    take: 4,
  });
  return convertToPlainObject(data);
}

export async function getArticleById(id: string) {
  await requireAdmin();

  const data = await prisma.article.findFirst({
    where: { id },
    include: {
      sections: {
        orderBy: { position: "asc" },
      },
      comments: true,
      category: true,
    },
  });
  return convertToPlainObject(data);
}

export async function getArticleBySlug(slug: string) {
  const data = await prisma.article.findFirst({
    where: { slug },
    include: {
      sections: {
        orderBy: { position: "asc" },
      },
      comments: true,
      category: true,
    },
  });

  // Un brouillon reste visible en prévisualisation pour un administrateur, mais
  // pas pour un visiteur qui devinerait l'URL.
  if (data && !data.isPublished && !(await isAdmin())) return null;

  return convertToPlainObject(data);
}

export async function createArticle(data: z.infer<typeof insertArticleSchema>) {
  try {
    await requireAdmin();
    const newArticle = insertArticleSchema.parse(data);

    const res = await prisma.article.create({
      data: {
        ...newArticle,
        categoryId: newArticle.categoryId || null,
      },
    });

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
    await requireAdmin();
    const article = updateArticleSchema.parse(data);
    const articleExists = await prisma.article.findFirst({
      where: { id: article.id },
    });
    if (!articleExists) throw new Error("Article not found");

    const res = await prisma.article.update({
      where: { id: article.id },
      data: {
        ...article,
        categoryId: article.categoryId || null,
      },
    });

    revalidatePath("/admin/articles");

    return {
      success: true,
      message: "Article updated successfully",
      data: res,
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function deleteArticle(articleId: string) {
  try {
    await requireAdmin();
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

export async function getAllArticleSections(articleId: string) {
  try {
    const sections = await prisma.articleSection.findMany({
      where: { articleId },
      orderBy: {
        position: "asc",
      },
    });
    if (!sections) throw new Error("Articl sections not found");
    return { data: convertToPlainObject(sections) };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function createArticleSection(articleId: string) {
  try {
    await requireAdmin();
    const lastSection = await prisma.articleSection.findFirst({
      where: { articleId },
      orderBy: { position: "desc" },
    });

    const newPosition = lastSection ? lastSection.position + 1 : 1;

    const res = await prisma.articleSection.create({
      data: {
        ...articleSectionFormDefaultValues,
        articleId,
        position: newPosition,
      },
    });

    revalidatePath(`/admin/articles/editor/${res.articleId}/add-sections`);

    return {
      success: true,
      message: "Section added successfully",
      data: convertToPlainObject(res),
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function updateArticleSection(
  data: z.infer<typeof updateArticleSectionSchema>
) {
  try {
    await requireAdmin();
    const section = updateArticleSectionSchema.parse(data);
    const sectionExists = await prisma.articleSection.findFirst({
      where: { sectionId: section.sectionId },
    });

    if (!sectionExists) throw new Error("Section not found");

    const res = await prisma.articleSection.update({
      where: { sectionId: section.sectionId },
      data: {
        title: section.title,
        position: section.position,
        body: section.body,
        image: section.image || null,
        youTubeUrl: section.youTubeUrl || null,
      },
    });

    revalidatePath(`/admin/articles/editor/${res.articleId}/add-sections`);

    return {
      success: true,
      message: "Section updated successfully",
      data: convertToPlainObject(res),
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function deleteArticleSection(sectionId: string) {
  try {
    await requireAdmin();
    const sectionExists = await prisma.articleSection.findFirst({
      where: { sectionId },
    });
    if (!sectionExists) throw new Error("Section not found");

    await prisma.articleSection.delete({
      where: { sectionId },
    });

    revalidatePath(
      `/admin/articles/editor/${sectionExists.articleId}/add-sections`
    );

    return { success: true, message: "Section deleted successfully" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function createArticleCategory(name: string, articleId?: string) {
  try {
    await requireAdmin();
    const res = await prisma.articleCategory.create({
      data: { name },
    });

    // ✅ Revalidation conditionnelle
    revalidatePath(
      articleId
        ? `/admin/articles/editor/${articleId}/enter-title`
        : `/admin/articles/editor/new/enter-title`
    );

    return {
      success: true,
      message: `Category ${name} created successfully`,
      data: res,
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function deleteArticleCategory(id: string, articleId?: string) {
  try {
    await requireAdmin();
    await prisma.articleCategory.delete({ where: { id } });

    revalidatePath(
      articleId
        ? `/admin/articles/editor/${articleId}/enter-title`
        : `/admin/articles/editor/new/enter-title`
    );

    return { success: true, message: "Category deleted successfully" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function updateArticleCategory(
  id: string,
  name: string,
  articleId?: string
) {
  try {
    await requireAdmin();
    await prisma.articleCategory.update({
      where: { id },
      data: { name },
    });

    revalidatePath(
      articleId
        ? `/admin/articles/editor/${articleId}/enter-title`
        : `/admin/articles/editor/new/enter-title`
    );

    return { success: true, message: "Category updated successfully" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function getArticleCategories() {
  try {
    const data = await prisma.articleCategory.findMany();
    return { success: true, data };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

/* -------------------------------------------------------------------------- */
/*                          Commentaires d'articles                           */
/* -------------------------------------------------------------------------- */

/**
 * Les commentaires sont publics en lecture, réservés aux membres connectés en
 * écriture. Chacun peut supprimer les siens ; un administrateur peut supprimer
 * n'importe lequel, ce qui tient lieu de modération.
 */
export async function getArticleComments(articleId: string) {
  try {
    const data = await prisma.articleComment.findMany({
      where: { articleId },
      // Ordre de rédaction : une réponse affichée avant sa question rend le fil
      // incompréhensible.
      orderBy: { createdAt: "asc" },
      include: {
        user: { select: { id: true, name: true } },
      },
    });

    return { success: true, data: convertToPlainObject(data) };
  } catch (error) {
    return { success: false, message: formatError(error), data: [] };
  }
}

export async function createArticleComment(
  articleId: string,
  data: z.infer<typeof insertArticleCommentSchema>
) {
  try {
    const { userId } = await requireUser();
    const comment = insertArticleCommentSchema.parse(data);

    const article = await prisma.article.findFirst({
      where: { id: articleId },
      select: { slug: true, isPublished: true },
    });

    if (!article) throw new Error("Article introuvable");

    // Pas de commentaire sur un brouillon : il n'est pas censé être visible.
    if (!article.isPublished) {
      throw new Error("Cet article n'est pas publié");
    }

    const res = await prisma.articleComment.create({
      data: {
        articleId,
        userId,
        title: comment.title,
        body: comment.body,
      },
    });

    revalidatePath(`/blog/${article.slug}`);

    return {
      success: true,
      message: "Commentaire publié",
      data: convertToPlainObject(res),
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function deleteArticleComment(commentId: string) {
  try {
    const comment = await prisma.articleComment.findFirst({
      where: { id: commentId },
      include: { article: { select: { slug: true } } },
    });

    if (!comment) throw new Error("Commentaire introuvable");

    // L'auteur supprime le sien, l'administrateur modère.
    await requireOwnerOrAdmin(comment.userId);

    await prisma.articleComment.delete({ where: { id: commentId } });

    revalidatePath(`/blog/${comment.article.slug}`);

    return { success: true, message: "Commentaire supprimé" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
