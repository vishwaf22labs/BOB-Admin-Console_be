export type ComplaintStatus = "open" | "resolved";

export type ComplaintSourceChannel = "voice" | "chat" | "sign";

export type ComplaintAssignee = "m1" | "m2" | "m3";

export interface ListComplaintsQuery {
  status?: ComplaintStatus;
  sourceChannel?: ComplaintSourceChannel;
  complaintCategory?: string;
  assignedTo?: ComplaintAssignee;
  search?: string;
  page?: number;
  limit?: number;
}

export interface ResolveComplaintBody {
  resolutionNote: string;
}

export interface IntakeComplaintBody {
  userName: string;
  userEmail: string;
  userPhone: string;
  userBankId: string;
  complaintText: string;
  complaintSummary: string;
  complaintCategory: string; 
  sourceChannel: ComplaintSourceChannel;
  languageDetected: string;
  audioUrl?: string;
  videoUrl?: string;
  rawChatText?: string;
}