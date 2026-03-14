import React, { useEffect, useState, useRef } from 'react';
import { ChevronDownIcon, XIcon } from 'lucide-react';

interface MultiSelectProps {
    options: string[];
    selected: string[];
    onChange: (selected: string[]) => void;
    placeholder?: string;
}

export function MultiSelect({
    options,
    selected,
    onChange,
    placeholder = 'Select...',
}: MultiSelectProps): React.JSX.Element {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, []);

    const toggleOption = (option: string) => {
        if (selected.includes(option)) {
            onChange(selected.filter((item) => item !== option));
        } else {
            onChange([...selected, option]);
        }
    };

    const removeOption = (e: React.MouseEvent, option: string) => {
        e.stopPropagation();
        onChange(selected.filter((item) => item !== option));
    };

    return (
        <div className='relative' ref={containerRef}>
            <div
                className='min-h-[42px] w-full border border-slate-300 rounded-md shadow-sm bg-white px-3 py-2 flex items-center justify-between cursor-pointer focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500'
                onClick={() => setIsOpen(!isOpen)}
                tabIndex={0}
            >
                <div className='flex flex-wrap gap-1 flex-1'>
                    {selected.length === 0 && <span className='text-slate-500'>{placeholder}</span>}
                    {selected.map((item) => (
                        <span
                            key={item}
                            className='inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-sm border border-slate-200'
                        >
                            {item}
                            <button
                                type='button'
                                onClick={(e) => removeOption(e, item)}
                                className='text-slate-400 hover:text-slate-600 focus:outline-none'
                            >
                                <XIcon className='h-3 w-3' />
                            </button>
                        </span>
                    ))}
                </div>
                <ChevronDownIcon className='h-4 w-4 text-slate-400 ml-2 flex-shrink-0' />
            </div>

            {isOpen && (
                <div className='absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm'>
                    {options.length === 0 ? (
                        <div className='px-3 py-2 text-slate-500'>No options available</div>
                    ) : (
                        options.map((option) => (
                            <div
                                key={option}
                                className='cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-slate-50 flex items-center'
                                onClick={() => toggleOption(option)}
                            >
                                <input
                                    type='checkbox'
                                    className='h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 mr-3 cursor-pointer'
                                    checked={selected.includes(option)}
                                    readOnly
                                />

                                <span
                                    className={`block truncate ${selected.includes(option) ? 'font-medium' : 'font-normal'}`}
                                >
                                    {option}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
