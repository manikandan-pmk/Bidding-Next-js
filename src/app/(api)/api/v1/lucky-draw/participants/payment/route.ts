import { NextRequest, NextResponse } from "next/server";
import { DrawParticipantRepo, DrawPaymentsRepo } from "@/lib/repository";
import { saveUploadedImage } from "@/lib/upload";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const phone_Number = formData.get("phone_Number")?.toString();
    const amountValue = formData.get("amount")?.toString();
    const payment_Photo = formData.get("payment_Photo");

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
    // Validate amount
    // -----------------------------
    if (!amountValue) {
      return NextResponse.json(
        {
          error: true,
          message: "Amount is required",
        },
        { status: 400 }
      );
    }

    const amount = Number(amountValue);

    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json(
        {
          error: true,
          message: "Invalid payment amount",
        },
        { status: 400 }
      );
    }

    // -----------------------------
    // Validate payment image
    // -----------------------------
    if (!(payment_Photo instanceof File)) {
      return NextResponse.json(
        {
          error: true,
          message: "Payment proof image is required",
        },
        { status: 400 }
      );
    }

    // -----------------------------
    // Find participant
    // -----------------------------
    const participant = await DrawParticipantRepo.findOne({
      where: {
        phone_Number: String( phone_Number),
      },
      relations: {
        draw: true,
      },
    });

    if (!participant) {
      return NextResponse.json(
        {
          error: true,
          message: "Participant not found",
        },
        { status: 404 }
      );
    }

    // -----------------------------
    // Save payment proof
    // -----------------------------
    const paymentPhotoPath = await saveUploadedImage(
      payment_Photo,
      "draw-payments"
    );

    // -----------------------------
    // Create payment
    // -----------------------------
    const payment = DrawPaymentsRepo.create({
      amount: amount,
      payment_Photo: paymentPhotoPath,
      isVerified: false,
      verified_At: null,
      participants: participant,
    });

    // -----------------------------
    // Save payment
    // -----------------------------
    await DrawPaymentsRepo.save(payment);

    return NextResponse.json(
      {
        error: false,
        message: "Payment submitted successfully",

        payment: {
          payment_Cycle: payment.payment_Cycle,
          amount: payment.amount,
          payment_Photo: payment.payment_Photo,
          isVerified: payment.isVerified,
          verified_At: payment.verified_At,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("DRAW PAYMENT ERROR:", error);

    return NextResponse.json(
      {
        error: true,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}