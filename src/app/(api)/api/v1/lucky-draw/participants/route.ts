import { LuckyDrawRepo } from "@/lib/repository";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
    try {
        // Get user from middleware
        const userHeader = req.headers.get("user");

        if (!userHeader) {
            return NextResponse.json(
                {
                    error: true,
                    message: "Token Not Found",
                },
                { status: 401 }
            );
        }

        const userData = JSON.parse(userHeader);

        if (!userData.id) {
            return NextResponse.json(
                {
                    error: true,
                    message: "Invalid User",
                },
                { status: 401 }
            );
        }

        // Fetch Lucky Draws created by this user
        const luckyDraws = await LuckyDrawRepo.find({
            where: {
                user: {
                    id: userData.id,
                },
            },
            relations: {
                participants: true,
            },
        });

        return NextResponse.json(
            {
                error: false,
                message: "Lucky Draws fetched successfully",
                data: luckyDraws,
            },
            { status: 200 }
        );

    } catch (err: any) {
        console.log(err.message);

        return NextResponse.json(
            {
                error: true,
                message: "Unable to fetch lucky draws, server error",
            },
            { status: 500 }
        );
    }
};