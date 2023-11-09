/*
  Warnings:

  - You are about to drop the column `forgotPasswordTokenExpiresAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Token` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Token" DROP CONSTRAINT "Token_userId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "forgotPasswordTokenExpiresAt",
ADD COLUMN     "accessToken" TEXT;

-- DropTable
DROP TABLE "Token";
