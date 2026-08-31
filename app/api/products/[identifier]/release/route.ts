import { apiAuthMiddleware } from "@/app/middlewares/apiAuthMiddleware";
import { releaseProductUnit } from "@/lib/actions/product.actions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ identifier: string }> }
) {
  // Cette route mutait le stock sans aucune authentification, alors que
  // GET /api/products et PATCH /api/products/[identifier] en exigent une.
  // Même schéma que les autres routes mobiles : jeton porteur, JWT_SECRET.
  const authResult = await apiAuthMiddleware(request);
  if (authResult.status === 401 || authResult.status === 500) {
    return authResult;
  }

  const { identifier } = await params;
  try {
    const { quantity } = await request.json();

    if (typeof quantity !== "number" || quantity <= 0) {
      return NextResponse.json(
        { error: "Quantity must be a positive number" },
        { status: 400 }
      );
    }

    const updatedProduct = await releaseProductUnit(identifier, quantity);

    return NextResponse.json(updatedProduct, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
