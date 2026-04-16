-- DropForeignKey
ALTER TABLE "HubSettings" DROP CONSTRAINT "HubSettings_updatedById_fkey";

-- AlterTable
ALTER TABLE "ComradeSettingsConfig" RENAME CONSTRAINT "ComradeSettings_pkey" TO "ComradeSettingsConfig_pkey";

-- AlterTable
ALTER TABLE "HubSettings" ADD COLUMN     "claimExpiryHours" INTEGER NOT NULL DEFAULT 48,
ADD COLUMN     "expiryWarningDays" INTEGER NOT NULL DEFAULT 3;

-- CreateTable
CREATE TABLE "HubList" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "hubId" UUID NOT NULL,

    CONSTRAINT "HubList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HubListItem" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION,
    "notes" TEXT,
    "productId" UUID NOT NULL,
    "listId" UUID NOT NULL,
    "createdById" UUID NOT NULL,
    "claimedAt" TIMESTAMP(3),
    "claimedById" UUID,
    "purchasedById" UUID,

    CONSTRAINT "HubListItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HubInventoryProduct" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "brandName" TEXT,
    "description" TEXT,
    "productCode" TEXT,
    "productUrl" TEXT,
    "purchaseFrequency" TEXT NOT NULL,
    "customFrequencyDays" INTEGER,
    "notes" TEXT,
    "quantityInStock" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "lastPurchasedAt" TIMESTAMP(3),
    "lastPurchasedById" UUID,
    "minStockThreshold" DOUBLE PRECISION,
    "urgentStockThreshold" DOUBLE PRECISION,
    "expiresAt" TIMESTAMP(3),
    "openedAt" TIMESTAMP(3),
    "storageLocation" TEXT,
    "storageLocationOpened" TEXT,
    "storageNotes" TEXT,
    "shelfLifeDays" INTEGER,
    "shelfLifeOpenedDays" INTEGER,
    "categoryId" UUID,
    "vendorId" UUID,
    "hubId" UUID NOT NULL,
    "createdById" UUID NOT NULL,

    CONSTRAINT "HubInventoryProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HubInventoryProductCategory" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "hubId" UUID NOT NULL,

    CONSTRAINT "HubInventoryProductCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HubInventoryVendor" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "website" TEXT,
    "fulfillmentType" TEXT NOT NULL,
    "notes" TEXT,
    "hubId" UUID NOT NULL,

    CONSTRAINT "HubInventoryVendor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HubPurchaseLog" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "quantityPurchased" DOUBLE PRECISION NOT NULL,
    "price" DOUBLE PRECISION,
    "notes" TEXT,
    "productId" UUID NOT NULL,
    "vendorId" UUID,
    "purchasedById" UUID NOT NULL,
    "hubId" UUID NOT NULL,

    CONSTRAINT "HubPurchaseLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "HubList_hubId_idx" ON "HubList"("hubId");

-- CreateIndex
CREATE INDEX "HubList_archivedAt_idx" ON "HubList"("archivedAt");

-- CreateIndex
CREATE INDEX "HubListItem_listId_idx" ON "HubListItem"("listId");

-- CreateIndex
CREATE INDEX "HubListItem_productId_idx" ON "HubListItem"("productId");

-- CreateIndex
CREATE INDEX "HubListItem_createdById_idx" ON "HubListItem"("createdById");

-- CreateIndex
CREATE INDEX "HubListItem_claimedById_idx" ON "HubListItem"("claimedById");

-- CreateIndex
CREATE INDEX "HubListItem_purchasedById_idx" ON "HubListItem"("purchasedById");

-- CreateIndex
CREATE INDEX "HubListItem_status_idx" ON "HubListItem"("status");

-- CreateIndex
CREATE INDEX "HubInventoryProduct_hubId_idx" ON "HubInventoryProduct"("hubId");

-- CreateIndex
CREATE INDEX "HubInventoryProduct_categoryId_idx" ON "HubInventoryProduct"("categoryId");

-- CreateIndex
CREATE INDEX "HubInventoryProduct_vendorId_idx" ON "HubInventoryProduct"("vendorId");

-- CreateIndex
CREATE INDEX "HubInventoryProduct_createdById_idx" ON "HubInventoryProduct"("createdById");

