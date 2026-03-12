import "dotenv/config";

import { db } from "../src/db/client";
import { complaints } from "../src/db/schema/complaints";

type NewComplaint = typeof complaints.$inferInsert;

function daysAgo(days: number): Date {
  const now = new Date();
  return new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
}

function makeTicketId(index: number): string {
  const year = 2026;
  const suffix = String(index).padStart(5, "0");
  return `BOB-${year}-${suffix}`;
}

const transactionTexts = [
  "Rs 5000 was debited from my account but the transaction failed at merchant. Amount not refunded yet.",
  "Double debit happened for a single UPI payment. Need immediate refund.",
];

const atmTexts = [
  "ATM showed cash dispensed but I did not receive the money. Rs 10000 deducted.",
  "My ATM card got blocked after 3 wrong PIN attempts. Need to unblock it.",
  "ATM machine ate my card and did not return it.",
];

const accountServiceTexts = [
  "I need to update my registered mobile number linked to my account.",
  "My account has been frozen without any notice. Need immediate assistance.",
  "Need to change my home branch from Mumbai to Delhi.",
];

const names = [
  "Amit Sharma",
  "Priya Verma",
  "Rahul Iyer",
  "Neha Gupta",
  "Suresh Reddy",
  "Kiran Patil",
  "Ananya Das",
  "Vikas Kulkarni",
  "Meera Nair",
  "Rohit Mehta",
];

const banks = ["bank_of_baroda", "bank_of_dev", "bank_of_pm"] as const;
const languages = [
  "english",
  "hindi",
  "tamil",
  "telugu",
  "gujarati",
  "kannada",
  "bengali",
] as const;
const channels = ["voice", "chat", "sign"] as const;
const categories = ["transaction", "atm", "account_service"] as const;

function randomItem<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function makePhone(index: number): string {
  const start = index % 2 === 0 ? "9" : "8";
  const rest = String(100000000 + index * 137).slice(0, 9);
  return start + rest;
}

