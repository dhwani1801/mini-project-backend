/*
  Warnings:

  - A unique constraint covering the columns `[qboId]` on the table `syncLogs` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "syncLogs_qboId_key" ON "syncLogs"("qboId");
