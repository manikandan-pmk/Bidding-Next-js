import { NextRequest, NextResponse } from "next/server";
import { DurationUnit } from "@/entities/luckydraw";
import { UserRepo, LuckyDrawRepo } from "@/lib/repository";
import { saveUploadedImage } from "@/lib/upload";

export const POST = async (req: NextRequest) => {
  try {
    // Get logged-in user from middleware
    const userHeader = req.headers.get("user");

    if (!userHeader) {
      return NextResponse.json(
        {
          error: true,
          message: "Token Not found",
        },
        {
          status: 401,
        },
      );
    }

    // Convert user header into object
    const user = JSON.parse(userHeader);

    if (!user?.id) {
      return NextResponse.json(
        {
          error: true,
          message: "Invalid user information",
        },
        {
          status: 401,
        },
      );
    }

    // Parse multipart form data (required for file uploads — req.json() won't work here)
    const formData = await req.formData();

    const name = formData.get("name") as string | null;
    const no_of_peoples = formData.get("no_of_peoples") as string | null;
    const amount = formData.get("amount") as string | null;
    const duration_Value = formData.get("duration_Value") as string | null;
    const duration_Unit = formData.get("duration_Unit") as string | null;
    const upi_Id = formData.get("upi_Id") as string | null;
    const qrCodeFile = formData.get("qr_Code") as File | null;

    // Validate required fields
    if (
      !name ||
      no_of_peoples === null ||
      amount === null ||
      duration_Value === null ||
      !duration_Unit ||
      !upi_Id ||
      !qrCodeFile
    ) {
      return NextResponse.json(
        {
          error: true,
          message: "All fields are required",
        },
        {
          status: 400,
        },
      );
    }

    // Validate duration unit
    if (
      duration_Unit !== DurationUnit.WEEKLY &&
      duration_Unit !== DurationUnit.MONTHLY
    ) {
      return NextResponse.json(
        {
          error: true,
          message: "Duration unit must be WEEKLY or MONTHLY",
        },
        {
          status: 400,
        },
      );
    }

    // Validate numbers
    if (
      Number(no_of_peoples) <= 0 ||
      Number(amount) <= 0 ||
      Number(duration_Value) <= 0
    ) {
      return NextResponse.json(
        {
          error: true,
          message:
            "Number of people, amount and duration must be greater than 0",
        },
        {
          status: 400,
        },
      );
    }

    // Find logged-in user
    const loggedInUser = await UserRepo.findOne({
      where: {
        id: user.id,
      },
    });

    if (!loggedInUser) {
      return NextResponse.json(
        {
          error: true,
          message: "User not found",
        },
        {
          status: 404,
        },
      );
    }

    // Save the QR code image to disk, get back a public URL path
    let qrCodeUrl: string;
    try {
      qrCodeUrl = await saveUploadedImage(qrCodeFile, "qr-codes");
    } catch (uploadErr: any) {
      return NextResponse.json(
        {
          error: true,
          message: uploadErr.message,
        },
        {
          status: 400,
        },
      );
    }

    // Create lucky draw
    const luckyDraw = LuckyDrawRepo.create({
      name,
      no_of_peoples: Number(no_of_peoples),
      amount: Number(amount),
      duration_Value: Number(duration_Value),
      duration_Unit,
      upi_Id,
      qr_Code: qrCodeUrl,
      user: loggedInUser,
    });

    // Save
    const savedDraw = await LuckyDrawRepo.save(luckyDraw);

    return NextResponse.json(
      {
        error: false,
        message: "Lucky draw created successfully",
        data: savedDraw,
      },
      {
        status: 201,
      },
    );
  } catch (err: any) {
    console.log("Create Lucky Draw Error:", err.message);

    return NextResponse.json(
      {
        error: true,
        message: "Unable to create Draw, server error",
      },
      {
        status: 500,
      },
    );
  }
};


export const GET = async (req: NextRequest) => {
  try {
    // Get logged-in user from middleware
    const userHeader = req.headers.get("user");
    

    if (!userHeader) {
      return NextResponse.json(
        {
          error: true,
          message: "Token Not found",
        },
        { status: 401 }
      );
    }

    // Convert user header into object
    const user = JSON.parse(userHeader);

    if (!user?.id) {
      return NextResponse.json(
        {
          error: true,
          message: "Invalid user information",
        },
        { status: 401 }
      );
    }

    // Check logged-in user exists
    const loggedInUser = await UserRepo.findOne({
      where: {
        id: user.id,
      },
    });

    if (!loggedInUser) {
      return NextResponse.json(
        {
          error: true,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    // Get all lucky draws created by this user
    const luckyDraws = await LuckyDrawRepo.find({
      where: {
        user: {
          id: user.id,
        },
      },
      order: {
        id: "DESC",
      },
    });

    return NextResponse.json(
      {
        error: false,
        message: "Lucky draws fetched successfully",
        data: luckyDraws,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.log("Get Lucky Draw Error:", err.message);

    return NextResponse.json(
      {
        error: true,
        message: "Unable to fetch lucky draws, server error",
      },
      { status: 500 }
    );
  }
};