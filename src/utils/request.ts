import type { Request } from "express";

import type { AuthUser } from "../types/auth.types";

export function getAuthUser(req: Request): AuthUser {
  return (req as any).user as AuthUser;
}

