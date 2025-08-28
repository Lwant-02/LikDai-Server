import prisma from "../lib/db.lib";

// Function to generate short unique username if baseName is taken
export const generateUsername = async (baseName: string) => {
  let username = baseName;
  let exists = await prisma.user.findUnique({ where: { username } });
  let attempt = 1;

  // keep trying until we find a free username
  while (exists) {
    // append a random 2-digit number
    const randomNum = Math.floor(Math.random() * 90 + 10); // 10-99
    username = `${baseName}${randomNum}`;
    exists = await prisma.user.findUnique({ where: { username } });
    attempt++;
    if (attempt > 50) {
      // fallback just in case
      username = `${baseName}${Date.now()}`;
      break;
    }
  }

  return username;
};
