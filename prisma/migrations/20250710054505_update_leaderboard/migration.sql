/*
  Warnings:

  - A unique constraint covering the columns `[userId,mode]` on the table `Leaderboard` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Leaderboard_userId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Leaderboard_userId_mode_key" ON "Leaderboard"("userId", "mode");
