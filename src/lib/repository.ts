import { Admin } from "@/entities/admin";
import { User } from "@/entities/user";
import dbConnect from "@/lib/database";

if (!dbConnect.isInitialized) {
    await dbConnect.initialize();
}

export const AdminRepo = dbConnect.getRepository(Admin)

export const UserRepo = dbConnect.getRepository(User);