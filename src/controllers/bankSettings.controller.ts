import { Request, Response } from "express";
import { eq } from "drizzle-orm";

import { db } from "../db/client";
import { bankSettings } from "../db/schema";
import { AuthUser } from "../types/auth.types";
import { UpdateVoiceLanguageBody } from "../types/bankSettings.types";

function getAuthUser(req: Request): AuthUser {
  return (req as any).user as AuthUser;
}

export async function getVoiceLanguage(req: Request, res: Response) {
  const user = getAuthUser(req);

  if (user.role === "super_admin") {
    return res.json({ voiceCallLanguage: null });
  }

  const rows = await db
    .select()
    .from(bankSettings)
    .where(eq(bankSettings.bankId, user.bankId!))
    .limit(1);

  if (rows.length === 0) {
    return res.status(404).json({ message: "Bank settings not found" });
  }

  return res.json({ voiceCallLanguage: rows[0].voiceCallLanguage });
}

export async function updateVoiceLanguage(req: Request, res: Response) {
  const user = getAuthUser(req);

  if (user.role === "super_admin") {
    return res
      .status(403)
      .json({ message: "Super admin cannot set voice language" });
  }

  const body = req.body as UpdateVoiceLanguageBody;
  const language = body?.language?.trim();

  if (!language) {
    return res.status(400).json({ message: "language is required" });
  }

  const result = await db
    .update(bankSettings)
    .set({
      voiceCallLanguage: language,
      updatedAt: new Date(),
    })
    .where(eq(bankSettings.bankId, user.bankId!))
    .returning({ voiceCallLanguage: bankSettings.voiceCallLanguage });

  if (result.length === 0) {
    return res.status(404).json({ message: "Bank settings not found" });
  }

  return res.json({ voiceCallLanguage: result[0].voiceCallLanguage });
}