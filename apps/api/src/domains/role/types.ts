import type { Prisma } from '@proletariat-hub/database';

export type RoleDbRecord = Prisma.RoleGetPayload<{
  select: {
    id: true;
    roleType: true;
    createdAt: true;
    updatedAt: true;
    archivedAt: true;
  };
}>;

export type Role = {
  id: string;
  roleType: string;
  createdAt: Date;
  updatedAt: Date;
};

export type FindRoleWhereUniqueInput = {
  roleType: string;
};
