// frontend/scripts/hash-passwords.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    where: { password: { not: null } },
  });

  console.log(`📋 ${users.length} utilisateurs trouvés`);

  for (const user of users) {
    if (user.password && !user.password.startsWith("$2")) {
      const hashed = await bcrypt.hash(user.password, 10);
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashed },
      });
      console.log(`✅ Hashé : ${user.email}`);
    } else {
      console.log(`⏭️  Déjà hashé : ${user.email}`);
    }
  }

  console.log("🎉 Terminé");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());