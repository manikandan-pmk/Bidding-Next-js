import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const response = NextResponse.json(
      {
        error: false,
        message: "Logout successful",
      },
      {
        status: 200,
      }
    );

    response.cookies.delete("token");

    return response;
  } catch (err: any) {
    console.error("Logout Error:", err.message);

    return NextResponse.json(
      {
        error: true,
        message: "Unable to logout",
      },
      {
        status: 500,
      }
    );
  }
}