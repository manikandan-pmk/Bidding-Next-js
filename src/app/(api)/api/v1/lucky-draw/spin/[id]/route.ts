import {
  DrawParticipantRepo,
  LuckyDrawRepo,
  DrawWinnerRepo,
} from "@/lib/repository";
import { NextRequest, NextResponse } from "next/server";
import { randomInt } from "crypto";

export const POST = async (
  req: NextRequest,
  { params }: { params: { id: String } },
) => {
  try {
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

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          error: true,
          message: "invaild draw id",
        },
        {
          status: 404,
        },
      );
    }

    const luckydraw = await LuckyDrawRepo.findOne({
      where: {
        id: String(id),
      },
      relations: {
        user: true,
      },
    });

    if (!luckydraw) {
      return NextResponse.json(
        {
          error: true,
          message: "Draw Not Found",
        },
        {
          status: 404,
        },
      );
    }

    if (luckydraw.user && String(luckydraw.user.id) !== String(user.id)) {
      return NextResponse.json(
        {
          error: true,
          message: "You are not authorized to spin this draw",
        },
        {
          status: 403,
        },
      );
    }

    // Manage Cycle Logics //

    const serverNow = new Date();

    console.log("Server Time : ", serverNow.toISOString());

    const drawStart = new Date(luckydraw.createdAt);

    if (isNaN(drawStart.getTime())) {
      return NextResponse.json(
        {
          error: true,
          message: "Invalid draw start date",
        },
        {
          status: 500,
        },
      );
    }

    let cycleLengthMs: number;

    const durationUnit = String(luckydraw.duration_Unit).toUpperCase();

    if (durationUnit === "WEEKLY" || "WEEK") {
      cycleLengthMs = 7 * 24 * 60 * 60 * 1000;
    } else if (durationUnit === "MONTHLY" || "MONTH") {
      cycleLengthMs = 30 * 24 * 60 * 60 * 1000;
    } else {
      return NextResponse.json(
        {
          error: true,
          message: "Invalid duration unit",
        },
        {
          status: 400,
        },
      );
    }

    const elapsedMs = serverNow.getTime() - drawStart.getTime();

    if (elapsedMs < 0) {
      return NextResponse.json(
        {
          error: true,
          message: "Draw has not started yet",
        },
        {
          status: 400,
        },
      );
    }

    const currentCycle = Math.floor(elapsedMs / cycleLengthMs) + 1;

    const cycleStart = new Date(
      drawStart.getTime() + (currentCycle - 1) * cycleLengthMs,
    );

    const cycleEnd = new Date(
      drawStart.getTime() + currentCycle * cycleLengthMs,
    );

    console.log("Draw Cycle Information:", {
      serverNow: serverNow.toISOString(),
      drawStart: drawStart.toISOString(),
      currentCycle,
      cycleStart: cycleStart.toISOString(),
      cycleEnd: cycleEnd.toISOString(),
      durationUnit,
    });

    const maxCycles = Number(luckydraw.duration_Value);

    if (maxCycles > 0 && currentCycle > maxCycles) {
      return NextResponse.json(
        {
          error: true,
          message: "This lucky draw has ended",
          currentCycle,
          maxCycles,
          serverNow: serverNow.toISOString(),
        },
        {
          status: 400,
        },
      );
    }

    // check winners

    const existingWinner = await DrawWinnerRepo.findOne({
      where: {
        draw: {
          id: String(id),
        },
        Cycle: String(currentCycle),
      },
      relations: {
        participant: true,
      },
    });

    if (existingWinner) {
      return NextResponse.json(
        {
          error: true,
          message: `Winner already selected for Cycle ${currentCycle}`,
          currentCycle,
          cycleStart: cycleStart.toISOString(),
          cycleEnd: cycleEnd.toISOString(),
          winner: existingWinner.participant,
        },
        {
          status: 409,
        },
      );
    }

    const participants = await DrawParticipantRepo.find({
      where: {
        draw: {
          id: String(id),
        },
        is_Verified: true,
        is_Winned_Participant: false,
      },
    });

    if (!participants || participants.length === 0) {
      return NextResponse.json(
        {
          error: true,
          message: "No verified participants available",
          currentCycle,
          cycleStart: cycleStart.toISOString(),
          cycleEnd: cycleEnd.toISOString(),
        },
        {
          status: 404,
        },
      );
    }

    console.log("Eligible participants:", participants.length);

    // =====================================================
    // 16. SECURE RANDOM SELECTION
    // =====================================================

    const randomIndex = randomInt(0, participants.length);

    const winner = participants[randomIndex];

    // =====================================================
    // 17. MARK PARTICIPANT AS WINNER
    // =====================================================

    winner.is_Winned_Participant = true;
    

    await DrawParticipantRepo.save(winner);

    // =====================================================
    // 18. CREATE WINNER RECORD
    // =====================================================

    const winnerRecord = DrawWinnerRepo.create({
      draw: luckydraw,

      participant: winner,

      won_At:Date.now(),

      Cycle: String(currentCycle),
    });

    const savedWinner = await DrawWinnerRepo.save(winnerRecord);

    // =====================================================
    // 19. RETURN WINNER
    // =====================================================

    return NextResponse.json(
      {
        error: false,

        message: `Cycle ${currentCycle} Winner Selected`,

        currentCycle,

        cycleStart: cycleStart.toISOString(),

        cycleEnd: cycleEnd.toISOString(),

        serverNow: serverNow.toISOString(),

        winner: {
          id: winner.id,

          LuckyDraw_ID: winner.draw,

          Name: winner.name,

          Age: winner.age,

          Gender: winner.gender,

          Phone_Number: winner.phone_Number,

          Email: winner.email,

          Photo: winner.photo,

          isVerified: winner.is_Verified,

          IsWinnedParticipant: winner.is_Winned_Participant,
        },

        winnerRecord: savedWinner,
      },
      {
        status: 200,
      },
    );
  } catch (err: any) {
    console.error(err.message);
    return NextResponse.json({
      error: true,
      message: "Server Error , Can't make Spin",
    });
  }
};