-- CreateIndex
CREATE INDEX "HubInventoryProduct_lastPurchasedById_idx" ON "HubInventoryProduct"("lastPurchasedById");

-- CreateIndex
CREATE INDEX "HubInventoryProduct_archivedAt_idx" ON "HubInventoryProduct"("archivedAt");

-- CreateIndex
CREATE UNIQUE INDEX "HubInventoryProduct_hubId_productCode_key" ON "HubInventoryProduct"("hubId", "productCode");

-- CreateIndex
CREATE INDEX "HubInventoryProductCategory_hubId_idx" ON "HubInventoryProductCategory"("hubId");

-- CreateIndex
CREATE UNIQUE INDEX "HubInventoryProductCategory_hubId_name_key" ON "HubInventoryProductCategory"("hubId", "name");

-- CreateIndex
CREATE INDEX "HubInventoryVendor_hubId_idx" ON "HubInventoryVendor"("hubId");

-- CreateIndex
CREATE UNIQUE INDEX "HubInventoryVendor_hubId_name_key" ON "HubInventoryVendor"("hubId", "name");

-- CreateIndex
CREATE INDEX "HubPurchaseLog_productId_idx" ON "HubPurchaseLog"("productId");

-- CreateIndex
CREATE INDEX "HubPurchaseLog_vendorId_idx" ON "HubPurchaseLog"("vendorId");

-- CreateIndex
CREATE INDEX "HubPurchaseLog_purchasedById_idx" ON "HubPurchaseLog"("purchasedById");

-- CreateIndex
CREATE INDEX "HubPurchaseLog_hubId_idx" ON "HubPurchaseLog"("hubId");

-- CreateIndex
CREATE INDEX "HubPurchaseLog_createdAt_idx" ON "HubPurchaseLog"("createdAt");

-- AddForeignKey
ALTER TABLE "HubSettings" ADD CONSTRAINT "HubSettings_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "Comrade"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HubList" ADD CONSTRAINT "HubList_hubId_fkey" FOREIGN KEY ("hubId") REFERENCES "Hub"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HubListItem" ADD CONSTRAINT "HubListItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "HubInventoryProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HubListItem" ADD CONSTRAINT "HubListItem_listId_fkey" FOREIGN KEY ("listId") REFERENCES "HubList"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HubListItem" ADD CONSTRAINT "HubListItem_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Comrade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HubListItem" ADD CONSTRAINT "HubListItem_claimedById_fkey" FOREIGN KEY ("claimedById") REFERENCES "Comrade"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HubListItem" ADD CONSTRAINT "HubListItem_purchasedById_fkey" FOREIGN KEY ("purchasedById") REFERENCES "Comrade"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HubInventoryProduct" ADD CONSTRAINT "HubInventoryProduct_lastPurchasedById_fkey" FOREIGN KEY ("lastPurchasedById") REFERENCES "Comrade"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HubInventoryProduct" ADD CONSTRAINT "HubInventoryProduct_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "HubInventoryProductCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HubInventoryProduct" ADD CONSTRAINT "HubInventoryProduct_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "HubInventoryVendor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HubInventoryProduct" ADD CONSTRAINT "HubInventoryProduct_hubId_fkey" FOREIGN KEY ("hubId") REFERENCES "Hub"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HubInventoryProduct" ADD CONSTRAINT "HubInventoryProduct_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Comrade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HubInventoryProductCategory" ADD CONSTRAINT "HubInventoryProductCategory_hubId_fkey" FOREIGN KEY ("hubId") REFERENCES "Hub"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HubInventoryVendor" ADD CONSTRAINT "HubInventoryVendor_hubId_fkey" FOREIGN KEY ("hubId") REFERENCES "Hub"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HubPurchaseLog" ADD CONSTRAINT "HubPurchaseLog_productId_fkey" FOREIGN KEY ("productId") REFERENCES "HubInventoryProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HubPurchaseLog" ADD CONSTRAINT "HubPurchaseLog_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "HubInventoryVendor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HubPurchaseLog" ADD CONSTRAINT "HubPurchaseLog_purchasedById_fkey" FOREIGN KEY ("purchasedById") REFERENCES "Comrade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HubPurchaseLog" ADD CONSTRAINT "HubPurchaseLog_hubId_fkey" FOREIGN KEY ("hubId") REFERENCES "Hub"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
