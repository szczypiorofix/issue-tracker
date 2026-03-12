import { AppSettings } from '../types';

export const defaultSettings: AppSettings = {
    projects: ['Project Alpha', 'Project Beta', 'Project Gamma'],
    people: ['Alice Johnson', 'Bob Smith', 'Carol Williams', 'David Brown', 'Eva Martinez'],

    issueTypes: ['Bug', 'New Feature', 'Feature Development'],
    statuses: ['New', 'In Development', 'Ready for Tests', 'In Tests', 'To Fix', 'Done'],

    priorities: ['Low', 'Medium', 'High'],
};
