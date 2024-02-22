/*
  Warnings:

  - Made the column `dbId` on table `SyncedData` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "SyncedData" ALTER COLUMN "dbId" SET NOT NULL;
