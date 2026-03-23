export interface CreateCustomerBody {
  name: string;
  email?: string | null;
  phone: string;
  channelMode?: "sign" | "chat" | "voice";
}