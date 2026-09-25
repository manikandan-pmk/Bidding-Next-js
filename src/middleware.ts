import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const origin = process.env.ALLOWED_ORIGIN!;

function setCorsHeaders(response: NextResponse) {
  response.headers.set("Access-Control-Allow-Origin", origin);
  response.headers.set("Access-Control-Allow-Credentials", "true");

  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );

  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  return response;
}

export async function middleware(req: NextRequest) {
  if (req.method === "OPTIONS") {
    return setCorsHeaders(
      new NextResponse(null, { status: 204 })
    );
  }

  try {
    const { pathname } = req.nextUrl;

    // Only handle API routes
    if (!pathname.startsWith("/api/v1")) {
      return setCorsHeaders(NextResponse.next());
    }

   // LOGIN DOES NOT NEED TOKEN
    if (pathname === "/api/v1/user/auth/login") {
      return setCorsHeaders(NextResponse.next());
    }
    
    const isAdminRoute = pathname.startsWith("/api/v1/admin");

    const cookieName = isAdminRoute
      ? "token"
      : "user_token";

    const token = req.cookies.get(cookieName)?.value;

    if (!token) {
      return setCorsHeaders(
        NextResponse.json(
          {
            error: true,
            message: "Token not found",
          },
          { status: 401 }
        )
      );
    }

    // JWT secret
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      return setCorsHeaders(
        NextResponse.json(
          {
            error: true,
            message: "JWT_SECRET not configured",
          },
          { status: 500 }
        )
      );
    }

    // Verify JWT
    const secretKey = new TextEncoder().encode(secret);

    const { payload } = await jwtVerify(
      token,
      secretKey
    );

    // Create request headers
    const requestHeaders = new Headers(req.headers);

    // Admin user information
    if (isAdminRoute) {
      requestHeaders.set(
        "admin",
        JSON.stringify({
          id: payload.id,
          email: payload.email,
          name: payload.name,
          role: payload.role,
        })
      );
    }

    // User information
    if (!isAdminRoute) {
      requestHeaders.set(
        "user",
        JSON.stringify({
          id: payload.id,
          email: payload.email,
          name: payload.name,
          role: payload.role,
        })
      );
    }

    // Continue request
    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

    return setCorsHeaders(response);

  } catch (err: any) {
    console.log("Middleware error:", err.message);

    return setCorsHeaders(
      NextResponse.json(
        {
          error: true,
          message: "Invalid or expired token",
        },
        { status: 401 }
      )
    );
  }
}


export default middleware;