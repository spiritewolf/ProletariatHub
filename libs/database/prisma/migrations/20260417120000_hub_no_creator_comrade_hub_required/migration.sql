-- HubSettings: system-created settings may have no updater yet
ALTER TABLE "HubSettings" ALTER COLUMN "updatedById" DROP NOT NULL;

-- Backfill comrades missing hubId using creator link (while Hub.createdById still exists)
UPDATE "Comrade" AS c
SET "hubId" = h."id"
FROM "Hub" AS h
WHERE c."hubId" IS NULL
  AND h."createdById" = c."id";

UPDATE "Comrade" AS c
SET "hubId" = (SELECT "id" FROM "Hub" LIMIT 1)
WHERE c."hubId" IS NULL;

-- Require hub on every comrade; tighten FK (no SET NULL on delete)
ALTER TABLE "Comrade" DROP CONSTRAINT IF EXISTS "Comrade_hubId_fkey";

ALTER TABLE "Comrade" ALTER COLUMN "hubId" SET NOT NULL;

ALTER TABLE "Comrade"
  ADD CONSTRAINT "Comrade_hubId_fkey"
  FOREIGN KEY ("hubId") REFERENCES "Hub"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Hub: no user creator; hub is created by seed/system
ALTER TABLE "Hub" DROP CONSTRAINT IF EXISTS "Hub_createdById_fkey";

DROP INDEX IF EXISTS "Hub_createdById_idx";

ALTER TABLE "Hub" DROP COLUMN IF EXISTS "createdById";
