import { NextRequest, NextResponse } from "next/server";

import dbConnect from "@/lib/database";
import { Admin } from "@/entities/admin";


export async function GET(req: NextRequest) {
  try {
    const adminHeader = req.headers.get("admin");
    console.log(adminHeader)

    if (!adminHeader) {
      return NextResponse.json(
        {
          error: true,
          message: "Unauthorized Access",
        },
        {
          status: 401,
        },
      );
    }

    const admin = JSON.parse(adminHeader);

    const id = admin.id;

    if (!dbConnect.isInitialized) {
      await dbConnect.initialize();
    }

    const db = dbConnect;
    const AdminRepo = db.getRepository(Admin);

    const AdminData = await AdminRepo.findOne({
      where: {
        id: id,
      },
      select: {
        name: true,
        email: true,
        role: true,
      },
    });

    return NextResponse.json(
      {
        error: false,
        message: "Admin Data Fetched Successfully",
        data: AdminData,
      },
      {
        status: 200,
      },
    );
  } catch (err: any) {
    return NextResponse.json({
      error: true,
      message: "Server Error , unable to fectch data",
    });
  }
}
