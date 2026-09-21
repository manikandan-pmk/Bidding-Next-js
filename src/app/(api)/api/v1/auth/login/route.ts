import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/lib/database";
import { Admin } from "@/entities/admin";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        {
          error: true,
          message: "All Fields Required",
        },
        {
          status: 400,
        },
      );
    }

    if (!dbConnect.isInitialized) {
      await dbConnect.initialize();
    }

    const db = dbConnect;
    const AdminRepo = db.getRepository(Admin);

    const User = await AdminRepo.findOne({
      where: {
        email,
      },
    });

    if (!User) {
      return NextResponse.json(
        {
          error: true,
          message: "Email Not Found",
        },
        { status: 404 },
      );
    }

    const checkPassword = await bcrypt.compare(password, User.password);

    if (!checkPassword) {
      return NextResponse.json({
        error: true,
        message: "Password Not valid",
      });
    }

    const payload = {
      id: User.id,
      email: User.email,
      name: User.name,
      role: User.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });

    const Response = NextResponse.json({
      error: false,
      message: "Login SuccessFul",
      data: User,
    });

    Response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" || false,
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 1 day in seconds
      path: "/",
    });

    return Response;
  } catch (err: any) {}
}
