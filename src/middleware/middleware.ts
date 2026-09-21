import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          error: true,
          message: "Token not found",
        },
        {
          status: 401,
        }
      );
    }

    const secret = process.env.JWT_SECRET;


    const decoded = jwt.verify(token, secret!);

    console.log("Authenticated user:", decoded);

    return NextResponse.next();

  } catch (err: any) {
    console.log("Middleware error:", err.message);

    return NextResponse.json(
      {
        error: true,
        message: "Invalid or expired token",
      },
      {
        status: 401,
      }
    );
  }
}