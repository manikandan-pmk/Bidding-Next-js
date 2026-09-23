import { NextRequest, NextResponse } from "next/server";
import { DrawParticipantRepo, LuckyDrawRepo } from "@/lib/repository";
import { saveUploadedImage } from "@/lib/upload";
import {Gender} from "@/entities/drawParticipant"

export const POST = async (
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) => {
    try {
        // Lucky Draw ID from URL
        const { id } = await params;

        if (!id) {
            return NextResponse.json(
                {
                    error: true,
                    message: "Lucky Draw ID is required",
                },
                { status: 400 }
            );
        }

        // Check Lucky Draw exists
        const luckyDraw = await LuckyDrawRepo.findOne({
            where: {
                id,
            },
        });

        if (!luckyDraw) {
            return NextResponse.json(
                {
                    error: true,
                    message: "Lucky Draw not found",
                },
                { status: 404 }
            );
        }

        // Read FormData
        const formData = await req.formData();

        const name = formData.get("name") as string;
        const age = formData.get("age") as string;
        const email = formData.get("email") as string;
        const gender = formData.get("gender") as string;
        const phone_Number = formData.get("phone_Number") as string;

        const photo = formData.get("photo");
        const id_Proof = formData.get("id_Proof");

        // Validate text fields
        if (
            !name ||
            !age ||
            !email ||
            !gender ||
            !phone_Number
        ) {
            return NextResponse.json(
                {
                    error: true,
                    message: "Name, age, email, gender and phone number are required",
                },
                { status: 400 }
            );
        }

        // Validate photo
        if (!(photo instanceof File)) {
            return NextResponse.json(
                {
                    error: true,
                    message: "Photo is required",
                },
                { status: 400 }
            );
        }

        // Validate ID proof
        if (!(id_Proof instanceof File)) {
            return NextResponse.json(
                {
                    error: true,
                    message: "ID proof is required",
                },
                { status: 400 }
            );
        
        }

         // Validate duration unit
    if (
      gender !== Gender.MALE &&
      gender !== Gender.FEMALE &&
      gender !== Gender.OTHERS
    ) {
      return NextResponse.json(
        {
          error: true,
          message: "Gender must be MALE or FEMALE or OTHERS",
        },
        {
          status: 400,
        },
      );
    }


        // Save photo
        const photoPath = await saveUploadedImage(
            photo,
            "participants"
        );

        // Save ID proof
        const idProofPath = await saveUploadedImage(
            id_Proof,
            "id-proofs"
        );

        // Create participant
        const participant = DrawParticipantRepo.create({
            name,
            age: Number(age),
            email,
            gender,
            phone_Number: Number(phone_Number),

            photo: photoPath,
            id_Proof: idProofPath,

            is_Verified: false,
            is_Winned_Participant: false,

            // Relation
            draw: luckyDraw,
        });

        // Save participant
        const savedParticipant =
            await DrawParticipantRepo.save(participant);

        return NextResponse.json(
            {
                error: false,
                message: "Participant created successfully",
                data: savedParticipant,
            },
            { status: 201 }
        );

    } catch (error) {
        console.error("Create Participant Error:", error);

        return NextResponse.json(
            {
                error: true,
                message:
                    error instanceof Error
                        ? error.message
                        : "Internal server error",
            },
            { status: 500 }
        );
    }
};