export interface CreateCustomerBody {
  name: string;
  email: string;
  phone: string;
  channelMode?: "sign" | "chat" | "voice";
}