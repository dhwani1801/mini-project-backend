-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "tenantName" TEXT,
    "tenantID" TEXT,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "accessTokenUTCDate" TIMESTAMP(3),
    "customerLastSyncDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);
