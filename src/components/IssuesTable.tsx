import React, { useMemo, useState } from 'react';
import { PlusIcon, FilterIcon, SearchIcon, EditIcon } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { StatusBadge, TypeBadge, PriorityBadge } from './StatusBadge';
import { IssueModal } from './IssueModal';
import { Issue } from '../types';

export function IssuesTable(): React.JSX.Element {
    const { issues, settings } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingIssue, setEditingIssue] = useState<Issue | null>(null);
    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [projectFilter, setProjectFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [assigneeFilter, setAssigneeFilter] = useState('');

    const handleEdit = (issue: Issue): void => {
        setEditingIssue(issue);
        setIsModalOpen(true);
    };

    const handleNew = (): void => {
        setEditingIssue(null);
        setIsModalOpen(true);
    };

    const filteredIssues: Issue[] = useMemo((): Issue[] => {
        return issues
            .filter((issue): boolean => {
                const matchesSearch =
                    issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    issue.id.toLowerCase().includes(searchQuery.toLowerCase());
                const matchesProject = projectFilter ? issue.projectName === projectFilter : true;
                const matchesType = typeFilter ? issue.type === typeFilter : true;
                const matchesPriority = priorityFilter ? issue.priority === priorityFilter : true;
                const matchesStatus = statusFilter ? issue.status === statusFilter : true;
                const matchesAssignee = assigneeFilter ? issue.assignees.includes(assigneeFilter) : true;
                return (
                    matchesSearch &&
                    matchesProject &&
                    matchesType &&
                    matchesPriority &&
                    matchesStatus &&
                    matchesAssignee
                );
            })
            .sort((a, b) => new Date(b.statusUpdatedAt).getTime() - new Date(a.statusUpdatedAt).getTime());
    }, [issues, searchQuery, projectFilter, typeFilter, priorityFilter, statusFilter, assigneeFilter]);

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    };

    const getAvatarColor = (name: string): string => {
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        const colors: string[] = [
            'bg-red-100 text-red-700 ring-red-200',
            'bg-orange-100 text-orange-700 ring-orange-200',
            'bg-amber-100 text-amber-700 ring-amber-200',
            'bg-emerald-100 text-emerald-700 ring-emerald-200',
            'bg-cyan-100 text-cyan-700 ring-cyan-200',
            'bg-blue-100 text-blue-700 ring-blue-200',
            'bg-indigo-100 text-indigo-700 ring-indigo-200',
            'bg-violet-100 text-violet-700 ring-violet-200',
            'bg-fuchsia-100 text-fuchsia-700 ring-fuchsia-200',
            'bg-rose-100 text-rose-700 ring-rose-200',
        ];

        return colors[Math.abs(hash) % colors.length];
    };

    return (
        <div className='flex flex-col h-full bg-white rounded-xl shadow-sm border border-zinc-200/80 overflow-hidden'>
            {/* Header & Filters */}
            <div className='p-4 sm:p-6 border-b border-zinc-200 bg-zinc-50'>
                <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6'>
                    <h2 className='text-lg font-semibold text-zinc-800 flex items-center gap-2'>
                        All Issues
                        <span className='bg-indigo-100 text-indigo-700 py-0.5 px-2.5 rounded-full text-xs font-medium'>
                            {filteredIssues.length}
                        </span>
                    </h2>
                    <button
                        onClick={handleNew}
                        className='inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors'
                    >
                        <PlusIcon className='h-4 w-4 mr-2' />
                        New Issue
                    </button>
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4'>
                    <div className='relative'>
                        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                            <SearchIcon className='h-4 w-4 text-zinc-400' />
                        </div>
                        <input
                            type='text'
                            placeholder='Search issues...'
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className='block w-full pl-10 pr-3 py-2 border border-zinc-200 rounded-md leading-5 bg-white placeholder-zinc-400 focus:outline-none focus:placeholder-zinc-300 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors'
                        />
                    </div>

                    <div className='relative'>
                        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                            <FilterIcon className='h-4 w-4 text-zinc-400' />
                        </div>
                        <select
                            value={projectFilter}
                            onChange={(e) => setProjectFilter(e.target.value)}
                            className='block w-full pl-10 pr-3 py-2 border border-zinc-200 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm appearance-none transition-colors'
                        >
                            <option value=''>All Projects</option>
                            {settings.projects.map((p) => (
                                <option key={p} value={p}>
                                    {p}
                                </option>
                            ))}
                        </select>
                    </div>

                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className='block w-full px-3 py-2 border border-zinc-200 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors'
                    >
                        <option value=''>All Types</option>
                        {settings.issueTypes.map((t) => (
                            <option key={t} value={t}>
                                {t}
                            </option>
                        ))}
                    </select>

                    <select
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                        className='block w-full px-3 py-2 border border-zinc-200 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors'
                    >
                        <option value=''>All Priorities</option>
                        {settings.priorities.map((p) => (
                            <option key={p} value={p}>
                                {p}
                            </option>
                        ))}
                    </select>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className='block w-full px-3 py-2 border border-zinc-200 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors'
                    >
                        <option value=''>All Statuses</option>
                        {settings.statuses.map((s) => (
                            <option key={s} value={s}>
                                {s}
                            </option>
                        ))}
                    </select>

                    <select
                        value={assigneeFilter}
                        onChange={(e) => setAssigneeFilter(e.target.value)}
                        className='block w-full px-3 py-2 border border-zinc-200 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors'
                    >
                        <option value=''>All Assignees</option>
                        {settings.people.map((p) => (
                            <option key={p} value={p}>
                                {p}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className='flex-1 overflow-x-auto'>
                {filteredIssues.length > 0 ? (
                    <table className='min-w-full divide-y divide-zinc-200'>
                        <thead className='bg-zinc-50/80'>
                            <tr>
                                <th
                                    scope='col'
                                    className='px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider'
                                >
                                    ID
                                </th>
                                <th
                                    scope='col'
                                    className='px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider'
                                >
                                    Title
                                </th>
                                <th
                                    scope='col'
                                    className='px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider'
                                >
                                    Project
                                </th>
                                <th
                                    scope='col'
                                    className='px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider'
                                >
                                    Type
                                </th>
                                <th
                                    scope='col'
                                    className='px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider'
                                >
                                    Priority
                                </th>
                                <th
                                    scope='col'
                                    className='px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider'
                                >
                                    Status
                                </th>
                                <th
                                    scope='col'
                                    className='px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider'
                                >
                                    Assignees
                                </th>
                                <th
                                    scope='col'
                                    className='px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider'
                                >
                                    Updated
                                </th>
                                <th scope='col' className='relative px-6 py-3'>
                                    <span className='sr-only'>Edit</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className='bg-white divide-y divide-zinc-100'>
                            {filteredIssues.map((issue) => (
                                <tr
                                    key={issue.id}
                                    onClick={() => handleEdit(issue)}
                                    className='hover:bg-indigo-50/40 cursor-pointer transition-colors group border-l-2 border-transparent hover:border-indigo-500'
                                >
                                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-zinc-900'>
                                        {issue.id}
                                    </td>
                                    <td
                                        className='px-6 py-4 text-sm text-zinc-700 max-w-xs truncate font-medium'
                                        title={issue.title}
                                    >
                                        {issue.title}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-zinc-500'>
                                        {issue.projectName}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap'>
                                        <TypeBadge type={issue.type} />
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap'>
                                        <PriorityBadge priority={issue.priority} />
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap'>
                                        <StatusBadge status={issue.status} />
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-zinc-500'>
                                        <div className='flex -space-x-2 overflow-hidden'>
                                            {issue.assignees.length > 0 ? (
                                                issue.assignees.map((assignee, i) => (
                                                    <div
                                                        key={i}
                                                        className={`inline-block h-6 w-6 rounded-full ring-2 ring-white flex items-center justify-center text-xs font-medium ${getAvatarColor(assignee)}`}
                                                        title={assignee}
                                                    >
                                                        {assignee.charAt(0)}
                                                    </div>
                                                ))
                                            ) : (
                                                <span className='text-zinc-400 italic text-xs'>Unassigned</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-zinc-500'>
                                        {formatDate(issue.statusUpdatedAt)}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                                        <button
                                            className='text-zinc-400 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity'
                                            aria-label='Edit issue'
                                        >
                                            <EditIcon className='h-4 w-4' />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className='flex flex-col items-center justify-center h-64 text-center px-4'>
                        <div className='bg-zinc-100 p-3 rounded-full mb-4'>
                            <SearchIcon className='h-6 w-6 text-zinc-400' />
                        </div>
                        <h3 className='text-lg font-medium text-zinc-900 mb-1'>No issues found</h3>
                        <p className='text-zinc-500 max-w-sm mb-6'>
                            {issues.length === 0
                                ? 'Get started by creating your first issue to track bugs and features.'
                                : 'No issues match your current filters. Try adjusting them to see more results.'}
                        </p>
                        {issues.length === 0 && (
                            <button
                                onClick={handleNew}
                                className='inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-100 border border-transparent rounded-md hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors'
                            >
                                <PlusIcon className='h-4 w-4 mr-2' />
                                Create First Issue
                            </button>
                        )}
                    </div>
                )}
            </div>

            <IssueModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} issueToEdit={editingIssue} />
        </div>
    );
}
