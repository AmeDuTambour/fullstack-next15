import { apiAuthMiddleware } from "@/app/middlewares/apiAuthMiddleware";
import { getAllProducts } from "@/lib/actions/product.actions";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const res = await apiAuthMiddleware(request);
  if (res.status === 401 || res.status === 500) {
    return res;
  }

  try {
    const { searchParams } = new URL(request.url);

    const blocked = searchParams.get("blocked") === "true";
    const query = searchParams.get("query") || "";
    const category = searchParams.get("category") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    const products = await getAllProducts({
      query,
      blockedOnly: blocked,
      category,
      page,
      limit,
    });

    if (!products) {
      return NextResponse.json(
        { error: "Products not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
