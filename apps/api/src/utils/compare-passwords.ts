// libs
import bcrypt from "bcrypt";

export async function comparePasswords(password, hashedPassword) {
  try {
    const passwordsMatch = await bcrypt.compare(password, hashedPassword);

    return passwordsMatch;
  } catch (error) {
    throw new Error("An error occurred while comparing passwords");
  }
}
