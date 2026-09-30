import { DrawParticipantRepo } from "@/lib/repository";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    // -----------------------------
    // Check admin
    // -----------------------------
    const adminHeader = req.headers.get("admin");

    if (!adminHeader) {
      return NextResponse.json(
        {
          error: true,
          message: "Token not found",
        },
        { status: 401 }
      );
    }

    const adminDetails = JSON.parse(adminHeader);

    if (adminDetails.role !== "admin") {
      return NextResponse.json(
        {
          error: true,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    // -----------------------------
    // Get ID from URL
    // -----------------------------
    const { id } = await params;

    console.log("Participant ID from URL:", id);

    // -----------------------------
    // Find participant
    // -----------------------------
    const participant = await DrawParticipantRepo.findOne({
      where: {
        id: id,
      },
      relations: {
        draw: true,
      },
    });

    console.log("Participant from database:", participant);

    // -----------------------------
    // Participant not found
    // -----------------------------
    if (!participant) {
      return NextResponse.json(
        {
          error: true,
          message: "Participant not found",
          requestedId: id,
        },
        { status: 404 }
      );
    }

    // -----------------------------
    // Success
    // -----------------------------
    return NextResponse.json(
      {
        error: false,
        message: "Participant fetched successfully",
        data: participant,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Fetch participant error:", err);

    return NextResponse.json(
      {
        error: true,
        message: err.message || "Unable to fetch participant",
      },
      { status: 500 }
    );
  }
};