/*
  Warnings:

  - A unique constraint covering the columns `[qboCustomerId]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Customer_qboCustomerId_key" ON "Customer"("qboCustomerId");
