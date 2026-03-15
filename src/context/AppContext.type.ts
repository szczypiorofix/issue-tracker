import React from 'react';
import { AppSettings, Issue, IssuePayload } from '../types';

export interface AppContextType {
    issues: Issue[];
    settings: AppSettings;
    userName: string;
    onLogout: () => void;
    addIssue: (issue: IssuePayload) => void;
    updateIssue: (id: string, updates: Partial<Issue>) => void;
    deleteIssue: (id: string) => void;
    updateSettings: (category: keyof AppSettings, values: string[]) => void;
}

export interface AppProviderProps {
    children: React.ReactNode;
    userName: string;
    onLogout: () => void;
}
