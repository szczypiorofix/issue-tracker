import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon, SaveIcon } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Issue } from '../types';
import { MultiSelect } from './MultiSelect';

interface IssueModalProps {
    isOpen: boolean;
    onClose: () => void;
    issueToEdit?: Issue | null;
}

export function IssueModal({ isOpen, onClose, issueToEdit }: IssueModalProps): React.JSX.Element {
    const { settings, addIssue, updateIssue, userName } = useAppContext();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [projectName, setProjectName] = useState('');
    const [type, setType] = useState('');
    const [priority, setPriority] = useState('');
    const [reporter, setReporter] = useState('');
    const [assignees, setAssignees] = useState<string[]>([]);
    const [status, setStatus] = useState('');
    const [errors, setErrors] = useState<{
        title?: string;
        projectName?: string;
    }>({});

    useEffect(() => {
        if (isOpen) {
            if (issueToEdit) {
                setTitle(issueToEdit.title);
                setDescription(issueToEdit.description);
                setProjectName(issueToEdit.projectName);
                setType(issueToEdit.type);
                setPriority(issueToEdit.priority);
                setReporter(issueToEdit.reporter);
                setAssignees(issueToEdit.assignees);
                setStatus(issueToEdit.status);
            } else {
                setTitle('');
                setDescription('');
                setProjectName(settings.projects[0] || '');
                setType(settings.issueTypes[0] || '');
                setPriority(settings.priorities[1] || settings.priorities[0] || ''); // Default to Medium if available
                setReporter(userName);
                setAssignees([]);
                setStatus(settings.statuses[0] || '');
            }
            setErrors({});
        }
    }, [isOpen, issueToEdit, settings, userName]);

    const validate: () => boolean = (): boolean => {
        const newErrors: {
            title?: string;
            projectName?: string;
        } = {};
        if (!title.trim()) newErrors.title = 'Title is required';
        if (!projectName) newErrors.projectName = 'Project is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent): void => {
        e.preventDefault();
        if (!validate()) return;
        const issueData = {
            title,
            description,
            projectName,
            type,
            priority,
            reporter,
            assignees,
            status,
        };
        if (issueToEdit) {
            updateIssue(issueToEdit.id, issueData);
        } else {
            addIssue(issueData);
        }
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{
                            opacity: 0,
                        }}
                        animate={{
                            opacity: 1,
                        }}
                        exit={{
                            opacity: 0,
                        }}
                        className='fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm'
                        onClick={onClose}
                    />

                    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6'>
                        <motion.div
                            initial={{
                                opacity: 0,
                                scale: 0.95,
                                y: 20,
                            }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                                y: 0,
                            }}
                            exit={{
                                opacity: 0,
                                scale: 0.95,
                                y: 20,
                            }}
                            transition={{
                                type: 'spring',
                                damping: 25,
                                stiffness: 300,
                            }}
                            className='bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]'
                        >
                            <div className='flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50'>
                                <h2 className='text-xl font-semibold text-slate-800'>
                                    {issueToEdit ? `Edit Issue: ${issueToEdit.id}` : 'Create New Issue'}
                                </h2>
                                <button
                                    onClick={onClose}
                                    className='text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md hover:bg-slate-200'
                                    aria-label='Close modal'
                                >
                                    <XIcon className='h-5 w-5' />
                                </button>
                            </div>

                            <div className='p-6 overflow-y-auto flex-1'>
                                <form id='issue-form' onSubmit={handleSubmit} className='space-y-5'>
                                    <div>
                                        <label
                                            htmlFor='title'
                                            className='block text-sm font-medium text-slate-700 mb-1'
                                        >
                                            Title <span className='text-red-500'>*</span>
                                        </label>
                                        <input
                                            type='text'
                                            id='title'
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            className={`w-full rounded-md border ${errors.title ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'} px-3 py-2 shadow-sm focus:outline-none focus:ring-2`}
                                            placeholder='Brief summary of the issue'
                                        />

                                        {errors.title && <p className='mt-1 text-sm text-red-600'>{errors.title}</p>}
                                    </div>

                                    <div>
                                        <label
                                            htmlFor='description'
                                            className='block text-sm font-medium text-slate-700 mb-1'
                                        >
                                            Description
                                        </label>
                                        <textarea
                                            id='description'
                                            rows={3}
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            className='w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                            placeholder='Detailed description...'
                                        />
                                    </div>

                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                                        <div>
                                            <label
                                                htmlFor='project'
                                                className='block text-sm font-medium text-slate-700 mb-1'
                                            >
                                                Project <span className='text-red-500'>*</span>
                                            </label>
                                            <select
                                                id='project'
                                                value={projectName}
                                                onChange={(e) => setProjectName(e.target.value)}
                                                className={`w-full rounded-md border ${errors.projectName ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'} px-3 py-2 shadow-sm focus:outline-none focus:ring-2 bg-white`}
                                            >
                                                <option value='' disabled>
                                                    Select a project
                                                </option>
                                                {settings.projects.map((p) => (
                                                    <option key={p} value={p}>
                                                        {p}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.projectName && (
                                                <p className='mt-1 text-sm text-red-600'>{errors.projectName}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label
                                                htmlFor='type'
                                                className='block text-sm font-medium text-slate-700 mb-1'
                                            >
                                                Type
                                            </label>
                                            <select
                                                id='type'
                                                value={type}
                                                onChange={(e) => setType(e.target.value)}
                                                className='w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white'
                                            >
                                                {settings.issueTypes.map((t) => (
                                                    <option key={t} value={t}>
                                                        {t}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label
                                                htmlFor='priority'
                                                className='block text-sm font-medium text-slate-700 mb-1'
                                            >
                                                Priority
                                            </label>
                                            <select
                                                id='priority'
                                                value={priority}
                                                onChange={(e) => setPriority(e.target.value)}
                                                className='w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white'
                                            >
                                                {settings.priorities.map((p) => (
                                                    <option key={p} value={p}>
                                                        {p}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label
                                                htmlFor='reporter'
                                                className='block text-sm font-medium text-slate-700 mb-1'
                                            >
                                                Reporter
                                            </label>
                                            <input
                                                type='text'
                                                id='reporter'
                                                value={reporter}
                                                disabled
                                                className='w-full rounded-md border border-slate-200 px-3 py-2 shadow-sm bg-zinc-50 text-zinc-500 cursor-not-allowed'
                                            />
                                        </div>

                                        <div>
                                            <label
                                                htmlFor='status'
                                                className='block text-sm font-medium text-slate-700 mb-1'
                                            >
                                                Status
                                            </label>
                                            <select
                                                id='status'
                                                value={status}
                                                onChange={(e) => setStatus(e.target.value)}
                                                className='w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white'
                                            >
                                                {settings.statuses.map((s) => (
                                                    <option key={s} value={s}>
                                                        {s}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className='block text-sm font-medium text-slate-700 mb-1'>
                                            Assignees
                                        </label>
                                        <MultiSelect
                                            options={settings.people}
                                            selected={assignees}
                                            onChange={setAssignees}
                                            placeholder='Select assignees...'
                                        />
                                    </div>
                                </form>
                            </div>

                            <div className='px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3'>
                                <button
                                    type='button'
                                    onClick={onClose}
                                    className='px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors'
                                >
                                    Cancel
                                </button>
                                <button
                                    type='submit'
                                    form='issue-form'
                                    className='inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors'
                                >
                                    <SaveIcon className='h-4 w-4 mr-2' />
                                    Save Issue
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
