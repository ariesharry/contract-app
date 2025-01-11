import { Contract, User } from "@prisma/client";

export type SafeInvoice = Omit<
  Contract,
  "endDate" | "createdAt" | "updatedAt"
> & {
  endDate: string;
  createdAt: string;
  updatedAt: string;
};

export type SafeUser = Omit<
  User,
  "createdAt" | "updatedAt" | "emailVerified"
> & {
  createdAt: string;
  updatedAt: string;
  emailVerified: string | null;
};
