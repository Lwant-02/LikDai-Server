/*
  Warnings:

  - You are about to drop the column `test_type` on the `TypingTest` table. All the data in the column will be lost.
  - Added the required column `lessonLevel` to the `TypingTest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TypingTest" DROP COLUMN "test_type",
ADD COLUMN     "lessonLevel" TEXT NOT NULL;
