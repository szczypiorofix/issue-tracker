import React, { useState } from 'react';
import { PlusIcon, TrashIcon, AlertCircleIcon } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { AppSettings } from '../types';

export function SettingsPanel(): React.JSX.Element {
    const { settings, updateSettings, issues } = useAppContext();

    const renderSection = (
        title: string,
        description: string,
        category: keyof AppSettings,
        items: string[],
        checkUsage: (item: string) => boolean,
    ): React.JSX.Element => {
        const [newItem, setNewItem] = useState('');
        const [error, setError] = useState('');
        const handleAdd = (e: React.FormEvent) => {
            e.preventDefault();
            const trimmed = newItem.trim();
            if (!trimmed) return;
            if (items.includes(trimmed)) {
                setError('Item already exists');
                return;
            }
            updateSettings(category, [...items, trimmed]);
            setNewItem('');
            setError('');
        };

        const handleRemove = (itemToRemove: string): void => {
            if (checkUsage(itemToRemove)) {
                if (
                    !window.confirm(
                        `Warning: "${itemToRemove}" is currently used in existing issues. Removing it might cause display issues. Are you sure?`,
                    )
                ) {
                    return;
                }
            }
            updateSettings(
                category,
                items.filter((item) => item !== itemToRemove),
            );
        };

        return (
            <div className='bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full'>
                <div className='p-5 border-b border-slate-100 bg-slate-50/50'>
                    <h3 className='text-lg font-medium text-slate-800'>{title}</h3>
                    <p className='text-sm text-slate-500 mt-1'>{description}</p>
                </div>

                <div className='p-5 flex-1 flex flex-col'>
                    <form onSubmit={handleAdd} className='mb-4'>
                        <div className='flex gap-2'>
                            <input
                                type='text'
                                value={newItem}
                                onChange={(e) => {
                                    setNewItem(e.target.value);
                                    setError('');
                                }}
                                placeholder={`Add new ${title.toLowerCase().slice(0, -1)}...`}
                                className={`flex-1 min-w-0 block w-full px-3 py-2 rounded-md border ${error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'} sm:text-sm`}
                            />

                            <button
                                type='submit'
                                disabled={!newItem.trim()}
                                className='inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-slate-800 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                            >
                                <PlusIcon className='h-4 w-4' />
                            </button>
                        </div>
                        {error && (
                            <p className='mt-1 text-xs text-red-600 flex items-center'>
                                <AlertCircleIcon className='h-3 w-3 mr-1' />
                                {error}
                            </p>
                        )}
                    </form>

                    <div className='flex-1 overflow-y-auto min-h-[200px] border border-slate-100 rounded-md bg-slate-50/30'>
                        {items.length === 0 ? (
                            <div className='flex items-center justify-center h-full text-sm text-slate-400 italic'>
                                No items configured
                            </div>
                        ) : (
                            <ul className='divide-y divide-slate-100'>
                                {items.map((item) => {
                                    const isUsed = checkUsage(item);
                                    return (
                                        <li
                                            key={item}
                                            className='flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors group'
                                        >
                                            <span className='text-sm font-medium text-slate-700'>{item}</span>
                                            <div className='flex items-center gap-3'>
                                                {isUsed && (
                                                    <span className='text-[10px] uppercase tracking-wider font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full'>
                                                        In Use
                                                    </span>
                                                )}
                                                <button
                                                    onClick={() => handleRemove(item)}
                                                    className='text-slate-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all focus:opacity-100 p-1 rounded hover:bg-red-50'
                                                    aria-label={`Remove ${item}`}
                                                >
                                                    <TrashIcon className='h-4 w-4' />
                                                </button>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className='max-w-7xl mx-auto'>
            <div className='mb-8'>
                <h2 className='text-2xl font-bold text-slate-900'>System Configuration</h2>
                <p className='text-slate-500 mt-1'>Manage the dropdown values available throughout the application.</p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8'>
                {renderSection(
                    'Projects',
                    'Manage the list of projects available for issues.',
                    'projects',
                    settings.projects,
                    (item) => issues.some((i) => i.projectName === item),
                )}

                {renderSection(
                    'Team Members',
                    'People who can report or be assigned to issues.',
                    'people',
                    settings.people,
                    (item) => issues.some((i) => i.reporter === item || i.assignees.includes(item)),
                )}

                {renderSection(
                    'Issue Types',
                    'Categorize issues (e.g., Bug, Feature).',
                    'issueTypes',
                    settings.issueTypes,
                    (item) => issues.some((i) => i.type === item),
                )}

                {renderSection(
                    'Priorities',
                    'Define priority levels for issues.',
                    'priorities',
                    settings.priorities,
                    (item) => issues.some((i) => i.priority === item),
                )}

                {renderSection(
                    'Statuses',
                    'Workflow stages for tracking progress.',
                    'statuses',
                    settings.statuses,
                    (item) => issues.some((i) => i.status === item),
                )}
            </div>
        </div>
    );
}
