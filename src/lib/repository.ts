import { Admin } from "@/entities/admin";
import { User } from "@/entities/user";
import { LuckyDraw } from "@/entities/luckydraw";
import {DrawParticipant} from "@/entities/drawParticipant"
import dbConnect from "@/lib/database";

declare global {
  var __dbConnection: typeof dbConnect | undefined;
}

const connection = globalThis.__dbConnection ?? dbConnect;

if (!connection.isInitialized) {
  await connection.initialize();
}

globalThis.__dbConnection = connection;

export const AdminRepo = connection.getRepository(Admin);
export const UserRepo = connection.getRepository(User);
export const LuckyDrawRepo = connection.getRepository(LuckyDraw);
export const DrawParticipantRepo = connection.getRepository(DrawParticipant)