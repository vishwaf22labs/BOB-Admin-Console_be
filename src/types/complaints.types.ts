export type ComplaintStatus = "open" | "resolved";

export type ComplaintSourceChannel = "voice" | "chat" | "sign";

export type ComplaintAssignee = "m1" | "m2" | "m3";

export interface TranscriptMessage {
  role: "agent" | "user";
  content: string;
  timestamp?: string;
}

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