/*
  Warnings:

  - You are about to drop the column `test_id` on the `Leaderboard` table. All the data in the column will be lost.
  - You are about to drop the column `joined_at` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Leaderboard" DROP COLUMN "test_id";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "joined_at",
ADD COLUMN     "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
