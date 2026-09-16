import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";
import path from "path";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

function createPrismaClient() {
  // Use the DATABASE_URL from environment which aligns with what 'prisma db push' uses
  const url = process.env.DATABASE_URL || `file:${path.join(process.cwd(), "dev.db")}`;
  
  const adapter = new PrismaLibSql({ url });
  return new PrismaClient({ adapter } as any);
}

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

