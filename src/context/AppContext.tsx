import React, { Context, createContext, useContext } from 'react';
import { AppSettings, AppSettingsSchema, Issue, Issues, IssuesSchema } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { defaultSettings } from '../data/defaults';
import { AppContextType, AppProviderProps } from './AppContext.type';

const AppContext: Context<AppContextType | undefined> = createContext<AppContextType | undefined>(undefined);

const defaultIssues: Issues = [];
const defaultAppSettings: AppSettings = { ...defaultSettings };

function assignNewIdToIssue(issues: Array<Issue>) {
    const maxId = issues.reduce((max, issue) => {
        const num = parseInt(issue.id.replace('ISS-', ''), 10);
        return num > max ? num : max;
    }, 0);
    return `ISS-${String(maxId + 1).padStart(6, '0')}`;
}

export function AppProvider({ children, userName, onLogout }: AppProviderProps): React.JSX.Element {
    const [settings, setSettings] = useLocalStorage<AppSettings>(
        'issue-tracker-settings',
        defaultAppSettings,
        AppSettingsSchema,
    );
    const [issues, setIssues] = useLocalStorage<Issue[]>('issue-tracker-issues', defaultIssues, IssuesSchema);

    const addIssue = (issueData: Omit<Issue, 'id' | 'statusUpdatedAt'>) => {
        const newId = assignNewIdToIssue(issues);
        const newIssue: Issue = {
            ...issueData,
            id: newId,
            statusUpdatedAt: new Date().toISOString(),
        };
        setIssues([...issues, newIssue]);
    };

    const updateIssue = (id: string, updates: Partial<Issue>) => {
        setIssues(
            issues.map((issue) => {
                if (issue.id === id) {
                    const updatedIssue = {
                        ...issue,
                        ...updates,
                    };
                    if (updates.status && updates.status !== issue.status) {
                        updatedIssue.statusUpdatedAt = new Date().toISOString();
                    }
                    return updatedIssue;
                }
                return issue;
            }),
        );
    };

    const deleteIssue = (id: string): void => {
        setIssues(issues.filter((issue) => issue.id !== id));
    };

    const updateSettings = (category: keyof AppSettings, values: string[]): void => {
        setSettings({
            ...settings,
            [category]: values,
        });
    };

    return (
        <AppContext.Provider
            value={{
                issues,
                settings,
                userName,
                onLogout,
                addIssue,
                updateIssue,
                deleteIssue,
                updateSettings,
            }}
        >
            {children}
        </AppContext.Provider>
    );
}
export function useAppContext(): AppContextType {
    const context: AppContextType | undefined = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
}
