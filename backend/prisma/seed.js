import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("123", 10);

  await prisma.user.upsert({
    where: { email: "admin@example.com" }, // wajib ada, sesuai schema
    update: {},
    create: {
      username: "admin",
      email: "admin@example.com",
      password: hashedPassword,
    },
  });

  console.log("✅ Admin user created!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
