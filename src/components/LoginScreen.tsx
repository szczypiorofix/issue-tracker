import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BugIcon, ArrowRightIcon } from 'lucide-react';

interface LoginScreenProps {
    onLogin: (name: string) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps): React.JSX.Element {
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedName = name.trim();
        if (!trimmedName) {
            setError('Please enter your name');
            return;
        }
        onLogin(trimmedName);
    };

    return (
        <div className='min-h-screen bg-zinc-900 flex items-center justify-center p-4 font-sans'>
            <motion.div
                initial={{
                    opacity: 0,
                    y: 20,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                }}
                transition={{
                    duration: 0.4,
                    ease: 'easeOut',
                }}
                className='w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden'
            >
                <div className='p-8 sm:p-10'>
                    <div className='flex flex-col items-center text-center mb-8'>
                        <div className='bg-gradient-to-br from-indigo-500 to-violet-600 p-3 rounded-xl shadow-inner mb-4'>
                            <BugIcon className='h-8 w-8 text-white' />
                        </div>
                        <h1 className='text-2xl font-bold text-zinc-900 tracking-tight'>Issue Tracker</h1>
                        <p className='text-zinc-500 mt-2 text-sm'>Sign in to continue to your workspace</p>
                    </div>

                    <form onSubmit={handleSubmit} className='space-y-6'>
                        <div>
                            <label htmlFor='name' className='block text-sm font-medium text-zinc-700 mb-1.5'>
                                Your Name
                            </label>
                            <input
                                type='text'
                                id='name'
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    if (error) setError('');
                                }}
                                className={`w-full px-4 py-2.5 rounded-lg border ${error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-zinc-200 focus:ring-indigo-500 focus:border-indigo-500'} bg-zinc-50 focus:bg-white transition-colors outline-none focus:ring-2`}
                                placeholder='e.g. Jane Doe'
                                autoFocus
                            />

                            {error && (
                                <motion.p
                                    initial={{
                                        opacity: 0,
                                        height: 0,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        height: 'auto',
                                    }}
                                    className='mt-2 text-sm text-red-600'
                                >
                                    {error}
                                </motion.p>
                            )}
                        </div>

                        <button
                            type='submit'
                            className='w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                        >
                            Continue
                            <ArrowRightIcon className='h-4 w-4' />
                        </button>
                    </form>
                </div>
                <div className='bg-zinc-50 px-8 py-4 border-t border-zinc-100 text-center'>
                    <p className='text-xs text-zinc-400'>
                        Your name will be used to identify your actions in the tracker.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
