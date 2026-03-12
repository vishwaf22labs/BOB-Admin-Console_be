import dotenv from "dotenv";

dotenv.config();

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required env variable: ${key}`);
  }
  return value;
}

export const env = {
  port: Number(process.env.PORT),
  databaseUrl: requireEnv("DATABASE_URL"),
  jwtSecret: requireEnv("JWT_SECRET"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "1d",
  bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS ?? "10"),
  corsOrigin: process.env.CORS_ORIGIN,
  escalationDays: Number(process.env.ESCALATION_DAYS ?? "2"),
  resendApiKey: requireEnv("RESEND_API_KEY"),
  emailFrom: requireEnv("EMAIL_FROM"),
};