import { SetupWizardFormValues } from './schema';

export const SetupSteps = {
  ACCOUNT: 'ACCOUNT',
  HUB: 'HUB',
  COMRADES: 'COMRADES',
  LAUNCH: 'LAUNCH',
} as const;
export type SetupSteps = (typeof SetupSteps)[keyof typeof SetupSteps];

export const SETUP_STEPS_MEMBER: SetupSteps[] = [SetupSteps.ACCOUNT];
export const SETUP_STEPS_ADMIN: SetupSteps[] = [
  SetupSteps.ACCOUNT,
  SetupSteps.HUB,
  SetupSteps.COMRADES,
  SetupSteps.LAUNCH,
];

export const STEP_FORM_FIELDS: Record<SetupSteps, Array<keyof SetupWizardFormValues>> = {
  [SetupSteps.ACCOUNT]: ['username', 'newPassword', 'confirmPassword'],
  [SetupSteps.HUB]: ['hubName'],
  [SetupSteps.COMRADES]: ['recruits'],
  [SetupSteps.LAUNCH]: [],
};
