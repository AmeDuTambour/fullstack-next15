import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function apiAuthMiddleware(req: Request) {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    console.error("JWT_SECRET could not be found");
    return new NextResponse(JSON.stringify({ message: "Server Error" }), {
      status: 500,
    });
  }

  const token = await getToken({
    req,
    secret: jwtSecret,
    raw: true,
  });

  if (token) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const decoded = jwt.verify(token, jwtSecret) as { [key: string]: any };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (req as any).auth = decoded;
      return NextResponse.next();
    } catch (error) {
      return new NextResponse(JSON.stringify({ message: error }), {
        status: 401,
      });
    }
  }

  return new NextResponse(JSON.stringify({ message: "Not authenticated" }), {
    status: 401,
  });
}
