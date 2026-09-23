import { NextRequest, NextResponse } from "next/server";
import { LuckyDrawRepo, UserRepo } from "@/lib/repository";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    // Get logged-in user from middleware
    const userHeader = req.headers.get("user");

    if (!userHeader) {
      return NextResponse.json(
        {
          error: true,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    // Parse user data added by middleware
    let userData;

    try {
      userData = JSON.parse(userHeader);
    } catch {
      return NextResponse.json(
        {
          error: true,
          message: "Invalid user data",
        },
        { status: 401 }
      );
    }

    if (!userData?.id) {
      return NextResponse.json(
        {
          error: true,
          message: "Invalid user",
        },
        { status: 401 }
      );
    }

    // Check user exists
    const user = await UserRepo.findOne({
      where: {
        id: userData.id,
      },
    });

    console.log(user)

    if (!user) {
      return NextResponse.json(
        {
          error: true,
          message: "User not found",
        },
        { status: 401 }
      );
    }

   const { id } = await params;

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        {
          error: true,
          message: "Lucky draw ID is required",
        },
        { status: 400 }
      );
    }
    // Fetch lucky draw
    const luckyDraw = await LuckyDrawRepo.findOne({
      where: {
        id: id,
      },
    });

    if (!luckyDraw) {
      return NextResponse.json(
        {
          error: true,
          message: "Lucky draw not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        error: false,
        message: "Lucky draw fetched successfully",
        data: luckyDraw,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get Lucky Draw Error:", error);

    return NextResponse.json(
      {
        error: true,
        message: "Failed to fetch lucky draw",
      },
      { status: 500 }
    );
  }
};