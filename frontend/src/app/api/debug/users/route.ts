// src/app/api/debug/users/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true, role: true, password: true, },
  });

  // Masquer le hash pour la sécurité
  const safeUsers = users.map((u) => ({
    ...u,
    password: u.password ? `${u.password.substring(0, 10)}...` : null,
    isHashed: u.password?.startsWith("$2") ?? false,
  }));
  return NextResponse.json(users);
}