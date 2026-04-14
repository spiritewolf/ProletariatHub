-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "Hub" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "settingsId" UUID NOT NULL,
    "createdById" UUID NOT NULL,

    CONSTRAINT "Hub_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HubSettings" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),
    "dashboardTheme" TEXT NOT NULL DEFAULT 'SYSTEM',
    "updatedById" UUID NOT NULL,

    CONSTRAINT "HubSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comrade" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "onboardStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "settingsId" UUID NOT NULL,
    "hubId" UUID,
    "roleId" UUID NOT NULL,

    CONSTRAINT "Comrade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComradeSettings" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),
    "avatarIcon" TEXT,
    "avatarColor" TEXT,
    "phoneNumber" TEXT,
    "email" TEXT,
    "signalUsername" TEXT,
    "telegramUsername" TEXT,

    CONSTRAINT "ComradeSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),
    "roleType" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "comradeId" UUID NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Hub_settingsId_key" ON "Hub"("settingsId");

-- CreateIndex
CREATE INDEX "Hub_createdById_idx" ON "Hub"("createdById");

-- CreateIndex
CREATE INDEX "Hub_archivedAt_idx" ON "Hub"("archivedAt");

-- CreateIndex
CREATE INDEX "HubSettings_updatedById_idx" ON "HubSettings"("updatedById");

-- CreateIndex
CREATE INDEX "HubSettings_archivedAt_idx" ON "HubSettings"("archivedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Comrade_username_key" ON "Comrade"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Comrade_settingsId_key" ON "Comrade"("settingsId");

-- CreateIndex
CREATE INDEX "Comrade_hubId_idx" ON "Comrade"("hubId");

-- CreateIndex
CREATE INDEX "Comrade_roleId_idx" ON "Comrade"("roleId");

-- CreateIndex
CREATE INDEX "Comrade_archivedAt_idx" ON "Comrade"("archivedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Role_roleType_key" ON "Role"("roleType");

-- CreateIndex
CREATE INDEX "Role_archivedAt_idx" ON "Role"("archivedAt");

-- CreateIndex
CREATE INDEX "Session_comradeId_idx" ON "Session"("comradeId");

-- CreateIndex
CREATE INDEX "Session_expiresAt_idx" ON "Session"("expiresAt");

-- AddForeignKey
ALTER TABLE "Hub" ADD CONSTRAINT "Hub_settingsId_fkey" FOREIGN KEY ("settingsId") REFERENCES "HubSettings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hub" ADD CONSTRAINT "Hub_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Comrade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HubSettings" ADD CONSTRAINT "HubSettings_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "Comrade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comrade" ADD CONSTRAINT "Comrade_settingsId_fkey" FOREIGN KEY ("settingsId") REFERENCES "ComradeSettings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comrade" ADD CONSTRAINT "Comrade_hubId_fkey" FOREIGN KEY ("hubId") REFERENCES "Hub"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comrade" ADD CONSTRAINT "Comrade_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_comradeId_fkey" FOREIGN KEY ("comradeId") REFERENCES "Comrade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

