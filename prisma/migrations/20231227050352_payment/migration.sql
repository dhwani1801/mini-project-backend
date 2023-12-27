/*
  Warnings:

  - A unique constraint covering the columns `[qboInvoiceId]` on the table `Invoice` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[qboPaymentId]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `qboInvoiceId` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenantID` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenantID` to the `LinkedTxn` table without a default value. This is not possible if the table is not empty.
  - Added the required column `qboPaymentId` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenantID` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "qboInvoiceId" TEXT NOT NULL,
ADD COLUMN     "tenantID" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "LinkedTxn" ADD COLUMN     "tenantID" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "qboPaymentId" TEXT NOT NULL,
ADD COLUMN     "tenantID" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_qboInvoiceId_key" ON "Invoice"("qboInvoiceId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_qboPaymentId_key" ON "Payment"("qboPaymentId");
