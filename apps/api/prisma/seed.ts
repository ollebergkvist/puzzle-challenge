// libs
import axios from "axios";
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

  try {
    // Seed users
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

    const { data: products } = await axios.get(
      "https://fakestoreapi.com/products"
    );

    // Seed products
    if (products.length > 0) {
      const mappedProducts = products.map((product: any) => ({
        title: product.title.trim(),
        price: parseFloat(product.price),
        image: product.image.trim(),
        rating: parseFloat(product.rating.rate),
        category: product.category.trim(),
      }));

      try {
        for (const product of mappedProducts) {
          await prisma.product.create({
            data: product,
          });
        }

        console.log("Products seeded successfully.");
      } catch (error) {
        console.error("Error seeding products:", error);
      }
    } else {
      console.log("No products found.");
    }

    console.log(`Seeding finished.`);
  } catch (error) {
    console.error("Error seeding users:", error);
  }
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
