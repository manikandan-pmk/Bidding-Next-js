import { DrawParticipantRepo, LuckyDrawRepo } from "@/lib/repository";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    // Get user from middleware
    const userHeader = req.headers.get("user");

    if (!userHeader) {
      return NextResponse.json(
        {
          error: true,
          message: "Token Not Found",
        },
        { status: 401 },
      );
    }

    const userData = JSON.parse(userHeader);

    if (!userData.id) {
      return NextResponse.json(
        {
          error: true,
          message: "Invalid User",
        },
        { status: 401 },
      );
    }

    const { id } = await params;

    const luckydraw = await LuckyDrawRepo.findOne({
      where: {
        id: id,

        user: {
          id: userData.id,
        },
      },
    });

    if (!luckydraw) {
      return NextResponse.json(
        {
          error: true,
          message: "Draw Not Found",
        },
        {
          status: 500,
        },
      );
    }

    const participants = await DrawParticipantRepo.find({
      where: {
        draw: {
          id: luckydraw.id,
        },
      },
      relations: {
        draw: true,
      },
      order: {
        id: "DESC",
      },
    });

    return NextResponse.json(
      {
        error: false,
        message: "Lucky Draws fetched successfully",
        data: participants,
      },
      { status: 200 },
    );
  } catch (err: any) {
    console.log(err.message);

    return NextResponse.json(
      {
        error: true,
        message: "Unable to fetch lucky draws, server error",
      },
      { status: 500 },
    );
  }
};
