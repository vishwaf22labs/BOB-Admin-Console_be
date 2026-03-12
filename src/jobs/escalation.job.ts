import { runEscalation } from "../services/escalation.service";

const ONE_HOUR_MS = 60 * 60 * 1000;

export function startEscalationJob(): void {
  const run = async () => {
    const startedAt = new Date();
    console.log(`[escalation] Run started at ${startedAt.toISOString()}`);
    try {
      await runEscalation();
    } catch (err) {
      console.error("[escalation] Run failed", err);
    }
  };

  void run();

  setInterval(run, ONE_HOUR_MS);
}