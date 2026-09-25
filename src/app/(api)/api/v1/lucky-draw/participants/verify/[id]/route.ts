import { DrawParticipantRepo } from "@/lib/repository";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (
  req: NextRequest,
  { params }: { params: { id: string } },
) => {
  try {
    // =========================
    // USER
    // =========================

    const userHeader = req.headers.get("user");

    if (!userHeader) {
      return NextResponse.json(
        {
          error: true,
          message: "User not found",
        },
        {
          status: 401,
        },
      );
    }

    const userDetails = JSON.parse(userHeader);

    // =========================
    // GET ID FROM URL
    // =========================

    const {id} =await params;

    if (!id) {
      return NextResponse.json(
        {
          error: true,
          message: "Participant ID not found",
        },
        {
          status: 400,
        },
      );
    }

    // =========================
    // GET BODY
    // =========================

    const body = await req.json();

    const { is_Verified } = body;

    if (typeof is_Verified !== "boolean") {
      return NextResponse.json(
        {
          error: true,
          message: "is_Verified must be a boolean",
        },
        {
          status: 400,
        },
      );
    }

    // =========================
    // FIND PARTICIPANT
    // =========================

    const participant = await DrawParticipantRepo.findOne({
      where: {
        id: String(id),
      },
    });
   

    if (!participant) {
      return NextResponse.json(
        {
          error: true,
          message: "Participant not found",
        },
        {
          status: 404,
        },
      );
    }

    // =========================
    // UPDATE VERIFICATION
    // =========================

    participant.is_Verified = is_Verified;

    await DrawParticipantRepo.save(participant);

    // =========================
    // RESPONSE
    // =========================

    return NextResponse.json(
      {
        error: false,
        message: is_Verified
          ? "Participant verified successfully"
          : "Participant unverified successfully",
        data: participant,
      },
      {
        status: 200,
      },
    );
  } catch (err: any) {
    console.error("VERIFY PARTICIPANT ERROR:", err);

    return NextResponse.json(
      {
        error: true,
        message: "Server Error, Can't verify the Participant",
      },
      {
        status: 500,
      },
    );
  }
};