import "dotenv/config";
import bcrypt from "bcryptjs";

import { db } from "../src/db/client";
import { users } from "../src/db/schema/users";
import { bankSettings } from "../src/db/schema/bankSettings";
import { env } from "../src/config/env";

async function main() {
  const superAdminPasswordHash = await bcrypt.hash(
    "Super@123",
    env.bcryptSaltRounds,
  );
  await db.insert(users).values({
    name: "Super Admin",
    email: "superadmin@f22labs.com",
    passwordHash: superAdminPasswordHash,
    bankId: null,
    role: "super_admin",
  });

  const banks = ["bank_of_baroda", "bank_of_dev", "bank_of_pm"] as const;

  const adminPasswordHash = await bcrypt.hash(
    "Admin@123",
    env.bcryptSaltRounds,
  );

  for (const bankId of banks) {
    await db.insert(bankSettings).values({
      bankId,
      voiceCallLanguage: "english",
    });

    const members = ["m1", "m2", "m3"] as const;
    for (const member of members) {
      const email = `${member}@${bankId.replace(/_/g, "")}.com`;

      await db.insert(users).values({
        name: `${member.toUpperCase()} ${bankId}`,
        email,
        passwordHash: adminPasswordHash,
        bankId,
        role: member,
      });
    }
  }

  console.log("Seed completed successfully");
}

main()
  .catch((err) => {
    console.error("Seed failed", err);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });