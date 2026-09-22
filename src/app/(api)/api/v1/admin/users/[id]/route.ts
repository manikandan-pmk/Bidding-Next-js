import { UserRepo } from "@/lib/repository";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const adminHeader = req.headers.get("admin");

    if (!adminHeader) {
      return NextResponse.json(
        {
          error: true,
          message: "Token not found, Unauthorized",
        },
        { status: 401 },
      );
    }

    const admin = JSON.parse(adminHeader);

    if (admin.role !== "admin") {
      return NextResponse.json(
        {
          error: true,
          message: "Admin access required",
        },
        { status: 403 },
      );
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          error: true,
          message: "User ID is required",
        },
        { status: 400 },
      );
    }

    const user = await UserRepo.findOneBy({
      id:id,
    });

    if (!user) {
      return NextResponse.json(
        {
          error: true,
          message: "User not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        error: false,
        message: "User fetched successfully",
        data: user,
      },
      { status: 200 },
    );
  } catch (err: any) {
    console.log("FETCH USER ERROR:", err);

    return NextResponse.json(
      {
        error: true,
        message: "Unable to fetch user",
      },
      { status: 500 },
    );
  }
};
