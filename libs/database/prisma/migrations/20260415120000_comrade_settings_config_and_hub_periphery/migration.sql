-- RenameTable
ALTER TABLE "ComradeSettings" RENAME TO "ComradeSettingsConfig";

-- AlterTable
ALTER TABLE "ComradeSettingsConfig" ADD COLUMN "birthDate" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "HubPeripherySettingsConfig" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),
    "birthDate" TIMESTAMP(3),
    "avatarIcon" TEXT,
    "avatarColor" TEXT,
    "phoneNumber" TEXT,
    "email" TEXT,
    "signalUsername" TEXT,
    "telegramUsername" TEXT,

    CONSTRAINT "HubPeripherySettingsConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HubPeriphery" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "peripheryCategory" TEXT NOT NULL,
    "notes" TEXT,
    "settingsId" UUID NOT NULL,
    "hubId" UUID NOT NULL,
    "createdById" UUID NOT NULL,

    CONSTRAINT "HubPeriphery_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HubPeriphery_settingsId_key" ON "HubPeriphery"("settingsId");

-- CreateIndex
CREATE INDEX "HubPeriphery_hubId_idx" ON "HubPeriphery"("hubId");

-- CreateIndex
CREATE INDEX "HubPeriphery_createdById_idx" ON "HubPeriphery"("createdById");

-- CreateIndex
CREATE INDEX "HubPeriphery_archivedAt_idx" ON "HubPeriphery"("archivedAt");

-- AddForeignKey
ALTER TABLE "HubPeriphery" ADD CONSTRAINT "HubPeriphery_settingsId_fkey" FOREIGN KEY ("settingsId") REFERENCES "HubPeripherySettingsConfig"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HubPeriphery" ADD CONSTRAINT "HubPeriphery_hubId_fkey" FOREIGN KEY ("hubId") REFERENCES "Hub"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HubPeriphery" ADD CONSTRAINT "HubPeriphery_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Comrade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
