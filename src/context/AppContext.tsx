import React, {Context, createContext, useContext} from 'react';
import { Issue, AppSettings } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { defaultSettings } from '../data/defaults';

interface AppContextType {
    issues: Issue[];
    settings: AppSettings;
    userName: string;
    addIssue: (issue: Omit<Issue, 'id' | 'statusUpdatedAt'>) => void;
    updateIssue: (id: string, updates: Partial<Issue>) => void;
    deleteIssue: (id: string) => void;
    updateSettings: (category: keyof AppSettings, values: string[]) => void;
}

const AppContext: Context<AppContextType | undefined> = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children, userName }: { children: React.ReactNode; userName: string }) {
    const [settings, setSettings] = useLocalStorage<AppSettings>('issue-tracker-settings', defaultSettings);
    const [issues, setIssues] = useLocalStorage<Issue[]>('issue-tracker-issues', []);

    const addIssue = (issueData: Omit<Issue, 'id' | 'statusUpdatedAt'>) => {
        const newId = `ISS-${String(issues.length + 1).padStart(3, '0')}`;
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

    const deleteIssue = (id: string) => {
        setIssues(issues.filter((issue) => issue.id !== id));
    };

    const updateSettings = (category: keyof AppSettings, values: string[]) => {
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
