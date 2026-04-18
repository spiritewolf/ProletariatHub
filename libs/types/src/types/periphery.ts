export const HubPeripheryCategory = {
  PERSON: 'PERSON',
  PET: 'PET',
} as const;
export type HubPeripheryCategory = (typeof HubPeripheryCategory)[keyof typeof HubPeripheryCategory];

export type HubPeripherySettingsConfig = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  birthDate: Date | null;
  avatarIcon: string | null;
  avatarColor: string | null;
  phoneNumber: string | null;
  email: string | null;
};

export type PeripheryAvatarIcon = string | null;

export type Periphery = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  peripheryCategory: HubPeripheryCategory;
  notes: string | null;
  hubId: string;
  createdById: string;
  settings: HubPeripherySettingsConfig;
};
