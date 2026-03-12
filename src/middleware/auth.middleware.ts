import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { env } from "../config/env";
import { JwtPayload } from "../types/auth.types";
import { toAuthUserFromPayload } from "../services/auth.service";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = (req as any).cookies?.token as string | undefined;

  if (!token) {
    return res.status(401).json({ message: "Authentication token missing" });
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret) as JwtPayload;
    const authUser = toAuthUserFromPayload(decoded);
    (req as any).user = authUser;
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}