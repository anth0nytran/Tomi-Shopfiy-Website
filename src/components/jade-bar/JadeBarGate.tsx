'use client'

import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

const JadeBarBuilder = dynamic(() => import('./JadeBarBuilder'), { ssr: false })

const JADE_BAR_PASSWORD = (process.env.NEXT_PUBLIC_JADE_BAR_PASSWORD ?? 'tomijewelry!!jadebar').trim()
const STORAGE_KEY = 'tomi_jadebar_access_granted'

export function JadeBarGate() {
    const [unlocked, setUnlocked] = useState(false)
    const [mounted, setMounted] = useState(false)
    const [input, setInput] = useState('')
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        setMounted(true)
        try {
            if (localStorage.getItem(STORAGE_KEY) === '1') {
                setUnlocked(true)
            }
        } catch {
            // ignore
        }
    }, [])

    if (!mounted) {
        return <div className="min-h-[60vh]" />
    }

    if (unlocked) {
        return <JadeBarBuilder />
    }

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault()
        if (input.trim() === JADE_BAR_PASSWORD) {
            try {
                localStorage.setItem(STORAGE_KEY, '1')
            } catch {
                // ignore
            }
            setError(null)
            setUnlocked(true)
            return
        }
        setError('Incorrect password')
    }

    return (
        <div className="min-h-[70vh] flex items-center justify-center px-6 py-24 bg-[#F9F8F6]">
            <div className="w-full max-w-md text-center">
                <span className="block text-xs font-bold tracking-[0.25em] uppercase text-stone-400 mb-4">
                    Private Preview
                </span>
                <h1 className="font-heading text-4xl md:text-5xl text-stone-900 mb-4">
                    Jade Bar
                </h1>
                <p className="text-stone-600 font-light leading-relaxed mb-10">
                    This experience is currently locked. Enter the access password to continue.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <input
                        type="password"
                        value={input}
                        onChange={(e) => {
                            setInput(e.target.value)
                            if (error) setError(null)
                        }}
                        placeholder="Password"
                        autoComplete="current-password"
                        autoFocus
                        className="w-full px-4 py-3 bg-white border border-stone-300 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-900 transition-colors"
                    />
                    <button
                        type="submit"
                        className="w-full px-6 py-3 bg-stone-900 text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-stone-700 transition-colors"
                    >
                        Enter
                    </button>
                    {error && (
                        <p className="text-sm text-red-600 mt-1">{error}</p>
                    )}
                </form>
            </div>
        </div>
    )
}

export default JadeBarGate
