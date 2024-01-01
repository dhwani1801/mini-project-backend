-- CreateTable
CREATE TABLE "syncLogs" (
    "id" TEXT NOT NULL,
    "qboId" TEXT NOT NULL,
    "recordType" TEXT NOT NULL,
    "tenantID" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "syncLogs_pkey" PRIMARY KEY ("id")
);
