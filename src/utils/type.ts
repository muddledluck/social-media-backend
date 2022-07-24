import { User } from "@prisma/client";

export interface userVerifyJWTPayloadType extends User {
  session: string;
  iat?: number;
  exp?: number;
}
