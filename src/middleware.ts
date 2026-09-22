import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req: NextRequest) {
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

    if (!secret) {
      return NextResponse.json(
        {
          error: true,
          message: "JWT_SECRET not configured",
        },
        {
          status: 500,
        }
      );
    }

    const secretKey = new TextEncoder().encode(secret);

    const { payload } = await jwtVerify(token, secretKey);

    console.log("Authenticated user:", payload);

    const requestHeaders = new Headers(req.headers);

    requestHeaders.set(
      "admin",
      JSON.stringify({
        id: payload.id,
        email: payload.email,
        name: payload.name,
        role: payload.role,
      })
    );

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

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

export const config = {
  matcher: ["/api/v1/admin/:path*"],
};

export default middleware;