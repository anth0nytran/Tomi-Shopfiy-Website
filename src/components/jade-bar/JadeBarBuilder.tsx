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
    getCustomPieceImage,
} from './builderData'
import Image from 'next/image'

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
        : pieceType === 'charm'
        ? ['preparing the bail...', 'attaching your jade...', 'getting it ready...', 'almost there...']
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
        <div className="flex flex-col items-center justify-center w-full">
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
                    className="absolute w-3 h-3 rounded-full bg-[#f4f3f1]/60 blur-[1px]"
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
                        background: 'radial-gradient(circle at 35% 35%, #a8d4ac, #f4f3f1 40%, #5A9E5F 75%, #3d7a44)',
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
                    className="h-full rounded-full bg-gradient-to-r from-[#f4f3f1] to-[#38473b]"
                    initial={{ width: '0%' }}
                    animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                />
            </div>
        </div>
    )
}

/* ─── Selection Summary ─── */
function SelectionSummary({ selections, pieceType }: { selections: Selections; pieceType: 'necklace' | 'bracelet' | 'charm' }) {
    const necklaceSlots = [
        { key: 'chain', label: 'chain', value: selections.chain, list: chains },
        { key: 'bail', label: 'bail', value: selections.bail, list: bails },
        { key: 'jade', label: 'jade', value: selections.jade, list: jades },
    ]
    const braceletSlots = [
        { key: 'cord', label: 'cord', value: selections.cordColor, list: cordColors },
        { key: 'jade', label: 'jade', value: selections.jade, list: jades },
    ]
    const charmSlots = [
        { key: 'bail', label: 'bail', value: selections.bail, list: bails },
        { key: 'jade', label: 'jade', value: selections.jade, list: jades },
    ]
    const slots = pieceType === 'necklace' ? necklaceSlots : pieceType === 'charm' ? charmSlots : braceletSlots

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
                                className="w-16 h-16 rounded-2xl shadow-sm transition-all duration-300 flex items-center justify-center relative overflow-hidden"
                                style={{ backgroundColor: option?.bgColor || '#e8e5e0', opacity: option ? 1 : 0.4 }}
                            >
                                {option?.image ? (
                                    <Image src={option.image} alt={option.label || slot.label} fill className="object-cover p-1 hover:scale-110 transition-transform duration-300 drop-shadow-sm" />
                                ) : option && (
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
    const [currentPage, setCurrentPage] = useState(0)
    const [direction, setDirection] = useState(1) // 1 for next, -1 for prev
    const [zoomedImage, setZoomedImage] = useState<{ src: string, label: string } | null>(null)
    const ITEMS_PER_PAGE = 4

    const filteredOptions = useMemo(() => {
        if (!activeFilters || !Object.keys(activeFilters).length) return options
        return options.filter((option) => {
            return Object.entries(activeFilters).every(([filterKey, filterValue]) => {
                if (!filterValue) return true
                return option.attributes?.[filterKey] === filterValue
            })
        })
    }, [options, activeFilters])

    // Reset page if filters change
    useEffect(() => {
        setCurrentPage(0)
    }, [filteredOptions.length])

    const totalPages = Math.ceil(filteredOptions.length / ITEMS_PER_PAGE)
    const currentOptions = filteredOptions.slice(
        currentPage * ITEMS_PER_PAGE,
        (currentPage + 1) * ITEMS_PER_PAGE
    )

    const handleNext = () => {
        if (currentPage < totalPages - 1) {
            setDirection(1)
            setCurrentPage((prev) => prev + 1)
        }
    }

    const handlePrev = () => {
        if (currentPage > 0) {
            setDirection(-1)
            setCurrentPage((prev) => prev - 1)
        }
    }

    const slideVariants = {
        enter: (dir: number) => ({
            x: dir > 0 ? 400 : -400,
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
            transition: { duration: 0.5, ease: [0.32, 0.72, 0, 1] }
        },
        exit: (dir: number) => ({
            x: dir < 0 ? 400 : -400,
            opacity: 0,
            transition: { duration: 0.4, ease: [0.32, 0.72, 0, 1] }
        }),
    }

    return (
        <div className="w-full h-full flex flex-col justify-start pb-4 overflow-x-hidden">
            <h2 className="font-heading text-3xl md:text-3xl text-stone-900 text-center mb-6">{title}</h2>

            {/* Elegant Premium Filters */}
            {filters && filters.length > 0 && (
                <div className="flex flex-wrap justify-center gap-4 mb-8 relative z-20">
                    {filters.map((filter) => (
                        <div key={filter.id} className="inline-flex bg-stone-100/60 backdrop-blur-md rounded-full p-1 shadow-inner border border-stone-200/50">
                            {filter.options.map((opt) => {
                                const isActive = activeFilters?.[filter.id] === opt.id
                                return (
                                    <button
                                        key={opt.id}
                                        onClick={() => onFilterChange?.(filter.id, isActive ? '' : opt.id)}
                                        className={`px-5 py-2 sm:px-6 sm:py-2.5 rounded-full text-[10px] sm:text-xs uppercase tracking-[0.2em] font-medium transition-all duration-300 relative ${isActive
                                            ? 'text-stone-900 bg-white border border-stone-200/50 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.1)]'
                                            : 'text-stone-400 hover:text-stone-600 border border-transparent'
                                            }`}
                                    >
                                        <span className="relative z-10">{opt.label}</span>
                                    </button>
                                )
                            })}
                        </div>
                    ))}
                </div>
            )}

            {/* Horizontal Pagination Carousel */}
            <div className="relative flex-1 min-h-[460px] flex items-center justify-center w-full max-w-2xl mx-auto px-4 sm:px-12">

                {/* Prev Button */}
                <button
                    onClick={handlePrev}
                    disabled={currentPage === 0}
                    className="absolute left-2 sm:-left-6 z-20 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-stone-100 text-stone-400 hover:text-[#38473b] hover:shadow-[0_8px_25px_-4px_rgba(0,0,0,0.15)] disabled:opacity-0 disabled:cursor-not-allowed transition-all duration-300"
                >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none"><path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>

                <div className="w-full relative h-[500px] sm:h-[600px]">
                    <AnimatePresence initial={false} custom={direction}>
                        <motion.div
                            key={currentPage}
                            custom={direction}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            className="absolute inset-0 w-full h-full"
                        >
                            <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-4 sm:gap-6 content-start">
                                {currentOptions.map((option, i) => (
                                    <button
                                        key={option.id}
                                        onClick={() => onSelect(option.id)}
                                        className={`group flex flex-col bg-white rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-500 relative border text-left h-full ${selectedId === option.id
                                            ? 'border-transparent shadow-[0_10px_40px_-10px_rgb(56,71,59,0.3)] -translate-y-1.5 ring-2 ring-[#38473b] ring-offset-2'
                                            : 'border-stone-100 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_30px_-8px_rgba(0,0,0,0.1)] hover:-translate-y-1'
                                            }`}
                                    >
                                        <div className="w-full relative bg-gradient-to-br from-stone-50 to-stone-100/50 flex items-center justify-center overflow-hidden flex-1 min-h-0">
                                            {option.image ? (
                                                <Image
                                                    src={option.image}
                                                    alt={option.label}
                                                    fill
                                                    sizes="(max-width: 768px) 50vw, 400px"
                                                    priority={i < 4}
                                                    quality={100}
                                                    className={`object-contain p-2 sm:p-4 transition-transform duration-700 ease-out group-hover:scale-110 ${option.attributes?.size === 'mini' ? 'scale-[2.0]' :
                                                        option.attributes?.size === 'big' ? 'scale-[1.5]' :
                                                            option.attributes?.size === 'jumbo' ? 'scale-[1.2]' :
                                                                'scale-125'
                                                        }`}
                                                />
                                            ) : (
                                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/5 group-hover:bg-black/10 transition-colors" />
                                            )}

                                            {/* Selection Checkmark */}
                                            <AnimatePresence>
                                                {selectedId === option.id && (
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                                                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                                        exit={{ opacity: 0, scale: 0.5, rotate: 45 }}
                                                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                                                        className="absolute top-3 right-3 sm:top-4 sm:right-4 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#38473b] text-white flex items-center justify-center shadow-lg z-20"
                                                    >
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>

                                            {/* Zoom Button */}
                                            {option.image && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setZoomedImage({ src: option.image!, label: option.label })
                                                    }}
                                                    className={`absolute top-3 left-3 sm:top-4 sm:left-4 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md text-stone-600 flex items-center justify-center shadow z-20 transition-all duration-300 ${selectedId === option.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 hover:bg-white hover:text-stone-900 hover:scale-110'}`}
                                                >
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
                                                </button>
                                            )}
                                        </div>
                                        <div className="w-full px-4 py-3 sm:px-6 sm:py-5 bg-white flex flex-col justify-center gap-1 sm:gap-1.5 z-10 relative shrink-0">
                                            <span className="text-[12px] sm:text-[14px] text-stone-900 font-bold tracking-wide leading-tight truncate">{option.label}</span>
                                            {option.price !== undefined && option.price > 0 && (
                                                <span className="text-[10px] sm:text-xs text-stone-400 font-semibold tracking-widest uppercase">{formatPrice(option.price)}</span>
                                            )}
                                        </div>
                                        {/* Subtle overlay gradient on selected */}
                                        {selectedId === option.id && (
                                            <div className="absolute inset-0 bg-[#38473b]/[0.02] pointer-events-none z-0" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Next Button */}
                <button
                    onClick={handleNext}
                    disabled={currentPage >= totalPages - 1}
                    className="absolute right-2 sm:-right-6 z-20 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-stone-100 text-stone-400 hover:text-[#38473b] hover:shadow-[0_8px_25px_-4px_rgba(0,0,0,0.15)] disabled:opacity-0 disabled:cursor-not-allowed transition-all duration-300"
                >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none"><path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
            </div>

            {/* Pagination Dots indicator */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2.5 mt-2 md:mt-4 pb-4">
                    {Array.from({ length: totalPages }).map((_, i) => (
                        <div
                            key={i}
                            className={`h-1.5 rounded-full transition-all duration-500 shadow-sm ${i === currentPage ? 'w-8 bg-[#38473b]' : 'w-2 bg-stone-200'}`}
                        />
                    ))}
                </div>
            )}

            {/* Zoom Modal */}
            <AnimatePresence>
                {zoomedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-white/90 backdrop-blur-xl p-4 sm:p-8"
                        onClick={() => setZoomedImage(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.9, y: 20, opacity: 0 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="relative w-full max-w-4xl max-h-[90vh] flex flex-col items-center bg-white rounded-3xl shadow-2xl border border-stone-100 overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setZoomedImage(null)}
                                className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 bg-stone-100 hover:bg-stone-200 rounded-full flex items-center justify-center text-stone-500 hover:text-stone-900 transition-colors z-10"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>

                            <div className="w-full relative aspect-square sm:aspect-[4/3] bg-stone-50">
                                <Image
                                    src={zoomedImage.src}
                                    alt={zoomedImage.label}
                                    fill
                                    quality={100}
                                    className="object-contain p-8 sm:p-12 drop-shadow-2xl"
                                />
                            </div>

                            <div className="w-full p-6 sm:p-8 bg-white text-center border-t border-stone-100">
                                <h3 className="text-xl sm:text-2xl font-bold text-stone-900">{zoomedImage.label}</h3>
                                <p className="text-sm text-stone-500 mt-2 uppercase tracking-widest">High Resolution Preview</p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
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
    const [acknowledged, setAcknowledged] = useState(false)
    const [variantMap, setVariantMap] = useState<Record<string, Record<string, string>>>({})

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

    // Fetch Shopify variant IDs on mount so we can add to cart later
    useEffect(() => {
        const allOptions = [...chains, ...bails, ...jades, ...cordColors]
        const handles = Array.from(new Set(allOptions.map((o) => o.shopifyHandle).filter(Boolean))) as string[]
        if (!handles.length) return
        fetch(`/api/jade-bar/variants?handles=${encodeURIComponent(handles.join(','))}`)
            .then((r) => r.json())
            .then((data) => { if (data && !data.error) setVariantMap(data) })
            .catch(() => {})
    }, [])

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
        setAcknowledged(false)
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

    /** Resolve a builder option to its Shopify variant GID */
    const resolveVariantId = useCallback((option: BuilderOption | undefined): string | null => {
        if (!option?.shopifyHandle) return null
        const productVariants = variantMap[option.shopifyHandle]
        if (!productVariants) return null
        // If the option specifies a variant title, use it; otherwise grab "Default Title"
        const title = option.shopifyVariantTitle || 'Default Title'
        return productVariants[title] ?? Object.values(productVariants)[0] ?? null
    }, [variantMap])

    const handleAddToCart = useCallback(async () => {
        setIsAddingToCart(true)
        setCartFeedback(null)

        try {
            // Gather selected options based on piece type
            const selectedOptions: BuilderOption[] = []
            if (selections.pieceType === 'necklace') {
                const chain = getOptionById(chains, selections.chain)
                const bail = getOptionById(bails, selections.bail)
                const jade = getOptionById(jades, selections.jade)
                if (chain) selectedOptions.push(chain)
                if (bail && bail.id !== 'no_bail') selectedOptions.push(bail)
                if (jade) selectedOptions.push(jade)
            } else if (selections.pieceType === 'bracelet') {
                const cord = getOptionById(cordColors, selections.cordColor)
                const jade = getOptionById(jades, selections.jade)
                if (cord) selectedOptions.push(cord)
                if (jade) selectedOptions.push(jade)
            } else if (selections.pieceType === 'charm') {
                const bail = getOptionById(bails, selections.bail)
                const jade = getOptionById(jades, selections.jade)
                if (bail && bail.id !== 'no_bail') selectedOptions.push(bail)
                if (jade) selectedOptions.push(jade)
            }

            // Resolve each option to a Shopify variant GID
            const lines: Array<{ merchandiseId: string; quantity: number; attributes: Array<{ key: string; value: string }> }> = []
            const missing: string[] = []

            for (const opt of selectedOptions) {
                const variantId = resolveVariantId(opt)
                if (!variantId) {
                    missing.push(opt.label)
                    continue
                }
                lines.push({
                    merchandiseId: variantId,
                    quantity: 1,
                    attributes: [
                        { key: 'Custom Piece Type', value: selections.pieceType || '' },
                        { key: 'Component', value: opt.label },
                        ...(selections.pieceType === 'bracelet' && selections.wristLength
                            ? [{ key: 'Wrist Length', value: `${selections.wristLength} in` }]
                            : []),
                    ],
                })
            }

            if (missing.length) {
                setCartFeedback(`Could not find Shopify products for: ${missing.join(', ')}. Please contact support.`)
                setIsAddingToCart(false)
                return
            }

            if (!lines.length) {
                setCartFeedback('No items to add. Please make your selections.')
                setIsAddingToCart(false)
                return
            }

            const res = await fetch('/api/cart/lines', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ lines }),
            })

            if (!res.ok) {
                const err = await res.json().catch(() => ({}))
                throw new Error(err.error || 'Failed to add to cart')
            }

            setCartFeedback('Added to your bag!')
            window.dispatchEvent(new CustomEvent('tomi:cart:open'))
        } catch (err: any) {
            setCartFeedback(err?.message || 'Something went wrong. Please try again.')
        } finally {
            setIsAddingToCart(false)
        }
    }, [selections, variantMap, resolveVariantId])

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
                        <h2 className="font-heading text-2xl md:text-3xl text-stone-900 mb-2">what jade piece would you</h2>
                        <h2 className="font-heading text-2xl md:text-3xl text-stone-900 mb-10">like to build today?</h2>
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
                                        <span className="absolute inset-0 flex items-center justify-center text-[5.5px] font-bold uppercase tracking-wider text-[#38473b] pt-0.5">
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
                            <button
                                onClick={() => { updateSelection('pieceType', 'charm'); navigate('charm_bail') }}
                                className="bg-[#38473b] text-white text-xs font-bold uppercase tracking-[0.2em] px-12 py-4 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 w-56"
                            >
                                Charm
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* ─── BUILDING SCENE (2-COLUMN LAYOUT) ─── */}
                {['necklace_chain', 'necklace_bail', 'necklace_jade', 'bracelet_wrist', 'bracelet_cord', 'bracelet_jade', 'charm_bail', 'charm_jade'].includes(screen) && (
                    <motion.div key="building_scene" variants={animVariants} initial="initial" animate="animate" exit="exit"
                        className="w-full max-w-[1280px] mx-auto flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 pt-4 lg:pt-12 px-6"
                    >
                        {/* LEFT COLUMN: Summary Sticky View */}
                        <div className="w-full lg:w-[380px] flex flex-col items-center bg-white p-8 lg:p-10 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-stone-100/50 flex-shrink-0 relative z-10 lg:sticky lg:top-1/2 lg:-translate-y-1/2 transition-transform duration-500">
                            <SelectionSummary selections={selections} pieceType={screen.startsWith('necklace') ? 'necklace' : screen.startsWith('charm') ? 'charm' : 'bracelet'} />
                            <div className="mt-2 pt-6 border-t border-stone-100/80 w-full text-center">
                                <div className="text-[10px] text-stone-400 font-bold uppercase tracking-[0.2em] mb-1">Estimated Total</div>
                                <div className="text-4xl font-heading text-[#38473b]">{formatPrice(totalPrice)}</div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Rotating Options Grid */}
                        <div className="w-full lg:w-[700px] flex flex-col justify-center relative min-h-[500px] lg:min-h-[600px]">
                            <AnimatePresence mode="wait">
                                {screen === 'necklace_chain' && (
                                    <motion.div key="necklace_chain" variants={animVariants} initial="initial" animate="animate" exit="exit" className="w-full flex flex-col justify-center h-full">
                                        <SelectionGrid title="pick your desired chain" options={chains} selectedId={selections.chain}
                                            onSelect={(id) => updateSelection('chain', id)} filters={chainFilters} activeFilters={chainFilterState}
                                            onFilterChange={(fid, val) => setChainFilterState((p) => ({ ...p, [fid]: val }))} />
                                        <NavBar onBack={() => navigate('piece_type', -1)} onNext={() => navigate('necklace_bail')} nextEnabled={!!selections.chain} />
                                    </motion.div>
                                )}
                                {screen === 'necklace_bail' && (
                                    <motion.div key="necklace_bail" variants={animVariants} initial="initial" animate="animate" exit="exit" className="w-full flex flex-col justify-center h-full">
                                        <SelectionGrid title="pick a bail option" options={bails} selectedId={selections.bail}
                                            onSelect={(id) => updateSelection('bail', id)} />
                                        <NavBar onBack={() => navigate('necklace_chain', -1)} onNext={() => navigate('necklace_jade')} nextEnabled={!!selections.bail} />
                                    </motion.div>
                                )}
                                {screen === 'necklace_jade' && (
                                    <motion.div key="necklace_jade" variants={animVariants} initial="initial" animate="animate" exit="exit" className="w-full flex flex-col justify-center h-full">
                                        <SelectionGrid title="pick a jade" options={jades} selectedId={selections.jade}
                                            onSelect={(id) => updateSelection('jade', id)} filters={jadeFilters} activeFilters={jadeFilterState}
                                            onFilterChange={(fid, val) => setJadeFilterState((p) => ({ ...p, [fid]: val }))} />
                                        <NavBar onBack={() => navigate('necklace_bail', -1)} onNext={() => goToReview('necklace_review')} nextEnabled={!!selections.jade} />
                                    </motion.div>
                                )}
                                {screen === 'bracelet_wrist' && (
                                    <motion.div key="bracelet_wrist" variants={animVariants} initial="initial" animate="animate" exit="exit" className="w-full flex flex-col items-center justify-center text-center h-full">
                                        <h2 className="font-heading text-3xl lg:text-4xl text-stone-900 mb-3">measure your wrist and</h2>
                                        <h2 className="font-heading text-3xl lg:text-4xl text-stone-900 mb-10">provide us the length in <span className="underline">inches</span></h2>
                                        <div className="relative mb-8">
                                            <input type="number" step="0.1" min="0" max="20" placeholder="e.g., 6.5"
                                                value={selections.wristLength ?? ''}
                                                onChange={(e) => updateSelection('wristLength', e.target.value ? parseFloat(e.target.value) : null)}
                                                className="w-56 text-center py-4 px-6 border-2 border-stone-200 rounded-full text-xl font-medium text-stone-900 bg-white focus:outline-none focus:border-[#38473b] hover:border-stone-300 transition-colors shadow-sm placeholder:text-stone-300"
                                            />
                                            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-sm font-bold text-stone-400">in</span>
                                        </div>
                                        <NavBar onBack={() => navigate('piece_type', -1)}
                                            onNext={() => navigate('bracelet_cord')}
                                            nextEnabled={!!selections.wristLength && selections.wristLength > 0 && selections.wristLength <= 20} />
                                    </motion.div>
                                )}
                                {screen === 'bracelet_cord' && (
                                    <motion.div key="bracelet_cord" variants={animVariants} initial="initial" animate="animate" exit="exit" className="w-full flex flex-col justify-center h-full">
                                        <SelectionGrid title="pick your satin cord color" options={cordColors} selectedId={selections.cordColor}
                                            onSelect={(id) => updateSelection('cordColor', id)} />
                                        <NavBar onBack={() => navigate('bracelet_wrist', -1)} onNext={() => navigate('bracelet_jade')} nextEnabled={!!selections.cordColor} />
                                    </motion.div>
                                )}
                                {screen === 'bracelet_jade' && (
                                    <motion.div key="bracelet_jade" variants={animVariants} initial="initial" animate="animate" exit="exit" className="w-full flex flex-col justify-center h-full">
                                        <SelectionGrid title="pick a jade" options={jades} selectedId={selections.jade}
                                            onSelect={(id) => updateSelection('jade', id)} filters={jadeFilters} activeFilters={jadeFilterState}
                                            onFilterChange={(fid, val) => setJadeFilterState((p) => ({ ...p, [fid]: val }))} />
                                        <NavBar onBack={() => navigate('bracelet_cord', -1)} onNext={() => goToReview('bracelet_review')} nextEnabled={!!selections.jade} />
                                    </motion.div>
                                )}
                                                            {screen === 'charm_bail' && (
                                    <motion.div key="charm_bail" variants={animVariants} initial="initial" animate="animate" exit="exit" className="w-full flex flex-col justify-center h-full">
                                        <SelectionGrid title="pick a bail option" options={bails} selectedId={selections.bail}
                                            onSelect={(id) => updateSelection('bail', id)} />
                                        <NavBar onBack={() => navigate('piece_type', -1)} onNext={() => navigate('charm_jade')} nextEnabled={!!selections.bail} />
                                    </motion.div>
                                )}
                                {screen === 'charm_jade' && (
                                    <motion.div key="charm_jade" variants={animVariants} initial="initial" animate="animate" exit="exit" className="w-full flex flex-col justify-center h-full">
                                        <SelectionGrid title="pick a jade" options={jades} selectedId={selections.jade}
                                            onSelect={(id) => updateSelection('jade', id)} filters={jadeFilters} activeFilters={jadeFilterState}
                                            onFilterChange={(fid, val) => setJadeFilterState((p) => ({ ...p, [fid]: val }))} />
                                        <NavBar onBack={() => navigate('charm_bail', -1)} onNext={() => goToReview('charm_review')} nextEnabled={!!selections.jade} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}

                {/* ─── REVIEW SCREENS ─── */}
                {screen === 'necklace_review' && (
                    <motion.div key="necklace_review" variants={animVariants} initial="initial" animate="animate" exit="exit"
                        className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[60vh] py-12"
                    >
                        {isBuilding ? (
                            <BuildingAnimation pieceType="necklace" onComplete={handleBuildComplete} />
                        ) : showReveal ? (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} className="text-center w-full"
                            >
                                <h3 className="font-heading text-4xl text-stone-900 mb-6">ta-da!</h3>
                                <div className="w-56 h-56 mx-auto rounded-3xl shadow-xl flex items-center justify-center mb-8 relative overflow-hidden"
                                    style={{ backgroundColor: getOptionById(jades, selections.jade)?.bgColor || '#f4f3f1' }}>
                                    {getCustomPieceImage(selections) ? (
                                        <Image src={getCustomPieceImage(selections)!} alt="Your Custom Jade Piece" fill className="object-cover drop-shadow-2xl scale-[1.3] translate-y-2 hover:scale-[1.4] transition-transform duration-500" />
                                    ) : getOptionById(jades, selections.jade)?.image ? (
                                        <Image src={getOptionById(jades, selections.jade)!.image!} alt="Selected Jade" fill className="object-cover p-4" />
                                    ) : (
                                        <div className="w-16 h-16 rounded-full bg-white/40" />
                                    )}
                                </div>
                                <SelectionSummary selections={selections} pieceType="necklace" />
                                <div className="mb-6">
                                    <div className="text-xs text-stone-400 uppercase tracking-[0.15em] mb-1">Estimated Total</div>
                                    <div className="text-4xl font-heading text-[#38473b]">{formatPrice(totalPrice)}</div>
                                </div>
                                
                                <div className="flex items-start gap-3 mb-6 max-w-sm mx-auto text-left">
                                    <input type="checkbox" id={`jade-disclaimer-${screen}`} checked={acknowledged} onChange={(e) => setAcknowledged(e.target.checked)} className="mt-1 w-4 h-4 text-[#38473b] focus:ring-[#38473b] border-stone-300 rounded cursor-pointer" />
                                    <label htmlFor={`jade-disclaimer-${screen}`} className="text-xs text-stone-500 leading-relaxed font-light cursor-pointer">I acknowledge that the store team will select the physical jade stone for my custom piece based on my preferences.</label>
                                </div>
                                <div className="flex flex-col items-center gap-3">
                                    <button onClick={handleAddToCart} disabled={isAddingToCart || !acknowledged}
                                        className="bg-[#38473b] text-white text-xs font-bold uppercase tracking-[0.2em] px-12 py-4 rounded-full shadow-lg hover:shadow-xl transition-all disabled:opacity-50 w-56">
                                        {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                                    </button>
                                    {cartFeedback && (
                                        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-[#38473b] font-medium">{cartFeedback}</motion.span>
                                    )}
                                    <div className="flex flex-col items-center mt-4">
                                        <button onClick={resetFlow} className="text-[10px] uppercase tracking-[0.15em] font-bold text-stone-400 hover:text-stone-700 transition-colors mb-2">
                                            Start Over
                                        </button>
                                        <NavBar onBack={() => { setShowReveal(false); navigate('necklace_jade', -1) }} showBack={true} />
                                    </div>
                                </div>
                            </motion.div>
                        ) : null}
                    </motion.div>
                )}

                {screen === 'bracelet_review' && (
                    <motion.div key="bracelet_review" variants={animVariants} initial="initial" animate="animate" exit="exit"
                        className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[60vh] py-12"
                    >
                        {isBuilding ? (
                            <BuildingAnimation pieceType="bracelet" onComplete={handleBuildComplete} />
                        ) : showReveal ? (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} className="text-center w-full"
                            >
                                <h3 className="font-heading text-4xl text-stone-900 mb-6">ta-da!</h3>
                                <div className="w-56 h-56 mx-auto rounded-3xl shadow-xl flex items-center justify-center mb-8 relative overflow-hidden"
                                    style={{ backgroundColor: getOptionById(jades, selections.jade)?.bgColor || '#f4f3f1' }}>
                                    {getOptionById(jades, selections.jade)?.image ? (
                                        <Image src={getOptionById(jades, selections.jade)!.image!} alt="Selected Jade" fill className="object-cover p-4" />
                                    ) : (
                                        <div className="w-16 h-16 rounded-full bg-white/40" />
                                    )}
                                </div>
                                <SelectionSummary selections={selections} pieceType="bracelet" />
                                <div className="mb-6">
                                    <div className="text-xs text-stone-400 uppercase tracking-[0.15em] mb-1">Estimated Total</div>
                                    <div className="text-4xl font-heading text-[#38473b]">{formatPrice(totalPrice)}</div>
                                </div>
                                
                                <div className="flex items-start gap-3 mb-6 max-w-sm mx-auto text-left">
                                    <input type="checkbox" id={`jade-disclaimer-${screen}`} checked={acknowledged} onChange={(e) => setAcknowledged(e.target.checked)} className="mt-1 w-4 h-4 text-[#38473b] focus:ring-[#38473b] border-stone-300 rounded cursor-pointer" />
                                    <label htmlFor={`jade-disclaimer-${screen}`} className="text-xs text-stone-500 leading-relaxed font-light cursor-pointer">I acknowledge that the store team will select the physical jade stone for my custom piece based on my preferences.</label>
                                </div>
                                <div className="flex flex-col items-center gap-3">
                                    <button onClick={handleAddToCart} disabled={isAddingToCart || !acknowledged}
                                        className="bg-[#38473b] text-white text-xs font-bold uppercase tracking-[0.2em] px-12 py-4 rounded-full shadow-lg hover:shadow-xl transition-all disabled:opacity-50 w-56">
                                        {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                                    </button>
                                    {cartFeedback && (
                                        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-[#38473b] font-medium">{cartFeedback}</motion.span>
                                    )}
                                    <div className="flex flex-col items-center mt-4">
                                        <button onClick={resetFlow} className="text-[10px] uppercase tracking-[0.15em] font-bold text-stone-400 hover:text-stone-700 transition-colors mb-2">
                                            Start Over
                                        </button>
                                        <NavBar onBack={() => { setShowReveal(false); navigate('bracelet_jade', -1) }} showBack={true} />
                                    </div>
                                </div>
                            </motion.div>
                        ) : null}
                    </motion.div>
                )}

                {screen === 'charm_review' && (
                    <motion.div key="charm_review" variants={animVariants} initial="initial" animate="animate" exit="exit"
                        className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[60vh] py-12"
                    >
                        {isBuilding ? (
                            <BuildingAnimation pieceType="charm" onComplete={handleBuildComplete} />
                        ) : showReveal ? (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} className="text-center w-full"
                            >
                                <h3 className="font-heading text-4xl text-stone-900 mb-6">ta-da!</h3>
                                <div className="w-56 h-56 mx-auto rounded-3xl shadow-xl flex items-center justify-center mb-8 relative overflow-hidden"
                                    style={{ backgroundColor: getOptionById(jades, selections.jade)?.bgColor || '#f4f3f1' }}>
                                    {getOptionById(jades, selections.jade)?.image ? (
                                        <Image src={getOptionById(jades, selections.jade)!.image!} alt="Selected Jade" fill className="object-cover p-4 hover:scale-[1.1] transition-transform duration-500" />
                                    ) : (
                                        <div className="w-16 h-16 rounded-full bg-white/40" />
                                    )}
                                </div>
                                <SelectionSummary selections={selections} pieceType="charm" />
                                <div className="mb-6">
                                    <div className="text-xs text-stone-400 uppercase tracking-[0.15em] mb-1">Estimated Total</div>
                                    <div className="text-4xl font-heading text-[#38473b]">{formatPrice(totalPrice)}</div>
                                </div>
                                
                                <div className="flex items-start gap-3 mb-6 max-w-sm mx-auto text-left">
                                    <input type="checkbox" id={`jade-disclaimer-\${screen}`} checked={acknowledged} onChange={(e) => setAcknowledged(e.target.checked)} className="mt-1 w-4 h-4 text-[#38473b] focus:ring-[#38473b] border-stone-300 rounded cursor-pointer" />
                                    <label htmlFor={`jade-disclaimer-\${screen}`} className="text-xs text-stone-500 leading-relaxed font-light cursor-pointer">I acknowledge that the store team will select the physical jade stone for my custom piece based on my preferences.</label>
                                </div>
                                <div className="flex flex-col items-center gap-3">
                                    <button onClick={handleAddToCart} disabled={isAddingToCart || !acknowledged}
                                        className="bg-[#38473b] text-white text-xs font-bold uppercase tracking-[0.2em] px-12 py-4 rounded-full shadow-lg hover:shadow-xl transition-all disabled:opacity-50 w-56">
                                        {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                                    </button>
                                    {cartFeedback && (
                                        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-[#38473b] font-medium">{cartFeedback}</motion.span>
                                    )}
                                    <div className="flex flex-col items-center mt-4">
                                        <button onClick={resetFlow} className="text-[10px] uppercase tracking-[0.15em] font-bold text-stone-400 hover:text-stone-700 transition-colors mb-2">
                                            Start Over
                                        </button>
                                        <NavBar onBack={() => { setShowReveal(false); navigate('charm_jade', -1) }} showBack={true} />
                                    </div>
                                </div>
                            </motion.div>
                        ) : null}
                    </motion.div>
                )}

            </AnimatePresence>
        </div>
    )
}
