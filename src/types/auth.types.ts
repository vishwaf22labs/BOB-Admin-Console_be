export type Role = "super_admin" | "m1" | "m2" | "m3";

export interface JwtPayload {
  uuid: string;
  name: string;
  email: string;
  bankId: string | null;
  role: Role;
}

export interface AuthUser extends JwtPayload {}

export interface LoginRequestBody {
  email: string;
  password: string;
}

export interface LoginResponseUser {
  uuid: string;
  name: string;
  email: string;
  bankId: string | null;
  role: Role;
}