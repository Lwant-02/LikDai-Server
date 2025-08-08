/*
  Warnings:

  - Added the required column `lessonLevel` to the `Leaderboard` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "LessonLevel" AS ENUM ('beginner', 'intermediate', 'advanced', 'quotes', 'music');

-- AlterTable
ALTER TABLE "Leaderboard" ADD COLUMN     "lessonLevel" "LessonLevel" NOT NULL;
