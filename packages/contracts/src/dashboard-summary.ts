import { z } from 'zod';

export const dashboardSummarySchema = z.object({
  greeting: z.string(),
  today: z.string(),
  hubName: z.string(),
  urgentLine: z.string().nullable(),
  choresAssigned: z.array(z.unknown()),
  todosAssigned: z.array(z.unknown()),
  shoppingPreview: z.array(z.unknown()),
  calendarPreview: z.array(z.unknown()),
  docsPreview: z.unknown().nullable(),
});

export type DashboardSummary = z.infer<typeof dashboardSummarySchema>;
