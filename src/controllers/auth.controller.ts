import { Request, Response } from "express";

import { LoginRequestBody } from "../types/auth.types";
import {
  findUserByEmail,
  verifyPassword,
  buildJwtPayload,
  signToken,
  toLoginResponseUser,
} from "../services/auth.service";

export async function login(req: Request, res: Response) {
  const { email, password } = req.body as LoginRequestBody;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = await findUserByEmail(email);
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isValid = await verifyPassword(password, user.passwordHash);
  if (!isValid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const payload = buildJwtPayload({
    uuid: user.uuid,
    name: user.name,
    email: user.email,
    bankId: user.bankId ?? null,
    role: user.role,
  });

  const token = signToken(payload);
  const responseUser = toLoginResponseUser(user);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  return res.json({
    user: responseUser,
  });
}

export async function me(req: Request, res: Response) {
  const anyReq = req as any;
  if (!anyReq.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  return res.json({ user: anyReq.user });
}