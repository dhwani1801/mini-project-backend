/*
  Warnings:

  - Added the required column `tenantID` to the `Customer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "tenantID" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Connections" (
    "id" SERIAL NOT NULL,
    "organizationId" TEXT,
    "channelType" TEXT,
    "channelName" TEXT,
    "companyName" TEXT,
    "companyId" TEXT,
    "tokenDetails" TEXT,
    "isActiveConnection" BOOLEAN NOT NULL DEFAULT true,
    "createdDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "modifiedDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "modifiedBy" TEXT,

    CONSTRAINT "Connections_pkey" PRIMARY KEY ("id")
);
