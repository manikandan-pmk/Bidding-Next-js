import { NextRequest, NextResponse } from "next/server";
import { DrawParticipantRepo } from "@/lib/repository";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { phone_Number } = body;

    // -----------------------------
    // Validate phone number
    // -----------------------------
    if (!phone_Number) {
      return NextResponse.json(
        {
          error: true,
          message: "Phone number is required",
        },
        { status: 400 }
      );
    }

    // -----------------------------
    // Find registered participant
    // -----------------------------
    const participant = await DrawParticipantRepo.findOne({
      where: {
        phone_Number: phone_Number,
      },
      relations: {
        draw: true,
        payments: true,
      },
    });

    if (!participant) {
      return NextResponse.json(
        {
          error: true,
          message: "No participant registered with this phone number",
        },
        { status: 404 }
      );
    }

    // -----------------------------
    // Dashboard response
    // -----------------------------
    return NextResponse.json(
      {
        error: false,
        message: "Participant found",

        participant: {
          id: participant.id,
          name: participant.name,
          age: participant.age,
          email: participant.email,
          phone_Number: participant.phone_Number,
          gender: participant.gender,
          photo: participant.photo,
          id_Proof: participant.id_Proof,
          is_Verified: participant.is_Verified,
          is_Winned_Participant: participant.is_Winned_Participant,
          is_Winned_Time: participant.is_Winned_Time,
        },

        draw: participant.draw,

        payments: participant.payments,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PARTICIPANT DASHBOARD ERROR:", error);

    return NextResponse.json(
      {
        error: true,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}