import { apiAuthMiddleware } from "@/app/middlewares/apiAuthMiddleware";
import {
  getProductByCodeIdentifier,
  blockProductUnit,
  releaseProductUnit,
} from "@/lib/actions/product.actions";
import { NextResponse } from "next/server";

// In this scenario, identifier param should be the qrCode value
export async function GET(
  request: Request,
  { params }: { params: Promise<{ identifier: string }> }
) {
  const res = await apiAuthMiddleware(request);
  if (res.status === 401 || res.status === 500) {
    return res;
  }

  const { identifier } = await params;
  const product = await getProductByCodeIdentifier(identifier);

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json(product, { status: 200 });
}

// In this scenario, identifier param should be the product id
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ identifier: string }> }
) {
  const res = await apiAuthMiddleware(request);
  if (res.status === 401 || res.status === 500) {
    return res;
  }

  const { identifier } = await params;
  const { action, quantity } = await request.json();

  try {
    if (action === "block") {
      const updatedProduct = await blockProductUnit(identifier, quantity);
      return NextResponse.json(updatedProduct, { status: 200 });
    } else if (action === "release") {
      const updatedProduct = await releaseProductUnit(identifier, quantity);
      return NextResponse.json(updatedProduct, { status: 200 });
    } else {
      return NextResponse.json(
        { error: "Invalid action. Must be 'block' or 'release'." },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
