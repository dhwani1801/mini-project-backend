/*
  Warnings:

  - You are about to drop the `Connections` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Connections";

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "detailType" TEXT NOT NULL,
    "amount" DOUBLE PRECISION,
    "salesItemName" TEXT NOT NULL,
    "salesItemValue" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "totalAmt" DOUBLE PRECISION NOT NULL,
    "customerId" TEXT NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LinkedTxn" (
    "id" TEXT NOT NULL,
    "txnId" TEXT NOT NULL,
    "txnType" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,

    CONSTRAINT "LinkedTxn_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LinkedTxn" ADD CONSTRAINT "LinkedTxn_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
