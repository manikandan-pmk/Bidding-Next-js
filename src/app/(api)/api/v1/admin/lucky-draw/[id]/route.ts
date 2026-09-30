import { LuckyDrawRepo } from "@/lib/repository";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
 { params }: { params: Promise<{ id: String }> },
) => {
  try {
    const adminHeader = req.headers.get("admin");

    if (!adminHeader) {
      return NextResponse.json(
        {
          error: true,
          message: "Header Not found",
        },
        {
          status: 401,
        },
      );
    }

    const adminDeatils = JSON.parse(adminHeader);

    if (adminDeatils.role !== "admin") {
      return NextResponse.json(
        {
          error: true,
          message: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          error: true,
          message: "id not found",
        },
        {
          status: 404,
        },
      );
    }

    const drawDetails = await LuckyDrawRepo.findOne({
      where: {
        id: String(id),
      },
    });

    if (!drawDetails) {
      return NextResponse.json(
        {
          error: true,
          message: "cannnot fetch draw details",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      error: false,
      message: "Draw Details Fetched Successfully",
      data: drawDetails,
    });
  } catch (err: any) {
    console.log(err.message);

    return NextResponse.json(
      {
        error: true,
        message: "Unable fetch draw , server error",
      },
      { status: 500 },
    );
  }
};
