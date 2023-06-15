// libs
import { PrismaClient } from "@prisma/client";

async function resetMongoDBDatabase() {
  const prisma = new PrismaClient();

  try {
    // Connect to the database
    await prisma.$connect();

    // Drop/reset the MongoDB database
    await prisma.$runCommandRaw({ dropDatabase: 1 });

    console.log("MongoDB database dropped/reset successfully.");
  } catch (error) {
    console.error("Error dropping/resetting MongoDB database:", error);
  } finally {
    // Disconnect from the database
    await prisma.$disconnect();
  }
}

resetMongoDBDatabase();
