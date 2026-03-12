import React from 'react';

interface ColorType {
    bg: string;
    dot: string;
}

export function StatusBadge({ status }: { status: string }): React.JSX.Element {
    const getStatusColor = (statusName: string) => {
        const s = statusName.toLowerCase();
        if (s.includes('new')) return 'bg-zinc-100 text-zinc-700 border-zinc-200';
        if (s.includes('development')) return 'bg-indigo-50 text-indigo-700 border-indigo-200';
        if (s.includes('ready')) return 'bg-amber-50 text-amber-700 border-amber-200';
        if (s.includes('tests')) return 'bg-violet-50 text-violet-700 border-violet-200';
        if (s.includes('fix')) return 'bg-red-50 text-red-700 border-red-200';
        if (s.includes('done')) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
        return 'bg-zinc-100 text-zinc-700 border-zinc-200';
    };
    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(status)}`}
        >
            {status}
        </span>
    );
}
export function TypeBadge({ type }: { type: string }): React.JSX.Element {
    const getTypeColor = (typeName: string): ColorType => {
        const t = typeName.toLowerCase();
        if (t.includes('bug'))
            return {
                bg: 'bg-red-50 text-red-700 border-red-200',
                dot: 'text-red-500',
            };
        if (t.includes('new feature'))
            return {
                bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                dot: 'text-emerald-500',
            };
        if (t.includes('feature development'))
            return {
                bg: 'bg-sky-50 text-sky-700 border-sky-200',
                dot: 'text-sky-500',
            };
        return {
            bg: 'bg-zinc-100 text-zinc-700 border-zinc-200',
            dot: 'text-zinc-400',
        };
    };

    const colors: ColorType = getTypeColor(type);

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors.bg}`}>
            <span className={`mr-1.5 text-[10px] ${colors.dot}`}>●</span>
            {type}
        </span>
    );
}

export function PriorityBadge({ priority }: { priority: string }): React.JSX.Element {
    const getPriorityColor = (priorityName: string): ColorType => {
        const p = priorityName.toLowerCase();
        if (p.includes('low'))
            return {
                bg: 'bg-zinc-100 text-zinc-600 border-zinc-200',
                dot: 'bg-zinc-400',
            };
        if (p.includes('medium'))
            return {
                bg: 'bg-amber-50 text-amber-700 border-amber-200',
                dot: 'bg-amber-500',
            };
        if (p.includes('high'))
            return {
                bg: 'bg-rose-50 text-rose-700 border-rose-200 font-semibold',
                dot: 'bg-rose-500',
            };
        return {
            bg: 'bg-zinc-100 text-zinc-600 border-zinc-200',
            dot: 'bg-zinc-400',
        };
    };

    const colors: ColorType = getPriorityColor(priority);

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors.bg}`}>
            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${colors.dot}`}></span>
            {priority}
        </span>
    );
}