async function main() {
  const records: NewComplaint[] = [];

  for (let i = 1; i <= 8; i++) {
    const name = names[(i - 1) % names.length];
    const bank = banks[(i - 1) % banks.length];
    const category = categories[(i - 1) % categories.length];
    const textSource =
      category === "transaction"
        ? transactionTexts[(i - 1) % transactionTexts.length]
        : category === "atm"
          ? atmTexts[(i - 1) % atmTexts.length]
          : accountServiceTexts[(i - 1) % accountServiceTexts.length];

    const createdAt = daysAgo(1 + (i % 5));

    records.push({
      ticketId: makeTicketId(i),
      userName: name,
      userEmail: `${name.toLowerCase().replace(/\s+/g, ".")}@example.com`,
      userPhone: makePhone(i),
      userBankId: bank,
      complaintText: textSource,
      complaintSummary: textSource.slice(0, 90) + "...",
      complaintCategory: category,
      sourceChannel: randomItem(channels),
      languageDetected: randomItem(languages),
      signConfidencePct: null,
      status: "open",
      assignedTo: "m1",
      resolutionNote: null,
      resolvedBy: null,
      resolvedAt: null,
      escalatedToM2At: null,
      escalatedToM3At: null,
      emailSent: false,
      emailSentAt: null,
      callSent: false,
      callSentAt: null,
      createdAt,
      updatedAt: createdAt,
    });
  }

  for (let i = 9; i <= 12; i++) {
    const idx = i - 1;
    const name = names[idx % names.length];
    const bank = banks[idx % banks.length];
    const category = categories[idx % categories.length];
    const channel: (typeof channels)[number] = channels[idx % channels.length];
    const textSource =
      category === "transaction"
        ? transactionTexts[idx % transactionTexts.length]
        : category === "atm"
          ? atmTexts[idx % atmTexts.length]
          : accountServiceTexts[idx % accountServiceTexts.length];

    const createdAt = daysAgo(4 + (idx % 4));
    const escalatedToM2At = daysAgo(2 + (idx % 3));

    records.push({
      ticketId: makeTicketId(i),
      userName: name,
      userEmail: `${name.toLowerCase().replace(/\s+/g, ".")}@example.com`,
      userPhone: makePhone(i),
      userBankId: bank,
      complaintText: textSource,
      complaintSummary: textSource.slice(0, 90) + "...",
      complaintCategory: category,
      sourceChannel: channel,
      languageDetected: randomItem(languages),
      signConfidencePct: channel === "sign" ? "82.50" : null,
      status: "open",
      assignedTo: "m2",
      resolutionNote: null,
      resolvedBy: null,
      resolvedAt: null,
      escalatedToM2At,
      escalatedToM3At: null,
      emailSent: false,
      emailSentAt: null,
      callSent: false,
      callSentAt: null,
      createdAt,
      updatedAt: createdAt,
    });
  }

  for (let i = 13; i <= 14; i++) {
    const idx = i - 1;
    const name = names[idx % names.length];
    const bank = banks[idx % banks.length];
    const category = categories[idx % categories.length];
    const channel: (typeof channels)[number] = channels[idx % channels.length];
    const textSource =
      category === "transaction"
        ? transactionTexts[idx % transactionTexts.length]
        : category === "atm"
          ? atmTexts[idx % atmTexts.length]
          : accountServiceTexts[idx % accountServiceTexts.length];

    const createdAt = daysAgo(7 + (idx % 3));
    const escalatedToM2At = daysAgo(5 + (idx % 2));
    const escalatedToM3At = daysAgo(3 + (idx % 2));

    records.push({
      ticketId: makeTicketId(i),
      userName: name,
      userEmail: `${name.toLowerCase().replace(/\s+/g, ".")}@example.com`,
      userPhone: makePhone(i),
      userBankId: bank,
      complaintText: textSource,
      complaintSummary: textSource.slice(0, 90) + "...",
      complaintCategory: category,
      sourceChannel: channel,
      languageDetected: randomItem(languages),
      signConfidencePct: channel === "sign" ? "91.20" : null,
      status: "open",
      assignedTo: "m3",
      resolutionNote: null,
      resolvedBy: null,
      resolvedAt: null,
      escalatedToM2At,
      escalatedToM3At,
      emailSent: false,
      emailSentAt: null,
      callSent: false,
      callSentAt: null,
      createdAt,
      updatedAt: createdAt,
    });
  }

  for (let i = 15; i <= 20; i++) {
    const idx = i - 1;
    const name = names[idx % names.length];
    const bank = banks[idx % banks.length];
    const category = categories[idx % categories.length];
    const channel: (typeof channels)[number] = channels[idx % channels.length];
    const textSource =
      category === "transaction"
        ? transactionTexts[idx % transactionTexts.length]
        : category === "atm"
          ? atmTexts[idx % atmTexts.length]
          : accountServiceTexts[idx % accountServiceTexts.length];

    const createdAt = daysAgo(9 - (idx % 5));
    const resolvedAt = daysAgo(7 - (idx % 4));
    const resolvedBy = idx % 2 === 0 ? "m2" : "m3";

    const isVoice = channel === "voice";
    const isChat = channel === "chat";

    records.push({
      ticketId: makeTicketId(i),
      userName: name,
      userEmail: `${name.toLowerCase().replace(/\s+/g, ".")}@example.com`,
      userPhone: makePhone(i),
      userBankId: bank,
      complaintText: textSource,
      complaintSummary: textSource.slice(0, 90) + "...",
      complaintCategory: category,
      sourceChannel: channel,
      languageDetected: randomItem(languages),
      signConfidencePct: channel === "sign" ? "95.75" : null,
      status: "resolved",
      assignedTo: resolvedBy as "m2" | "m3",
      resolutionNote:
        "Issue investigated and resolved. Customer informed about the resolution.",
      resolvedBy,
      resolvedAt,
      escalatedToM2At: idx % 3 === 0 ? daysAgo(8) : null,
      escalatedToM3At: idx % 4 === 0 ? daysAgo(6) : null,
      emailSent: isChat,
      emailSentAt: isChat ? resolvedAt : null,
      callSent: isVoice,
      callSentAt: isVoice ? resolvedAt : null,
      createdAt,
      updatedAt: resolvedAt,
    });
  }

  await db.insert(complaints).values(records);

  console.log(`Inserted ${records.length} dummy complaints.`);
}

main()
  .catch((err) => {
    console.error("Seed complaints failed", err);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
