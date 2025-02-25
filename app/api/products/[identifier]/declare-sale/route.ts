import { declareSale } from "@/lib/actions/product.actions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ identifier: string }> }
) {
  const { identifier } = await params;
  try {
    const { quantity, useReservation } = await request.json();

    if (typeof quantity !== "number" || quantity <= 0) {
      return NextResponse.json(
        { error: "Quantity must be a positive number" },
        { status: 400 }
      );
    }

    if (typeof useReservation !== "boolean") {
      return NextResponse.json(
        { error: "useReservation must be a boolean" },
        { status: 400 }
      );
    }

    const updatedProduct = await declareSale(
      identifier,
      quantity,
      useReservation
    );

    return NextResponse.json(updatedProduct, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
