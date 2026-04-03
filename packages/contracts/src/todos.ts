import { z } from 'zod';

export const todoVisibilitySchema = z.enum(['private', 'assigned', 'hub']);
export const todoRecurrenceSchema = z.enum(['one_time', 'daily', 'weekly', 'monthly']);
export const todoStatusSchema = z.enum(['open', 'completed', 'archived']);

export const todoListItemSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  category: z.string().nullable(),
  visibility: todoVisibilitySchema,
  assignedComradeId: z.uuid().nullable(),
  assigneeUsername: z.string().nullable(),
  createdByComradeId: z.uuid(),
  creatorUsername: z.string(),
  recurrence: todoRecurrenceSchema,
  dueDate: z.string().nullable(),
  dueTime: z.string().nullable(),
  annoyingModeEnabled: z.boolean(),
  status: todoStatusSchema,
  lastCompletedAt: z.number().int().nullable(),
  nextDueAt: z.number().int().nullable(),
  completedAt: z.number().int().nullable(),
});

export const todosListResponseSchema = z.object({
  todos: z.array(todoListItemSchema),
});

export const createTodoBodySchema = z
  .object({
    title: z.string().trim().min(1).max(500),
    category: z.string().trim().max(100).optional(),
    visibility: todoVisibilitySchema,
    assignedComradeId: z.uuid().optional().nullable(),
    dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
    dueTime: z.string().regex(/^\d{2}:\d{2}$/).optional().nullable(),
    recurrence: todoRecurrenceSchema.optional(),
    annoyingModeEnabled: z.boolean().optional(),
    notes: z.string().trim().max(2000).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.visibility === 'assigned' && data.assignedComradeId == null) {
      ctx.addIssue({
        code: 'custom',
        message: 'assigned visibility requires assignedComradeId',
        path: ['assignedComradeId'],
      });
    }
  });

export const createTodoResponseSchema = z.object({
  todo: todoListItemSchema,
});

export const completeTodoBodySchema = z.object({
  notes: z.string().trim().max(2000).optional(),
});

export const completeTodoResponseSchema = z.object({
  todo: todoListItemSchema,
});

export type TodoListItem = z.infer<typeof todoListItemSchema>;
export type CreateTodoBody = z.infer<typeof createTodoBodySchema>;
