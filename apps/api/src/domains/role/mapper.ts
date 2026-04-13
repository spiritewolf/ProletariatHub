import type { Role, RoleDbRecord } from './types';

export function parseRole(roleDbRecord: RoleDbRecord): Role {
  return {
    id: roleDbRecord.id,
    roleType: roleDbRecord.roleType,
    createdAt: roleDbRecord.createdAt,
    updatedAt: roleDbRecord.updatedAt,
  };
}
