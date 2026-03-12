import { and, eq } from "drizzle-orm";

import { db } from "../db/client";
import { complaints } from "../db/schema";
import { env } from "../config/env";
import { COMPLAINT_STATUSES, ESCALATION_LEVELS } from "../config/constants";

export async function runEscalation(): Promise<void> {
  const days = env.escalationDays ?? 2;
  const thresholdMs = days * 24 * 60 * 60 * 1000;
  const now = new Date();

  let escalatedToM2 = 0;
  let escalatedToM3 = 0;

  const m1Rows = await db
    .select()
    .from(complaints)
    .where(
      and(
        eq(complaints.status, COMPLAINT_STATUSES[0]),
        eq(complaints.assignedTo, ESCALATION_LEVELS[0]),
      ),
    );

  for (const c of m1Rows) {
    const created =
      c.createdAt instanceof Date ? c.createdAt : new Date(c.createdAt as any);
    if (Number.isNaN(created.getTime())) continue;

    if (now.getTime() - created.getTime() >= thresholdMs) {
      await db
        .update(complaints)
        .set({
          assignedTo: ESCALATION_LEVELS[1],
          escalatedToM2At: now,
          updatedAt: now,
        })
        .where(eq(complaints.id, c.id));

      escalatedToM2 += 1;
    }
  }

  const m2Rows = await db
    .select()
    .from(complaints)
    .where(
      and(
        eq(complaints.status, COMPLAINT_STATUSES[0]),
        eq(complaints.assignedTo, ESCALATION_LEVELS[1]),
      ),
    );

  for (const c of m2Rows) {
    if (!c.escalatedToM2At) continue;
    const escalatedAt =
      c.escalatedToM2At instanceof Date
        ? c.escalatedToM2At
        : new Date(c.escalatedToM2At as any);

    if (Number.isNaN(escalatedAt.getTime())) continue;

    if (now.getTime() - escalatedAt.getTime() >= thresholdMs) {
      await db
        .update(complaints)
        .set({
          assignedTo: ESCALATION_LEVELS[2],
          escalatedToM3At: now,
          updatedAt: now,
        })
        .where(eq(complaints.id, c.id));

      escalatedToM3 += 1;
    }
  }

  console.log(
    `[escalation] Run completed at ${now.toISOString()} – escalated to m2: ${escalatedToM2}, escalated to m3: ${escalatedToM3}`,
  );
}