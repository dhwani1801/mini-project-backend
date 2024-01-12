-- CreateTable
CREATE TABLE "Configuration" (
    "id" TEXT NOT NULL,
    "type" TEXT,
    "configuration" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Configuration_pkey" PRIMARY KEY ("id")
);
