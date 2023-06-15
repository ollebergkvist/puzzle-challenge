// libs
import { PrismaClient, Prisma } from "@prisma/client";

// utils
import { hashPassword } from "../utils/hash-password";

const prisma = new PrismaClient();

const userData: Prisma.UserCreateInput[] = [
  {
    email: "admin@example.com",
    password: "password",
  },
];

async function main() {
  console.log(`Start seeding ...`);
  for (const u of userData) {
    const hashedPassword = await hashPassword(u.password);
    const user = await prisma.user.create({
      data: {
        ...u,
        password: hashedPassword,
      },
    });
    console.log(`Created user with id: ${user.id}`);
  }
  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
