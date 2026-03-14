import { z } from 'zod';
import { Issue } from './issue.type.ts';

export const AppSettingsSchema = z.object({
    projects: z.array(z.string()),
    people: z.array(z.string()),
    issueTypes: z.array(z.string()),
    statuses: z.array(z.string()),
    priorities: z.array(z.string()),
});

export type AppSettings = z.infer<typeof AppSettingsSchema>;

export interface AppState {
    issues: Issue[];
    settings: AppSettings;
}
