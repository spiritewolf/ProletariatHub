import { ComradeOnboardStatus, ComradeRole } from '@proletariat-hub/types';
import bcrypt from 'bcrypt';

import { prisma } from '../src/client';

async function main(): Promise<void> {
  const existingAdmin = await prisma.comrade.findUnique({
    where: { username: 'admin' },
  });
  if (existingAdmin !== null) {
    return;
  }

  const adminPasswordHash: string = await bcrypt.hash('password', 12);

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

  const comradeSettings = await prisma.comradeSettings.create({
    data: {},
  });

  const adminComrade = await prisma.comrade.create({
    data: {
      username: 'admin',
      password: adminPasswordHash,
      onboardStatus: ComradeOnboardStatus.PENDING,
      roleId: adminRole.id,
      settingsId: comradeSettings.id,
    },
  });

  const hubSettings = await prisma.hubSettings.create({
    data: {
      updatedById: adminComrade.id,
    },
  });

  const hub = await prisma.hub.create({
    data: {
      name: 'My Hub',
      settingsId: hubSettings.id,
      createdById: adminComrade.id,
    },
  });

  await prisma.comrade.update({
    where: { id: adminComrade.id },
    data: { hubId: hub.id },
  });
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
