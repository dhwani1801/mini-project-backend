-- CreateTable
CREATE TABLE "Item" (
    "id" TEXT NOT NULL,
    "qboItemId" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Item_qboItemId_key" ON "Item"("qboItemId");
