-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "qboCustomerId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "givenName" TEXT NOT NULL,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);
