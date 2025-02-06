"use server";

import { CartItem } from "@/types";
import { convertToPlainObject, formatError, round2 } from "../utils";
import { auth } from "@/auth";
import { cookies } from "next/headers";
import { cartItemSchema, insertCartSchema } from "../validators";
import { prisma } from "@/db/prisma";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

const calcPrice = (items: CartItem[]) => {
  const itemsPrice = round2(
      items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0) // Prix TTC
    ),
    taxPrice = round2(itemsPrice / 6), // Montant de la TVA
    shippingPrice = round2(itemsPrice > 150 ? 0 : 10), // Frais de port
    totalPrice = round2(itemsPrice + shippingPrice); // Prix total avec port

  return {
    itemsPrice: itemsPrice.toFixed(2), // Prix TTC des articles
    shippingPrice: shippingPrice.toFixed(2), // Frais de port
    taxPrice: taxPrice.toFixed(2), // Montant TVA (dont TVA)
    totalPrice: totalPrice.toFixed(2), // Prix total final (TTC avec port)
  };
};

export async function addItemToCart(data: CartItem) {
  try {
    console.log("Step 1: Starting addItemToCart", data);

    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    console.log("Step 2: Retrieved sessionCartId", sessionCartId);

    if (!sessionCartId) throw new Error("Cart session not found");

    const session = await auth();
    console.log("Step 3: Retrieved session", session);

    const userId = session?.user?.id ? (session.user.id as string) : undefined;
    console.log("Step 4: Extracted userId", userId);

    const cart = await getUserCart();
    console.log("Step 5: Retrieved cart", cart);

    const item = cartItemSchema.parse(data);
    console.log("Step 6: Parsed item", item);

    const product = await prisma.product.findFirst({
      where: { id: item.productId },
    });
    console.log("Step 7: Retrieved product", product);

    if (!product) throw new Error("Product not found");

    if (!cart) {
      console.log("Step 8: No cart found, creating new cart");

      const newCart = insertCartSchema.parse({
        userId: userId,
        items: [item],
        sessionCartId: sessionCartId,
        ...calcPrice([item]),
      });
      console.log("Step 9: Parsed new cart data", newCart);

      await prisma.cart.create({
        data: newCart,
      });
      console.log("Step 10: New cart created successfully");

      revalidatePath(`/product/${product.slug}`);
      console.log("Step 11: Revalidated path for new cart");

      return {
        success: true,
        message: `${product.name} added to cart`,
      };
    } else {
      console.log("Step 12: Cart exists, checking for existing item");

      const existItem = (cart.items as CartItem[]).find(
        (el) => el.productId === item.productId
      );
      console.log("Step 13: Existing item", existItem);

      if (existItem) {
        if (product.stock < existItem.qty + item.qty) {
          throw new Error("Not enough stock");
        }

        (cart.items as CartItem[]).find(
          (el) => el.productId === item.productId
        )!.qty = existItem.qty + 1;
        console.log("Step 14: Increased quantity", cart.items);
      } else {
        if (product.stock < 1) {
          throw new Error("Not enough stock");
        }
        cart.items.push(item);
        console.log("Step 15: Added new item to cart", cart.items);
      }

      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          items: cart.items as Prisma.CartUpdateitemsInput[],
          ...calcPrice(cart.items as CartItem[]),
        },
      });
      console.log("Step 16: Cart updated successfully");

      revalidatePath(`/product/${product.slug}`);
      console.log("Step 17: Revalidated path after update");

      return {
        success: true,
        message: `${product.name} ${
          existItem ? "updated in" : "added to"
        } cart`,
      };
    }
  } catch (error) {
    console.log("Catch error:", error);

    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function getUserCart() {
  const sessionCartId = (await cookies()).get("sessionCartId")?.value;
  if (!sessionCartId) throw new Error("Cart session not found");

  const session = await auth();
  const userId = session?.user?.id ? (session.user.id as string) : undefined;

  const cart = await prisma.cart.findFirst({
    where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
  });

  if (!cart) return undefined;

  return convertToPlainObject({
    ...cart,
    items: cart.items as CartItem[],
    itemsPrice: cart.itemsPrice.toString(),
    totalPrice: cart.totalPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
    taxPrice: cart.taxPrice.toString(),
  });
}

export async function removeItemFromCart(productId: string) {
  try {
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Cart session not found");

    const product = await prisma.product.findFirst({
      where: { id: productId },
    });
    if (!product) throw new Error("Product not found");

    const cart = await getUserCart();
    if (!cart) throw new Error("Cart not found");

    const exist = (cart.items as CartItem[]).find(
      (el) => el.productId === productId
    );
    if (!exist) throw new Error("Item not found");

    if (exist.qty === 1) {
      cart.items = (cart.items as CartItem[]).filter(
        (el) => el.productId !== exist.productId
      );
    } else {
      (cart.items as CartItem[]).find((el) => el.productId === productId)!.qty =
        exist.qty - 1;
    }

    await prisma.cart.update({
      where: {
        id: cart.id,
      },
      data: {
        items: cart.items as Prisma.CartUpdateitemsInput[],
        ...calcPrice(cart.items as CartItem[]),
      },
    });

    revalidatePath(`/product/${product.slug}`);
    return {
      success: true,
      message: `${product.name} was removed from cart`,
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
