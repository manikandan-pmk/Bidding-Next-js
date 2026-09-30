import { NextRequest, NextResponse } from "next/server";
import {
  LuckyDrawRepo,
  UserRepo,
} from "@/lib/repository";

import { DurationUnit } from "@/entities/luckydraw";
// Change this import path according to your project
import { saveUploadedImage } from "@/lib/upload";

export async function POST(req: NextRequest) {
  try {
    // ----------------------------------------
    // Get multipart form data
    // ----------------------------------------
    const formData = await req.formData();

    const name = formData.get("name")?.toString().trim();
    const no_of_peoples = Number(
      formData.get("no_of_peoples")
    );
    const amount = Number(
      formData.get("amount")
    );
    const duration_Value = Number(
      formData.get("duration_Value")
    );
    const duration_Unit = formData.get(
      "duration_Unit"
    )?.toString();

    const upi_Id = formData.get("upi_Id")?.toString().trim();

    // ----------------------------------------
    // Manually selected user
    // ----------------------------------------
    const user_id = formData.get("user_id")?.toString().trim();

    // ----------------------------------------
    // QR Code
    // ----------------------------------------
    const qrCode = formData.get("qr_Code");

    // ----------------------------------------
    // Validate required fields
    // ----------------------------------------
    if (
      !name ||
      !user_id ||
      !upi_Id ||
      !duration_Unit ||
      !no_of_peoples ||
      !amount ||
      !duration_Value
    ) {
      return NextResponse.json(
        {
          error: true,
          message: "All required fields are required",
        },
        { status: 400 }
      );
    }

    // ----------------------------------------
    // Validate duration unit
    // ----------------------------------------
    if (
      duration_Unit !== DurationUnit.WEEKLY &&
      duration_Unit !== DurationUnit.MONTHLY
    ) {
      return NextResponse.json(
        {
          error: true,
          message:
            "Duration unit must be WEEKLY or MONTHLY",
        },
        { status: 400 }
      );
    }

    // ----------------------------------------
    // Validate numbers
    // ----------------------------------------
    if (no_of_peoples <= 0) {
      return NextResponse.json(
        {
          error: true,
          message:
            "Number of people must be greater than 0",
        },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        {
          error: true,
          message: "Amount must be greater than 0",
        },
        { status: 400 }
      );
    }

    if (duration_Value <= 0) {
      return NextResponse.json(
        {
          error: true,
          message:
            "Duration value must be greater than 0",
        },
        { status: 400 }
      );
    }

    // ----------------------------------------
    // Find manually selected user
    // ----------------------------------------
    const user = await UserRepo.findOne({
      where: {
        id: user_id,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: true,
          message: "Selected user not found",
        },
        { status: 404 }
      );
    }

    // ----------------------------------------
    // QR Code validation
    // ----------------------------------------
    if (!(qrCode instanceof File)) {
      return NextResponse.json(
        {
          error: true,
          message: "QR Code image is required",
        },
        { status: 400 }
      );
    }

    // ----------------------------------------
    // Validate image type
    // ----------------------------------------
    if (!qrCode.type.startsWith("image/")) {
      return NextResponse.json(
        {
          error: true,
          message: "QR Code must be an image",
        },
        { status: 400 }
      );
    }

    // ----------------------------------------
    // Validate image size
    // ----------------------------------------
    if (qrCode.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        {
          error: true,
          message:
            "QR Code image must be less than 5MB",
        },
        { status: 400 }
      );
    }

    // ----------------------------------------
    // Upload QR Code
    // ----------------------------------------
    const qrFileName = await saveUploadedImage(
      qrCode,
      "lucky-draw"
    );

    // ----------------------------------------
    // Create Lucky Draw
    // ----------------------------------------
    const luckyDraw = LuckyDrawRepo.create({
      name,

      no_of_peoples,

      amount,

      duration_Value,

      duration_Unit:
        duration_Unit as DurationUnit,

      upi_Id,

      qr_Code: qrFileName,

      // --------------------------------------
      // MANUAL USER RELATION
      // --------------------------------------
      user: user,
    });

    // ----------------------------------------
    // Save
    // ----------------------------------------
    const savedLuckyDraw =
      await LuckyDrawRepo.save(luckyDraw);

    // ----------------------------------------
    // Response
    // ----------------------------------------
    return NextResponse.json(
      {
        error: false,
        message:
          "Lucky draw created successfully",
        data: savedLuckyDraw,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error(
      "Create Lucky Draw Error:",
      error
    );

    return NextResponse.json(
      {
        error: true,
        message:
          error?.message ||
          "Failed to create lucky draw",
      },
      { status: 500 }
    );
  }
}