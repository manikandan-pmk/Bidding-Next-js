import { User } from "@/entities/user";
import dbConnect from "@/lib/database";

if (!dbConnect.isInitialized) {
    await dbConnect.initialize();
}

export const UserRepo = dbConnect.getRepository(User);