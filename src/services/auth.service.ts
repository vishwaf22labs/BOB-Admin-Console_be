import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import { eq } from "drizzle-orm";

import { db } from "../db/client";
import { users } from "../db/schema";
import { env } from "../config/env";
import { AuthUser, JwtPayload, LoginResponseUser } from "../types/auth.types";

export async function findUserByEmail(email: string) {
  const [user] = await db.select().from(users).where(eq(users.email, email));
  return user || null;
}

export async function verifyPassword(
  plainPassword: string,
  passwordHash: string,
): Promise<boolean> {
  return bcrypt.compare(plainPassword, passwordHash);
}

export function buildJwtPayload(user: {
  id: string;
  email: string;
  bankId: string | null;
  role: string;
}): JwtPayload {
  return {
    id: user.id,
    email: user.email,
    bankId: user.bankId,
    role: user.role as JwtPayload["role"],
  };
}

export function signToken(payload: JwtPayload): string {
  const options: SignOptions = {
    expiresIn: env.jwtExpiresIn as any,
  };

  return jwt.sign(payload, env.jwtSecret, options);
}

export function toLoginResponseUser(user: any): LoginResponseUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    bankId: user.bankId ?? null,
    role: user.role,
  };
}

export function toAuthUserFromPayload(payload: JwtPayload): AuthUser {
  return {
    id: payload.id,
    email: payload.email,
    bankId: payload.bankId,
    role: payload.role,
  };
}