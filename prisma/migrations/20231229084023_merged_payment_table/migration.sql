/*
  Warnings:

  - You are about to drop the column `invoiceId` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the `LinkedTxn` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `linkedTxnId` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `linkedTxnType` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "LinkedTxn" DROP CONSTRAINT "LinkedTxn_paymentId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_invoiceId_fkey";

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "invoiceId",
ADD COLUMN     "linkedTxnId" TEXT NOT NULL,
ADD COLUMN     "linkedTxnType" TEXT NOT NULL;

-- DropTable
DROP TABLE "LinkedTxn";

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_linkedTxnId_fkey" FOREIGN KEY ("linkedTxnId") REFERENCES "Invoice"("qboInvoiceId") ON DELETE RESTRICT ON UPDATE CASCADE;
