import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BugIcon, SettingsIcon, LayoutDashboardIcon, LogOutIcon } from 'lucide-react';
import { IssuesTable } from './IssuesTable';
import { SettingsPanel } from './SettingsPanel';
import { useAppContext } from '../context/AppContext';

export function Layout(): React.JSX.Element {
    const [activeTab, setActiveTab] = useState<'issues' | 'settings'>('issues');
    const { userName, onLogout } = useAppContext();

    return (
        <div className='min-h-screen bg-zinc-100 flex flex-col font-sans text-zinc-900'>
            {/* Header */}
            <header className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-30 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-3">
                            <div className="bg-gradient-to-br from-indigo-500 to-violet-600 p-1.5 rounded-lg shadow-inner">
                                <BugIcon className="h-5 w-5 text-white" />
                            </div>
                            <h1 className="text-xl font-bold tracking-tight text-white">
                                Issue Tracker
                            </h1>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden sm:flex items-center space-x-2">
                            <button
                                onClick={() => setActiveTab('issues')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'issues' ? 'bg-white/10 text-white shadow-sm' : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'}`}
                            >
                                <LayoutDashboardIcon className="h-4 w-4" />
                                Issues
                            </button>
                            <button
                                onClick={() => setActiveTab('settings')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'settings' ? 'bg-white/10 text-white shadow-sm' : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'}`}
                            >
                                <SettingsIcon className="h-4 w-4" />
                                Settings
                            </button>

                            <div className="w-px h-6 bg-zinc-700 mx-2" />

                            <div className="flex items-center gap-2">
                                <div className="h-7 w-7 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-xs font-semibold text-white">
                                    {userName.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-sm text-zinc-300 font-medium max-w-[120px] truncate">
                                  {userName}
                                </span>
                                <button
                                    onClick={onLogout}
                                    className="ml-1 p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                                    title="Log out"
                                    aria-label="Log out"
                                >
                                    <LogOutIcon className="h-4 w-4" />
                                </button>
                            </div>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Mobile Navigation */}
            <div className='sm:hidden bg-zinc-900 border-b border-zinc-800 flex'>
                <button
                    onClick={() => setActiveTab('issues')}
                    className={`flex-1 py-3 text-sm font-medium text-center border-b-2 transition-colors ${activeTab === 'issues' ? 'border-indigo-500 text-white' : 'border-transparent text-zinc-400 hover:text-zinc-200'}`}
                >
                    Issues
                </button>
                <button
                    onClick={() => setActiveTab('settings')}
                    className={`flex-1 py-3 text-sm font-medium text-center border-b-2 transition-colors ${activeTab === 'settings' ? 'border-indigo-500 text-white' : 'border-transparent text-zinc-400 hover:text-zinc-200'}`}
                >
                    Settings
                </button>
            </div>

            {/* Main Content */}
            <main className='flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8'>
                <motion.div
                    key={activeTab}
                    initial={{
                        opacity: 0,
                        y: 10,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        duration: 0.2,
                    }}
                    className='h-full'
                >
                    {activeTab === 'issues' ? <IssuesTable /> : <SettingsPanel />}
                </motion.div>
            </main>
        </div>
    );
}