export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    // =========================================================
    // 1. GET USER FROM MIDDLEWARE HEADER
    // =========================================================

    const userHeader = req.headers.get("user");

    if (!userHeader) {
      return NextResponse.json(
        {
          error: true,
          message: "Token Not found",
        },
        {
          status: 401,
        }
      );
    }

    let user: any;

    try {
      user = JSON.parse(userHeader);
    } catch {
      return NextResponse.json(
        {
          error: true,
          message: "Invalid user information",
        },
        {
          status: 401,
        }
      );
    }

    if (!user?.id) {
      return NextResponse.json(
        {
          error: true,
          message: "Invalid user information",
        },
        {
          status: 401,
        }
      );
    }

    // =========================================================
    // 2. GET DRAW ID
    // =========================================================

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          error: true,
          message: "Invalid draw id",
        },
        {
          status: 400,
        }
      );
    }

    // =========================================================
    // 3. FIND DRAW
    // =========================================================

    const luckyDraw = await LuckyDrawRepo.findOne({
      where: {
        id: String(id),
      },
      relations: {
        user: true,
      },
    });

    if (!luckyDraw) {
      return NextResponse.json(
        {
          error: true,
          message: "Draw Not Found",
        },
        {
          status: 404,
        }
      );
    }

    // =========================================================
    // 4. CHECK DRAW OWNER
    // =========================================================

    if (
      luckyDraw.user &&
      String(luckyDraw.user.id) !== String(user.id)
    ) {
      return NextResponse.json(
        {
          error: true,
          message: "You are not authorized to view this draw",
        },
        {
          status: 403,
        }
      );
    }

    // =========================================================
    // 5. SERVER TIME
    // =========================================================

    const serverNow = new Date();

    const drawStart = new Date(
      luckyDraw.createdAt
    );

    if (isNaN(drawStart.getTime())) {
      return NextResponse.json(
        {
          error: true,
          message: "Invalid draw start date",
        },
        {
          status: 500,
        }
      );
    }

    // =========================================================
    // 6. CYCLE LENGTH
    // =========================================================

    const durationUnit = String(
      luckyDraw.duration_Unit
    ).toUpperCase();

    let cycleLengthMs: number;

    if (durationUnit === "WEEKLY") {
      cycleLengthMs =
        7 * 24 * 60 * 60 * 1000;
    } else if (durationUnit === "MONTHLY") {
      cycleLengthMs =
        30 * 24 * 60 * 60 * 1000;
    } else {
      return NextResponse.json(
        {
          error: true,
          message: "Invalid duration unit",
        },
        {
          status: 400,
        }
      );
    }

    // =========================================================
    // 7. CURRENT CYCLE
    // =========================================================

    const elapsedMs =
      serverNow.getTime() -
      drawStart.getTime();

    if (elapsedMs < 0) {
      return NextResponse.json(
        {
          error: true,
          message: "Draw has not started yet",
        },
        {
          status: 400,
        }
      );
    }

    const currentCycle =
      Math.floor(
        elapsedMs / cycleLengthMs
      ) + 1;

    // =========================================================
    // 8. CYCLE START / END
    // =========================================================

    const cycleStart = new Date(
      drawStart.getTime() +
        (currentCycle - 1) *
          cycleLengthMs
    );

    const cycleEnd = new Date(
      drawStart.getTime() +
        currentCycle *
          cycleLengthMs
    );

    // =========================================================
    // 9. CHECK DRAW END
    // =========================================================

    const maxCycles = Number(
      luckyDraw.duration_Value
    );

    if (
      maxCycles > 0 &&
      currentCycle > maxCycles
    ) {
      return NextResponse.json(
        {
          error: true,
          message: "This lucky draw has ended",

          currentCycle,
          maxCycles,

          serverNow:
            serverNow.toISOString(),

          cycleStart:
            cycleStart.toISOString(),

          cycleEnd:
            cycleEnd.toISOString(),
        },
        {
          status: 400,
        }
      );
    }

    // =========================================================
    // 10. FETCH VERIFIED PARTICIPANTS
    // =========================================================

    const participants =
      await DrawParticipantRepo.find({
        where: {
          draw: {
            id: String(id),
          },

          is_Verified: true,

          is_Winned_Participant: false,
        },

        order: {
          createdAt: "ASC",
        },
      });

    // =========================================================
    // 11. RESPONSE
    // =========================================================

    return NextResponse.json(
      {
        error: false,

        message:
          "Lucky Draw details fetched successfully",

        currentCycle,

        maxCycles,

        cycleStart:
          cycleStart.toISOString(),

        cycleEnd:
          cycleEnd.toISOString(),

        serverNow:
          serverNow.toISOString(),

        drawStart:
          drawStart.toISOString(),

        duration_Unit:
          luckyDraw.duration_Unit,

        duration_Value:
          luckyDraw.duration_Value,

        participants,

        participantCount:
          participants.length,
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    console.error(
      "Get Lucky Draw Error:",
      error
    );

    return NextResponse.json(
      {
        error: true,
        message:
          error?.message ||
          "Server Error",
      },
      {
        status: 500,
      }
    );
  }
};
