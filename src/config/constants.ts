export const ESCALATION_LEVELS = ["m1", "m2", "m3"] as const;
export const COMPLAINT_STATUSES = ["open", "resolved"] as const;
export const SOURCE_CHANNELS = ["voice", "chat", "sign"] as const;
export const COMPLAINT_CATEGORIES = [
  "transaction",
  "atm",
  "account_service",
] as const;
export const EMAIL_CHANNELS = ["chat", "sign"] as const;
export const VOICE_LANGUAGES = [
  "english",
  "hindi",
  "tamil",
  "telugu",
  "kannada",
  "malayalam",
] as const;