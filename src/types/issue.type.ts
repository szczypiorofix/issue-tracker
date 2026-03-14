import { z } from 'zod';

const IssueSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    projectName: z.string(),
    type: z.string(),
    priority: z.string(),
    reporter: z.string(),
    assignees: z.array(z.string()),
    status: z.string(),
    statusUpdatedAt: z.string(),
});

export type Issue = z.infer<typeof IssueSchema>;

export const IssuesSchema = z.array(IssueSchema);

export type Issues = z.infer<typeof IssuesSchema>;
