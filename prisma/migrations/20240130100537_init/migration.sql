/*
  Warnings:

  - Made the column `qboId` on table `SyncedData` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "SyncedData" ALTER COLUMN "qboId" SET NOT NULL;
