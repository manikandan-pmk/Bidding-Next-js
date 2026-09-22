import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { UserRepo } from "@/lib/repository";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, message: "Name must be at least 2 characters" },
        { status: 400 },
      );
    }

    if (!email || typeof email !== "string" || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json(
        { success: false, message: "Invalid email" },
        { status: 400 },
      );
    }

    if (!password || typeof password !== "string" || password.length < 6) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 6 characters" },
        { status: 400 },
      );
    }

    const existingUser = await UserRepo.findOne({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Email already registered" },
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = UserRepo.create({ name, email, password: hashedPassword });
    const savedUser = await UserRepo.save(user);

    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully",
        user: {
          id: savedUser.id,
          name: savedUser.name,
          email: savedUser.email,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 },
    );
  }
}
