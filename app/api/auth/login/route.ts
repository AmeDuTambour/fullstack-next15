import jwt from "jsonwebtoken";
import { verifyUser } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const user = await verifyUser(email, password);

    if (!user) {
      return new Response(JSON.stringify({ message: "Invalid credentials" }), {
        status: 401,
      });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error("JWT_SECRET could not be found");
      return new Response(JSON.stringify({ message: "Server Error" }), {
        status: 500,
      });
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, jwtSecret, {
      expiresIn: "30d",
    });

    return new Response(JSON.stringify({ token }), { status: 200 });
  } catch (error) {
    console.error("Server Error:", error);
    return new Response(JSON.stringify({ message: "Server Error" }), {
      status: 500,
    });
  }
}
