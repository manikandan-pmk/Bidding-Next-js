import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import DBConnect from "@/lib/database";
import { Admin } from "@/entities/admin";

export const POST = async (req: NextRequest) => {
  try {
    const { name, email, password } = await req.json();

    // 1. Validate fields
    if (!name || !email || !password) {
      return NextResponse.json(
        {
          error: true,
          message: "All fields are required",
        },
        {
          status: 400,
        }
      );
    }

    // 2. Validate password
    if (password.length < 6) {
      return NextResponse.json(
        {
          error: true,
          message: "Password must be at least 6 characters",
        },
        {
          status: 400,
        }
      );
    }

    // 3. Connect database
    const dataSource = await DBConnect();

    const adminRepo = dataSource.getRepository(Admin);

    // 4. Check existing email
    const existingAdmin = await adminRepo.findOne({
      where: {
        email: email.toLowerCase(),
      },
    });

    if (existingAdmin) {
      return NextResponse.json(
        {
          error: true,
          message: "Email already registered",
        },
        {
          status: 409,
        }
      );
    }

    // 5. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 6. Create admin
    const admin = adminRepo.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    // 7. Save admin
    const savedAdmin = await adminRepo.save(admin);

    // 8. Remove password from response
    const { password: _, ...adminData } = savedAdmin;

    return NextResponse.json(
      {
        error: false,
        message: "Registration successful",
        data: adminData,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Register Error:", error);

    return NextResponse.json(
      {
        error: true,
        message: "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
};