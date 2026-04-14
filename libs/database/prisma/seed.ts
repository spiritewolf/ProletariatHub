import { ComradeOnboardStatus, ComradeRole } from '@proletariat-hub/types';
import bcrypt from 'bcrypt';

import { prisma } from '../src/client';

const SEED_ADMIN_USERNAME = 'admin';
const SEED_ADMIN_PASSWORD = 'password';

async function main(): Promise<void> {
  const existingAdmin = await prisma.comrade.findUnique({
    where: { username: SEED_ADMIN_USERNAME },
  });
  if (existingAdmin !== null) {
    console.info(
      `Seed skipped: "${SEED_ADMIN_USERNAME}" already exists; passwords are not reset by seed.`,
    );
    return;
  }

  const adminPasswordHash: string = await bcrypt.hash(SEED_ADMIN_PASSWORD, 12);

  await prisma.role.createMany({
    data: [
      { roleType: ComradeRole.ADMIN, description: 'Hub administrator' },
      { roleType: ComradeRole.MEMBER, description: 'Hub member' },
    ],
    skipDuplicates: true,
  });

  const adminRole = await prisma.role.findUniqueOrThrow({
    where: { roleType: ComradeRole.ADMIN },
  });

  const comradeSettings = await prisma.comradeSettingsConfig.create({
    data: {},
  });

  const hubSettings = await prisma.hubSettings.create({
    data: {},
  });

  const hub = await prisma.hub.create({
    data: {
      name: 'My Hub',
      settingsId: hubSettings.id,
    },
  });

  await prisma.comrade.create({
    data: {
      username: SEED_ADMIN_USERNAME,
      password: adminPasswordHash,
      onboardStatus: ComradeOnboardStatus.PENDING,
      roleId: adminRole.id,
      settingsId: comradeSettings.id,
      hubId: hub.id,
    },
  });

  console.info(
    `Seeded dev admin: username="${SEED_ADMIN_USERNAME}" password="${SEED_ADMIN_PASSWORD}" (change after setup).`,
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (err: unknown) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
