/*
  Warnings:

  - You are about to drop the column `expiresAt` on the `RefreshToken` table. All the data in the column will be lost.
  - Added the required column `expiredAt` to the `RefreshToken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RefreshToken" DROP COLUMN "expiresAt",
ADD COLUMN     "expiredAt" TIMESTAMP(3) NOT NULL;
