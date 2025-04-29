import { Contract, User } from "@prisma/client";

export type SafeInvoice = Omit<
  Contract,
  "endDate" | "createdAt" | "updatedAt" | "userName" | "investorName" | "currentRole"
> & {
  endDate: string;
  createdAt: string;
  updatedAt: string;
  userName?: string; 
  investorName?: string; 
  currentRole?:string;
};

export type SafeUser = Omit<
  User,
  "createdAt" | "updatedAt" | "emailVerified"
> & {
  createdAt: string;
  updatedAt: string;
  emailVerified: string | null;
};
