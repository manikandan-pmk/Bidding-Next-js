import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const PUBLIC_PATHS = [
  "/api/v1/admin/auth/login",
  "/api/v1/admin/auth/register",
  "/api/v1/user/auth/register",
  "/api/v1/user/auth/login",
];

const PUBLIC_PREFIX_PATHS = ["/api/v1/lucky-draw/participants/"];

const origin = process.env.ALLOWED_ORIGIN!;

function setCorsHeaders(response: NextResponse) {
  response.headers.set("Access-Control-Allow-Origin", origin);
  response.headers.set("Access-Control-Allow-Credentials", "true");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization",
  );
  return response;
}

export async function middleware(req: NextRequest) {
  if (req.method === "OPTIONS") {
    return setCorsHeaders(new NextResponse(null, { status: 204 }));
  }

  try {
    const { pathname } = req.nextUrl;

    // Exact public paths
    const isPublicPath = PUBLIC_PATHS.includes(pathname);

    // Dynamic public paths
    const isPublicPrefixPath = PUBLIC_PREFIX_PATHS.some((path) =>
      pathname.startsWith(path),
    );

    if (isPublicPath || isPublicPrefixPath) {
      return setCorsHeaders(NextResponse.next());
    }

    const isAdminRoute = pathname.startsWith("/api/v1/admin");
    const isUserRoute =
      pathname.startsWith("/api/v1/user") ||
      pathname.startsWith("/api/v1/lucky-draw");

    if (!isAdminRoute && !isUserRoute) {
      return setCorsHeaders(NextResponse.next());
    }

    const cookieName = isAdminRoute ? "token" : "user_token";
    const token = req.cookies.get(cookieName)?.value;

    if (!token) {
      return setCorsHeaders(
        NextResponse.json(
          { error: true, message: "Token not found" },
          { status: 401 },
        ),
      );
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      return setCorsHeaders(
        NextResponse.json(
          { error: true, message: "JWT_SECRET not configured" },
          { status: 500 },
        ),
      );
    }

    const secretKey = new TextEncoder().encode(secret);
    const { payload } = await jwtVerify(token, secretKey);

    const requestHeaders = new Headers(req.headers);

    if (isAdminRoute) {
      requestHeaders.set(
        "admin",
        JSON.stringify({
          id: payload.id,
          email: payload.email,
          name: payload.name,
          role: payload.role,
        }),
      );
    }

    if (isUserRoute) {
      requestHeaders.set(
        "user",
        JSON.stringify({
          id: payload.id,
          email: payload.email,
          name: payload.name,
          role: payload.role,
        }),
      );
    }

    const response = NextResponse.next({
      request: { headers: requestHeaders },
    });

    return setCorsHeaders(response);
  } catch (err: any) {
    console.log("Middleware error:", err.message);

    return setCorsHeaders(
      NextResponse.json(
        { error: true, message: "Invalid or expired token" },
        { status: 401 },
      ),
    );
  }
}

export const config = {
  matcher: ["/api/v1/:path*"],
};

export default middleware;
