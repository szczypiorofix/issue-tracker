export interface Issue {
    id: string;
    title: string;
    description: string;
    projectName: string;
    type: string;
    priority: string;
    reporter: string;
    assignees: string[];
    status: string;
    statusUpdatedAt: string;
}

export interface AppSettings {
    projects: string[];
    people: string[];
    issueTypes: string[];
    statuses: string[];
    priorities: string[];
}

export interface AppState {
    issues: Issue[];
    settings: AppSettings;
}
