import { UserRepo } from "@/lib/repository";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const adminHeader = req.headers.get("admin");

    if (!adminHeader) {
      return NextResponse.json({
        error: true,
        message: "Token not Found , Unauthorized",
      });
    }

    const admin = JSON.parse(adminHeader)

      if (admin.role !== "admin") {
      return NextResponse.json(
        {
          error: true,
          message: "Admin access required",
        },
        { status: 403 }
      );
    }

    const users = await UserRepo.find();

    if (!users) {
      return NextResponse.json({
        error: true,
        message: "users not found",
      });
    }

    return NextResponse.json({
      error: false,
      message: "Users Fetched Successfully",
      data: users,
    });
  } catch (err: any) {
    console.log(err.message);

    return NextResponse.json(
      {
        error: true,
        message: "Unable to fetch Users, Server Error",
      },
      {
        status: 500,
      },
    );
  }
};
