import type { z } from 'zod';

import { comradeSettingsFormSchema } from './schema';

export type ComradeSettingsFormValues = z.input<typeof comradeSettingsFormSchema>;
export type ComradeSettingsParsedValues = z.output<typeof comradeSettingsFormSchema>;
