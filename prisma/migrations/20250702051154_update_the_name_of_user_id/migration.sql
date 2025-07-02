/*
  Warnings:

  - You are about to drop the column `user_id` on the `Leaderboard` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Leaderboard` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Leaderboard` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Leaderboard" DROP CONSTRAINT "Leaderboard_user_id_fkey";

-- DropIndex
DROP INDEX "Leaderboard_user_id_idx";

-- DropIndex
DROP INDEX "Leaderboard_user_id_key";

-- AlterTable
ALTER TABLE "Leaderboard" DROP COLUMN "user_id",
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Leaderboard_userId_key" ON "Leaderboard"("userId");

-- CreateIndex
CREATE INDEX "Leaderboard_userId_idx" ON "Leaderboard"("userId");

-- AddForeignKey
ALTER TABLE "Leaderboard" ADD CONSTRAINT "Leaderboard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
