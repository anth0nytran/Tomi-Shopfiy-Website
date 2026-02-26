'use client'

import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    type ScreenId,
    type Selections,
    type BuilderOption,
    type FilterDef,
    initialSelections,
    chains,
    chainFilters,
    bails,
    jades,
    jadeFilters,
    cordColors,
    getOptionById,
    formatPrice,
} from './builderData'

/* ─── Animation variants ─── */
const tileVariants = {
    initial: { opacity: 0, scale: 0.92 },
    animate: (i: number) => ({
        opacity: 1,
        scale: 1,
        transition: { delay: i * 0.04, duration: 0.35, ease: [0.22, 1, 0.36, 1] },
    }),
}

/* ─── Living Orb Building Animation ─── */
function BuildingAnimation({ pieceType, onComplete }: { pieceType: string; onComplete: () => void }) {
    const [step, setStep] = useState(0)
    const steps = pieceType === 'necklace'
        ? ['selecting your chain...', 'attaching the bail...', 'placing your jade...', 'almost there...']
        : ['measuring the cord...', 'threading the jade...', 'tying the knot...', 'almost there...']

    useEffect(() => {
        const timers: ReturnType<typeof setTimeout>[] = []
        steps.forEach((_, i) => {
            timers.push(setTimeout(() => setStep(i), i * 1000))
        })
        timers.push(setTimeout(onComplete, steps.length * 1000 + 600))
        return () => timers.forEach(clearTimeout)
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="flex flex-col items-center justify-center h-full min-h-[60vh]">
            {/* Living jade orb */}
            <div className="relative w-40 h-40 mb-10">
                {/* Outer glow ring */}
                <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{ background: 'radial-gradient(circle, rgba(123,174,127,0.3) 0%, transparent 70%)' }}
                    animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0.8, 0.4] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                />

                {/* Orbiting particle 1 */}
                <motion.div
                    className="absolute w-3 h-3 rounded-full bg-[#7BAE7F]/60 blur-[1px]"
                    style={{ top: '50%', left: '50%' }}
                    animate={{
                        x: [0, 60, 0, -60, 0],
                        y: [-60, 0, 60, 0, -60],
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                />

                {/* Orbiting particle 2 */}
                <motion.div
                    className="absolute w-2 h-2 rounded-full bg-[#8BB8A0]/50 blur-[1px]"
                    style={{ top: '50%', left: '50%' }}
                    animate={{
                        x: [40, 0, -40, 0, 40],
                        y: [0, -40, 0, 40, 0],
                    }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
                />

                {/* Orbiting particle 3 */}
                <motion.div
                    className="absolute w-2 h-2 rounded-full bg-[#E8BFC6]/60 blur-[1px]"
                    style={{ top: '50%', left: '50%' }}
                    animate={{
                        x: [-50, 30, 50, -30, -50],
                        y: [20, 50, -20, -50, 20],
                    }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                />

                {/* Main orb */}
                <motion.div
                    className="absolute inset-6 rounded-full shadow-2xl"
                    style={{
                        background: 'radial-gradient(circle at 35% 35%, #a8d4ac, #7BAE7F 40%, #5A9E5F 75%, #3d7a44)',
                    }}
                    animate={{
                        scale: [1, 1.08, 1, 1.05, 1],
                        rotate: [0, 180, 360],
                    }}
                    transition={{
                        scale: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
                        rotate: { duration: 8, repeat: Infinity, ease: 'linear' },
                    }}
                />

                {/* Inner shine */}
                <motion.div
                    className="absolute rounded-full"
                    style={{
                        top: '30%', left: '32%', width: '28%', height: '20%',
                        background: 'radial-gradient(ellipse, rgba(255,255,255,0.5) 0%, transparent 80%)',
                    }}
                    animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />

                {/* Breathing ring */}
                <motion.div
                    className="absolute inset-4 rounded-full border border-white/20"
                    animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
            </div>

            <h3 className="font-heading text-3xl text-stone-900 mb-5">building your piece</h3>

            <div className="h-8">
                <AnimatePresence mode="wait">
                    <motion.p
                        key={step}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-base text-stone-500 italic"
                    >
                        {steps[step]}
                    </motion.p>
                </AnimatePresence>
            </div>

            {/* Progress bar */}
            <div className="w-48 h-1.5 bg-stone-200 rounded-full mt-8 overflow-hidden">
                <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-[#7BAE7F] to-[#38473b]"
                    initial={{ width: '0%' }}
                    animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                />
            </div>
        </div>
    )
}

/* ─── Selection Summary ─── */
function SelectionSummary({ selections, pieceType }: { selections: Selections; pieceType: 'necklace' | 'bracelet' }) {
    const necklaceSlots = [
        { key: 'chain', label: 'chain', value: selections.chain, list: chains },
        { key: 'bail', label: 'bail', value: selections.bail, list: bails },
        { key: 'jade', label: 'jade', value: selections.jade, list: jades },
    ]
    const braceletSlots = [
        { key: 'cord', label: 'cord', value: selections.cordColor, list: cordColors },
        { key: 'jade', label: 'jade', value: selections.jade, list: jades },
    ]
    const slots = pieceType === 'necklace' ? necklaceSlots : braceletSlots

    return (
        <div className="w-full mb-8">
            <div className="flex justify-center mb-4">
                <div className="bg-[#38473b] text-white text-[10px] font-bold uppercase tracking-[0.28em] px-5 py-2 rounded-full">
                    Your Selection
                </div>
            </div>
            <div className="flex items-center justify-center gap-5">
                {pieceType === 'bracelet' && selections.wristLength && (
                    <div className="flex flex-col items-center gap-1.5">
                        <div className="w-16 h-16 rounded-2xl border border-[#38473b]/20 bg-white flex items-center justify-center shadow-sm">
                            <span className="text-sm font-medium text-[#38473b]">{selections.wristLength}&quot;</span>
                        </div>
                        <span className="text-[9px] uppercase tracking-[0.15em] text-stone-400 font-medium">wrist</span>
                    </div>
                )}
                {slots.map((slot) => {
                    const option = getOptionById(slot.list, slot.value)
                    return (
                        <div key={slot.key} className="flex flex-col items-center gap-1.5">
                            <div
                                className="w-16 h-16 rounded-2xl shadow-sm transition-all duration-300 flex items-center justify-center"
                                style={{ backgroundColor: option?.bgColor || '#e8e5e0', opacity: option ? 1 : 0.4 }}
                            >
                                {option && (
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-6 h-6 rounded-full bg-white/30" />
                                )}
                            </div>
                            <span className="text-[9px] uppercase tracking-[0.15em] text-stone-400 font-medium">{slot.label}</span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

/* ─── Selection Grid with 6-item pagination ─── */
function SelectionGrid({
    title,
    options,
    selectedId,
    onSelect,
    filters,
    activeFilters,
    onFilterChange,
}: {
    title: string
    options: BuilderOption[]
    selectedId: string | null
    onSelect: (id: string) => void
    filters?: FilterDef[]
    activeFilters?: Record<string, string>
    onFilterChange?: (filterId: string, value: string) => void
}) {
    const [showAll, setShowAll] = useState(false)
    const VISIBLE_COUNT = 6

    const filteredOptions = useMemo(() => {
        if (!activeFilters || !Object.keys(activeFilters).length) return options
        return options.filter((option) => {
            return Object.entries(activeFilters).every(([filterKey, filterValue]) => {
                if (!filterValue) return true
                return option.attributes?.[filterKey] === filterValue
            })
        })
    }, [options, activeFilters])

    const visibleOptions = showAll ? filteredOptions : filteredOptions.slice(0, VISIBLE_COUNT)
    const hasMore = filteredOptions.length > VISIBLE_COUNT

    return (
        <div className="w-full max-w-5xl mx-auto px-6">
            <h2 className="font-heading text-3xl md:text-4xl text-stone-900 text-center mb-8">{title}</h2>

            {/* Filters — large pill buttons */}
            {filters && filters.length > 0 && (
                <div className="flex flex-wrap justify-center gap-3 mb-10">
                    {filters.map((filter) => (
                        <div key={filter.id} className="flex items-center gap-2">
                            {filter.options.map((opt) => (
                                <button
                                    key={opt.id}
                                    onClick={() => onFilterChange?.(filter.id, activeFilters?.[filter.id] === opt.id ? '' : opt.id)}
                                    className={`px-6 py-3 rounded-full text-xs uppercase tracking-[0.18em] font-bold transition-all duration-300 border-2 ${activeFilters?.[filter.id] === opt.id
                                            ? 'bg-[#38473b] text-white border-[#38473b] shadow-lg scale-105'
                                            : 'bg-white text-stone-600 border-stone-200 hover:border-[#38473b]/40 hover:shadow-md'
                                        }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    ))}
                </div>
            )}

            {/* 3x2 Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5 w-full">
                {visibleOptions.map((option, i) => (
                    <motion.button
                        key={option.id}
                        custom={i}
                        variants={tileVariants}
                        initial="initial"
                        animate="animate"
                        onClick={() => onSelect(option.id)}
                        className={`relative group rounded-2xl overflow-hidden transition-all duration-300 ${selectedId === option.id
                                ? 'ring-3 ring-[#38473b] ring-offset-2 shadow-xl scale-[1.02]'
                                : 'shadow-md hover:shadow-xl hover:scale-[1.01]'
                            }`}
                    >
                        <div
                            className="aspect-[4/3] flex items-center justify-center relative"
                            style={{ backgroundColor: option.bgColor || '#7BAE7F' }}
                        >
                            <div className={`w-10 h-10 rounded-full transition-all ${selectedId === option.id ? 'bg-white/50' : 'bg-white/20 group-hover:bg-white/35'
                                }`} />
                            {selectedId === option.id && (
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-3 right-3 w-7 h-7 bg-[#38473b] rounded-full flex items-center justify-center shadow-md">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                </motion.div>
                            )}
                        </div>
                        <div className="bg-white px-4 py-3 text-left">
                            <span className="text-sm text-stone-800 font-medium block truncate">{option.label}</span>
                            {option.price !== undefined && <span className="text-xs text-stone-400">{formatPrice(option.price)}</span>}
                        </div>
                    </motion.button>
                ))}
            </div>

            {/* Show More / Show Less toggle */}
            {hasMore && (
                <div className="flex justify-center mt-8">
                    <button
                        onClick={() => setShowAll(!showAll)}
                        className="px-8 py-3 rounded-full text-xs uppercase tracking-[0.18em] font-bold border-2 border-stone-300 text-stone-500 bg-white hover:border-[#38473b]/40 hover:text-stone-700 hover:shadow-md transition-all duration-300"
                    >
                        {showAll ? 'Show Less' : `Show More (${filteredOptions.length - VISIBLE_COUNT} more)`}
                    </button>
                </div>
            )}
        </div>
    )
}

/* ─── Nav Buttons ─── */
function NavBar({ onBack, onNext, nextEnabled, nextLabel = 'Next', showBack = true }: {
    onBack?: () => void; onNext?: () => void; nextEnabled?: boolean; nextLabel?: string; showBack?: boolean
}) {
    return (
        <div className="flex items-center justify-center gap-6 mt-10 pb-6">
            {showBack && onBack && (
                <button onClick={onBack} className="text-sm uppercase tracking-[0.18em] text-stone-400 hover:text-stone-800 font-medium transition-colors">
                    Back
                </button>
            )}
            {onNext && (
                <button
                    onClick={onNext}
                    disabled={!nextEnabled}
                    className="bg-[#38473b] text-white text-xs font-bold uppercase tracking-[0.2em] px-10 py-4 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0"
                >
                    {nextLabel}
                </button>
            )}
        </div>
    )
}

/* ═══════════════════════════════════════════
   MAIN BUILDER — full viewport, immersive
   ═══════════════════════════════════════════ */
export default function JadeBarBuilder() {
    const [screen, setScreen] = useState<ScreenId>('intro')
    const [selections, setSelections] = useState<Selections>(initialSelections)
    const [chainFilterState, setChainFilterState] = useState<Record<string, string>>({})
    const [jadeFilterState, setJadeFilterState] = useState<Record<string, string>>({})
    const [direction, setDirection] = useState(1)
    const [isBuilding, setIsBuilding] = useState(false)
    const [showReveal, setShowReveal] = useState(false)
    const [isAddingToCart, setIsAddingToCart] = useState(false)
    const [cartFeedback, setCartFeedback] = useState<string | null>(null)

    const containerRef = useRef<HTMLDivElement>(null)

    // Scroll to top of builder on mount
    useEffect(() => {
        if (containerRef.current) {
            setTimeout(() => {
                containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }, 100)
        }
    }, [])

    // Scroll to top on every screen change
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }, [screen])

    const navigate = useCallback((target: ScreenId, dir: number = 1) => {
        setDirection(dir)
        setScreen(target)
    }, [])

    const updateSelection = useCallback((key: keyof Selections, value: string | number | null) => {
        setSelections((prev) => ({ ...prev, [key]: value }))
    }, [])

    const resetFlow = useCallback(() => {
        setSelections(initialSelections)
        setChainFilterState({})
        setJadeFilterState({})
        setCartFeedback(null)
        setShowReveal(false)
        setIsBuilding(false)
        navigate('piece_type', -1)
    }, [navigate])

    const goToReview = useCallback((reviewScreen: ScreenId) => {
        setIsBuilding(true)
        setShowReveal(false)
        setDirection(1)
        setScreen(reviewScreen)
    }, [])

    const handleBuildComplete = useCallback(() => {
        setIsBuilding(false)
        setShowReveal(true)
    }, [])

    const handleAddToCart = useCallback(async () => {
        setIsAddingToCart(true)
        setCartFeedback(null)
        await new Promise((r) => setTimeout(r, 1200))
        setCartFeedback('Added to your bag!')
        setIsAddingToCart(false)
    }, [])

    const totalPrice = useMemo(() => {
        let total = 0
        if (selections.pieceType === 'necklace') {
            const chain = getOptionById(chains, selections.chain)
            const bail = getOptionById(bails, selections.bail)
            const jade = getOptionById(jades, selections.jade)
            total = (chain?.price || 0) + (bail?.price || 0) + (jade?.price || 0)
        } else {
            const cord = getOptionById(cordColors, selections.cordColor)
            const jade = getOptionById(jades, selections.jade)
            total = (cord?.price || 0) + (jade?.price || 0)
        }
        return total
    }, [selections])

    const animVariants = {
        initial: { opacity: 0, x: direction > 0 ? 30 : -30 },
        animate: { opacity: 1, x: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
        exit: { opacity: 0, x: direction > 0 ? -30 : 30, transition: { duration: 0.2 } },
    }

    return (
        <div
            ref={containerRef}
            className="relative w-screen left-1/2 -translate-x-1/2 bg-[#F9F8F6] flex flex-col items-center justify-center -mt-10 py-16"
            style={{ minHeight: '100vh' }}
        >
            <AnimatePresence mode="wait">

                {/* ─── INTRO ─── */}
                {screen === 'intro' && (
                    <motion.div key="intro" variants={animVariants} initial="initial" animate="animate" exit="exit"
                        className="flex flex-col items-center justify-center text-center py-20"
                    >
                        <h1 className="font-heading text-3xl md:text-4xl text-stone-900 mb-2">let&apos;s create</h1>
                        <h1 className="font-heading text-3xl md:text-4xl text-stone-900 mb-10">your custom jade piece!</h1>
                        <button
                            onClick={() => navigate('piece_type')}
                            className="bg-[#38473b] text-white text-xs font-bold uppercase tracking-[0.2em] px-12 py-4 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                        >
                            Begin
                        </button>
                    </motion.div>
                )}

                {/* ─── PIECE TYPE ─── */}
                {screen === 'piece_type' && (
                    <motion.div key="piece_type" variants={animVariants} initial="initial" animate="animate" exit="exit"
                        className="flex flex-col items-center justify-center text-center py-16"
                    >
                        <h2 className="font-heading text-2xl md:text-3xl text-stone-900 mb-2">are you interested in building a</h2>
                        <h2 className="font-heading text-2xl md:text-3xl text-stone-900 mb-10">jade necklace or bracelet?</h2>
                        <div className="flex flex-col gap-4 items-center">
                            <div className="relative">
                                <button
                                    onClick={() => { updateSelection('pieceType', 'necklace'); navigate('necklace_chain') }}
                                    className="bg-[#38473b] text-white text-xs font-bold uppercase tracking-[0.2em] px-12 py-4 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 w-56"
                                >
                                    Necklace
                                </button>
                                <div className="absolute -top-1 -right-6 w-12 h-12 flex items-center justify-center">
                                    <div className="relative">
                                        <svg width="42" height="38" viewBox="0 0 48 44" fill="#E8BFC6">
                                            <path d="M24 44l-3.2-2.9C8.3 29.7 0 22.2 0 13.1 0 5.9 5.5 0 12.3 0c3.8 0 7.5 1.8 9.7 4.6C24.2 1.8 27.9 0 31.7 0 38.5 0 44 5.9 44 13.1c0 9.1-8.3 16.6-20.8 28L24 44z" transform="translate(2)" />
                                        </svg>
                                        <span className="absolute inset-0 flex items-center justify-center text-[7px] font-bold uppercase tracking-wider text-[#38473b] pt-0.5">
                                            most<br />popular
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => { updateSelection('pieceType', 'bracelet'); navigate('bracelet_wrist') }}
                                className="bg-[#38473b] text-white text-xs font-bold uppercase tracking-[0.2em] px-12 py-4 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 w-56"
                            >
                                Bracelet
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* ─── NECKLACE: CHAIN ─── */}
                {screen === 'necklace_chain' && (
                    <motion.div key="necklace_chain" variants={animVariants} initial="initial" animate="animate" exit="exit"
                        className="w-full flex flex-col items-center pt-4"
                    >
                        <SelectionSummary selections={selections} pieceType="necklace" />
                        <SelectionGrid title="pick your desired chain" options={chains} selectedId={selections.chain}
                            onSelect={(id) => updateSelection('chain', id)} filters={chainFilters} activeFilters={chainFilterState}
                            onFilterChange={(fid, val) => setChainFilterState((p) => ({ ...p, [fid]: val }))} />
                        <NavBar onBack={() => navigate('piece_type', -1)} onNext={() => navigate('necklace_bail')} nextEnabled={!!selections.chain} />
                    </motion.div>
                )}

                {/* ─── NECKLACE: BAIL ─── */}
                {screen === 'necklace_bail' && (
                    <motion.div key="necklace_bail" variants={animVariants} initial="initial" animate="animate" exit="exit"
                        className="w-full flex flex-col items-center pt-4"
                    >
                        <SelectionSummary selections={selections} pieceType="necklace" />
                        <SelectionGrid title="pick a bail option" options={bails} selectedId={selections.bail}
                            onSelect={(id) => updateSelection('bail', id)} />
                        <NavBar onBack={() => navigate('necklace_chain', -1)} onNext={() => navigate('necklace_jade')} nextEnabled={!!selections.bail} />
                    </motion.div>
                )}

                {/* ─── NECKLACE: JADE ─── */}
                {screen === 'necklace_jade' && (
                    <motion.div key="necklace_jade" variants={animVariants} initial="initial" animate="animate" exit="exit"
                        className="w-full flex flex-col items-center pt-4"
                    >
                        <SelectionSummary selections={selections} pieceType="necklace" />
                        <SelectionGrid title="pick a jade" options={jades} selectedId={selections.jade}
                            onSelect={(id) => updateSelection('jade', id)} filters={jadeFilters} activeFilters={jadeFilterState}
                            onFilterChange={(fid, val) => setJadeFilterState((p) => ({ ...p, [fid]: val }))} />
                        <NavBar onBack={() => navigate('necklace_bail', -1)} onNext={() => goToReview('necklace_review')} nextEnabled={!!selections.jade} />
                    </motion.div>
                )}

                {/* ─── NECKLACE: REVIEW ─── */}
                {screen === 'necklace_review' && (
                    <motion.div key="necklace_review" variants={animVariants} initial="initial" animate="animate" exit="exit"
                        className="w-full max-w-2xl mx-auto flex flex-col items-center pt-4"
                    >
                        {isBuilding ? (
                            <BuildingAnimation pieceType="necklace" onComplete={handleBuildComplete} />
                        ) : showReveal ? (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} className="text-center w-full py-8"
                            >
                                <h3 className="font-heading text-4xl text-stone-900 mb-6">ta-da!</h3>
                                <div className="w-56 h-56 mx-auto rounded-3xl shadow-xl flex items-center justify-center mb-8"
                                    style={{ backgroundColor: getOptionById(jades, selections.jade)?.bgColor || '#7BAE7F' }}>
                                    <div className="w-16 h-16 rounded-full bg-white/40" />
                                </div>
                                <SelectionSummary selections={selections} pieceType="necklace" />
                                <div className="mb-6">
                                    <div className="text-xs text-stone-400 uppercase tracking-[0.15em] mb-1">Estimated Total</div>
                                    <div className="text-3xl font-heading text-[#38473b]">{formatPrice(totalPrice)}</div>
                                </div>
                                <div className="flex flex-col items-center gap-3">
                                    <button onClick={handleAddToCart} disabled={isAddingToCart}
                                        className="bg-[#38473b] text-white text-xs font-bold uppercase tracking-[0.2em] px-12 py-4 rounded-full shadow-lg hover:shadow-xl transition-all disabled:opacity-50 w-56">
                                        {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                                    </button>
                                    {cartFeedback && (
                                        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-[#38473b] font-medium">{cartFeedback}</motion.span>
                                    )}
                                    <button onClick={resetFlow} className="text-sm uppercase tracking-[0.15em] text-stone-400 hover:text-stone-700 transition-colors mt-2">
                                        Start Over
                                    </button>
                                </div>
                                <NavBar onBack={() => { setShowReveal(false); navigate('necklace_jade', -1) }} showBack={true} />
                            </motion.div>
                        ) : null}
                    </motion.div>
                )}

                {/* ─── BRACELET: WRIST ─── */}
                {screen === 'bracelet_wrist' && (
                    <motion.div key="bracelet_wrist" variants={animVariants} initial="initial" animate="animate" exit="exit"
                        className="flex flex-col items-center justify-center text-center py-16"
                    >
                        <h2 className="font-heading text-2xl md:text-3xl text-stone-900 mb-2">measure your wrist and</h2>
                        <h2 className="font-heading text-2xl md:text-3xl text-stone-900 mb-8">provide us the length in <span className="underline">inches</span></h2>
                        <div className="relative mb-4">
                            <input type="number" step="0.1" min="0" max="20" placeholder="e.g., 6.5"
                                value={selections.wristLength ?? ''}
                                onChange={(e) => updateSelection('wristLength', e.target.value ? parseFloat(e.target.value) : null)}
                                className="w-48 text-center py-3.5 px-6 border-2 border-stone-300 rounded-full text-lg font-medium text-stone-900 bg-white focus:outline-none focus:border-[#38473b] transition-colors placeholder:text-stone-300"
                            />
                            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-sm text-stone-400">in</span>
                        </div>
                        <NavBar onBack={() => navigate('piece_type', -1)}
                            onNext={() => navigate('bracelet_cord')}
                            nextEnabled={!!selections.wristLength && selections.wristLength > 0 && selections.wristLength <= 20} />
                    </motion.div>
                )}

                {/* ─── BRACELET: CORD ─── */}
                {screen === 'bracelet_cord' && (
                    <motion.div key="bracelet_cord" variants={animVariants} initial="initial" animate="animate" exit="exit"
                        className="w-full flex flex-col items-center pt-4"
                    >
                        <SelectionSummary selections={selections} pieceType="bracelet" />
                        <SelectionGrid title="pick your satin cord color" options={cordColors} selectedId={selections.cordColor}
                            onSelect={(id) => updateSelection('cordColor', id)} />
                        <NavBar onBack={() => navigate('bracelet_wrist', -1)} onNext={() => navigate('bracelet_jade')} nextEnabled={!!selections.cordColor} />
                    </motion.div>
                )}

                {/* ─── BRACELET: JADE ─── */}
                {screen === 'bracelet_jade' && (
                    <motion.div key="bracelet_jade" variants={animVariants} initial="initial" animate="animate" exit="exit"
                        className="w-full flex flex-col items-center pt-4"
                    >
                        <SelectionSummary selections={selections} pieceType="bracelet" />
                        <SelectionGrid title="pick a jade" options={jades} selectedId={selections.jade}
                            onSelect={(id) => updateSelection('jade', id)} filters={jadeFilters} activeFilters={jadeFilterState}
                            onFilterChange={(fid, val) => setJadeFilterState((p) => ({ ...p, [fid]: val }))} />
                        <NavBar onBack={() => navigate('bracelet_cord', -1)} onNext={() => goToReview('bracelet_review')} nextEnabled={!!selections.jade} />
                    </motion.div>
                )}

                {/* ─── BRACELET: REVIEW ─── */}
                {screen === 'bracelet_review' && (
                    <motion.div key="bracelet_review" variants={animVariants} initial="initial" animate="animate" exit="exit"
                        className="w-full max-w-2xl mx-auto flex flex-col items-center pt-4"
                    >
                        {isBuilding ? (
                            <BuildingAnimation pieceType="bracelet" onComplete={handleBuildComplete} />
                        ) : showReveal ? (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} className="text-center w-full py-8"
                            >
                                <h3 className="font-heading text-4xl text-stone-900 mb-6">ta-da!</h3>
                                <div className="w-56 h-56 mx-auto rounded-3xl shadow-xl flex items-center justify-center mb-8"
                                    style={{ backgroundColor: getOptionById(jades, selections.jade)?.bgColor || '#7BAE7F' }}>
                                    <div className="w-16 h-16 rounded-full bg-white/40" />
                                </div>
                                <SelectionSummary selections={selections} pieceType="bracelet" />
                                <div className="mb-6">
                                    <div className="text-xs text-stone-400 uppercase tracking-[0.15em] mb-1">Estimated Total</div>
                                    <div className="text-3xl font-heading text-[#38473b]">{formatPrice(totalPrice)}</div>
                                </div>
                                <div className="flex flex-col items-center gap-3">
                                    <button onClick={handleAddToCart} disabled={isAddingToCart}
                                        className="bg-[#38473b] text-white text-xs font-bold uppercase tracking-[0.2em] px-12 py-4 rounded-full shadow-lg hover:shadow-xl transition-all disabled:opacity-50 w-56">
                                        {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                                    </button>
                                    {cartFeedback && (
                                        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-[#38473b] font-medium">{cartFeedback}</motion.span>
                                    )}
                                    <button onClick={resetFlow} className="text-sm uppercase tracking-[0.15em] text-stone-400 hover:text-stone-700 transition-colors mt-2">
                                        Start Over
                                    </button>
                                </div>
                                <NavBar onBack={() => { setShowReveal(false); navigate('bracelet_jade', -1) }} showBack={true} />
                            </motion.div>
                        ) : null}
                    </motion.div>
                )}

            </AnimatePresence>
        </div>
    )
}
