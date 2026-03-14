import React from 'react';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/Layout';
import { LoginScreen } from './components/LoginScreen';
import { useLocalStorage } from './hooks/useLocalStorage';
import { z } from 'zod';

const UserSchema = z.object({
    name: z.string(),
    active: z.boolean(),
});

type User = z.infer<typeof UserSchema>;

const defaultUser: User = {
    active: false,
    name: 'default',
};

export function App(): React.JSX.Element {
    const [user, setUser] = useLocalStorage<User>('issue-tracker-user', defaultUser, UserSchema);

    const handleLogin = (name: string): void => {
        setUser({
            name: name,
            active: true,
        });
    };

    if (!user || !user?.active) {
        return <LoginScreen onLogin={handleLogin} />;
    }
    return (
        <AppProvider
            userName={user.name}
            onLogout={() =>
                setUser({
                    name: '',
                    active: false,
                })
            }
        >
            <Layout />
        </AppProvider>
    );
}
