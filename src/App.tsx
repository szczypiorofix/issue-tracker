import React from 'react';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/Layout';
import { LoginScreen } from './components/LoginScreen';
import { useLocalStorage } from './hooks/useLocalStorage';

export function App(): React.JSX.Element {
    const [userName, setUserName] = useLocalStorage<string>('issue-tracker-user', '');

    const handleLogin = (name: string) => {
        setUserName(name);
    };

    if (!userName) {
        return <LoginScreen onLogin={handleLogin} />;
    }
    return (
        <AppProvider userName={userName} onLogout={() => setUserName('')}>
            <Layout />
        </AppProvider>
    );
}
