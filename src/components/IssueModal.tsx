import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon, SaveIcon } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppContext } from '../context/AppContext';
import { Issue, IssuePayload } from '../types';
import { MultiSelect } from './MultiSelect';

const issueFormSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    projectName: z.string().min(1, 'Project is required'),
    type: z.string(),
    priority: z.string(),
    reporter: z.string(),
    assignees: z.array(z.string()).optional(),
    status: z.string(),
});

type IssueFormData = z.infer<typeof issueFormSchema>;

interface IssueModalProps {
    isOpen: boolean;
    onClose: () => void;
    issueToEdit?: Issue | null;
}

export function IssueModal({ isOpen, onClose, issueToEdit }: IssueModalProps): React.JSX.Element {
    const { settings, addIssue, updateIssue, userName } = useAppContext();

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm<IssueFormData>({
        resolver: zodResolver(issueFormSchema),
        defaultValues: {
            assignees: [],
            description: '',
            priority: '',
            status: '',
            projectName: '',
            reporter: '',
            type: '',
            title: '',
        },
    });

    useEffect(() => {
        if (isOpen) {
            if (issueToEdit) {
                reset({
                    title: issueToEdit.title,
                    description: issueToEdit.description,
                    projectName: issueToEdit.projectName,
                    type: issueToEdit.type,
                    priority: issueToEdit.priority,
                    reporter: issueToEdit.reporter,
                    assignees: issueToEdit.assignees,
                    status: issueToEdit.status,
                });
            } else {
                const defaultPriority =
                    settings.priorities.find((p) => p.toLowerCase() === 'medium') || settings.priorities[0] || '';

                reset({
                    title: '',
                    description: '',
                    projectName: settings.projects[0] || '',
                    type: settings.issueTypes[0] || '',
                    priority: defaultPriority,
                    reporter: userName,
                    assignees: [],
                    status: settings.statuses[0] || '',
                });
            }
        }
    }, [isOpen, issueToEdit, settings, userName, reset]);

    const onSubmit = (data: IssueFormData): void => {
        const issueData: IssuePayload = {
            ...data,
            description: data.description ?? '',
            assignees: data.assignees ?? [],
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
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className='fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm'
                        onClick={onClose}
                    />

                    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6'>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
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
                                <form id='issue-form' onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
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
                                            {...register('title')}
                                            className={`w-full rounded-md border ${errors.title ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'} px-3 py-2 shadow-sm focus:outline-none focus:ring-2`}
                                            placeholder='Brief summary of the issue'
                                        />
                                        {errors.title && (
                                            <p className='mt-1 text-sm text-red-600'>{errors.title.message}</p>
                                        )}
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
                                            {...register('description')}
                                            className='w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                            placeholder='Detailed description...'
                                        />
                                    </div>

                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                                        <div>
                                            <label
                                                htmlFor='projectName'
                                                className='block text-sm font-medium text-slate-700 mb-1'
                                            >
                                                Project <span className='text-red-500'>*</span>
                                            </label>
                                            <select
                                                id='projectName'
                                                {...register('projectName')}
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
                                                <p className='mt-1 text-sm text-red-600'>
                                                    {errors.projectName.message}
                                                </p>
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
                                                {...register('type')}
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
                                                {...register('priority')}
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
                                                {...register('reporter')}
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
                                                {...register('status')}
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
                                        <Controller
                                            control={control}
                                            name='assignees'
                                            render={({ field }) => (
                                                <MultiSelect
                                                    options={settings.people}
                                                    selected={field.value || []}
                                                    onChange={field.onChange}
                                                    placeholder='Select assignees...'
                                                />
                                            )}
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
