-- CreateTable
CREATE TABLE "SyncedData" (
    "id" TEXT NOT NULL,
    "dbId" TEXT,
    "qboId" TEXT,
    "recordType" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SyncedData_pkey" PRIMARY KEY ("id")
);
