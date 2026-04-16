export type { RoleDbRecord } from '@proletariat-hub/database';

export type Role = {
  id: string;
  roleType: string;
  createdAt: Date;
  updatedAt: Date;
};

export type FindRoleWhereUniqueInput = {
  roleType: string;
};
