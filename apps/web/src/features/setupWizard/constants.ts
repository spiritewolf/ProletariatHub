import type { SetupWizardFormValues } from './types';

export const SetupSteps = {
  PASSWORD: 'PASSWORD',
  CONTACT: 'CONTACT',
  HUB: 'HUB',
  COMRADES: 'COMRADES',
  LAUNCH: 'LAUNCH',
} as const;
export type SetupSteps = (typeof SetupSteps)[keyof typeof SetupSteps];

export const SETUP_STEPS_MEMBER: SetupSteps[] = [
  SetupSteps.PASSWORD,
  SetupSteps.CONTACT,
  SetupSteps.LAUNCH,
];

export const SETUP_STEPS_ADMIN: SetupSteps[] = [
  SetupSteps.PASSWORD,
  SetupSteps.CONTACT,
  SetupSteps.HUB,
  SetupSteps.COMRADES,
  SetupSteps.LAUNCH,
];

export const STEP_FORM_FIELDS: Record<SetupSteps, Array<keyof SetupWizardFormValues>> = {
  [SetupSteps.PASSWORD]: ['username', 'newPassword', 'confirmPassword'],
  [SetupSteps.CONTACT]: ['phoneNumber', 'email', 'signalUsername', 'telegramUsername'],
  [SetupSteps.HUB]: ['hubName'],
  [SetupSteps.COMRADES]: ['recruits'],
  [SetupSteps.LAUNCH]: [],
};
