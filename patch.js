const fs = require('fs');

const file = 'src/components/jade-bar/JadeBarBuilder.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. BuildingAnimation steps
content = content.replace(
    /const steps = pieceType === 'necklace'\s*\n\s*\? \['selecting your chain\.\.\.', 'attaching the bail\.\.\.', 'placing your jade\.\.\.', 'almost there\.\.\.'\]\s*\n\s*: \['measuring the cord\.\.\.', 'threading the jade\.\.\.', 'tying the knot\.\.\.', 'almost there\.\.\.'\]/,
    `const steps = pieceType === 'necklace'
        ? ['selecting your chain...', 'attaching the bail...', 'placing your jade...', 'almost there...']
        : pieceType === 'charm'
        ? ['preparing the bail...', 'attaching your jade...', 'getting it ready...', 'almost there...']
        : ['measuring the cord...', 'threading the jade...', 'tying the knot...', 'almost there...']`
);

// 2. SelectionSummary signature & slots
content = content.replace(
    /function SelectionSummary.*pieceType: 'necklace' \| 'bracelet' }/,
    `function SelectionSummary({ selections, pieceType }: { selections: Selections; pieceType: 'necklace' | 'bracelet' | 'charm' }`
);

content = content.replace(
    /const braceletSlots = \[([^\]]+)\]/s,
    `const braceletSlots = [$1]
    const charmSlots = [
        { key: 'bail', label: 'bail', value: selections.bail, list: bails },
        { key: 'jade', label: 'jade', value: selections.jade, list: jades },
    ]`
);

content = content.replace(
    /const slots = pieceType === 'necklace' \? necklaceSlots : braceletSlots/,
    `const slots = pieceType === 'necklace' ? necklaceSlots : pieceType === 'charm' ? charmSlots : braceletSlots`
);

// 3. Zoom Modal hover drag
content = content.replace(
    /<div className="w-full relative aspect-square sm:aspect-\[4\/3\] bg-stone-50">\s*<Image\s*src={zoomedImage\.src}\s*alt={zoomedImage\.label}\s*fill\s*quality={100}\s*className="object-contain p-8 sm:p-12 drop-shadow-2xl"\s*\/>\s*<\/div>/,
    `<div className="w-full relative py-12 aspect-square sm:aspect-[4/3] bg-stone-50 overflow-hidden cursor-move">
                                <motion.div className="w-full h-full relative" whileHover={{ scale: 2 }} transition={{ duration: 0.3 }} drag dragConstraints={{ left: -300, right: 300, top: -300, bottom: 300 }}>
                                    <Image
                                        src={zoomedImage.src}
                                        alt={zoomedImage.label}
                                        fill
                                        quality={100}
                                        className="object-contain p-8 sm:p-12 drop-shadow-2xl pointer-events-none"
                                    />
                                </motion.div>
                            </div>`
);

// 4. State
content = content.replace(
    /const \[cartFeedback, setCartFeedback\] = useState<string \| null>\(null\)/,
    `const [cartFeedback, setCartFeedback] = useState<string | null>(null)\n    const [acknowledged, setAcknowledged] = useState(false)`
);

// 5. resetFlow
content = content.replace(
    /setCartFeedback\(null\)/,
    `setCartFeedback(null)\n        setAcknowledged(false)`
);

// 6. totalPrice
content = content.replace(
    /    const totalPrice = useMemo\(\(\) => \{\n        let total = 0\n        if \(selections\.pieceType === 'necklace'\) \{\n            const chain = getOptionById\(chains, selections\.chain\)\n            const bail = getOptionById\(bails, selections\.bail\)\n            const jade = getOptionById\(jades, selections\.jade\)\n            total = \(chain\?\.price \|\| 0\) \+ \(bail\?\.price \|\| 0\) \+ \(jade\?\.price \|\| 0\)\n        \} else \{\n            const cord = getOptionById\(cordColors, selections\.cordColor\)\n            const jade = getOptionById\(jades, selections\.jade\)\n            total = \(cord\?\.price \|\| 0\) \+ \(jade\?\.price \|\| 0\)\n        \}\n        return total\n    \}, \[selections\]\)/,
    `    const totalPrice = useMemo(() => {
        let total = 0
        if (selections.pieceType === 'necklace') {
            const chain = getOptionById(chains, selections.chain)
            const bail = getOptionById(bails, selections.bail)
            const jade = getOptionById(jades, selections.jade)
            total = (chain?.price || 0) + (bail?.price || 0) + (jade?.price || 0)
        } else if (selections.pieceType === 'bracelet') {
            const cord = getOptionById(cordColors, selections.cordColor)
            const jade = getOptionById(jades, selections.jade)
            total = (cord?.price || 0) + (jade?.price || 0)
        } else if (selections.pieceType === 'charm') {
            const bail = getOptionById(bails, selections.bail)
            const jade = getOptionById(jades, selections.jade)
            total = (bail?.price || 0) + (jade?.price || 0)
        }
        return total
    }, [selections])`
);

// 7. Piece type Text
content = content.replace(
    /<h2 className="font-heading text-2xl md:text-3xl text-stone-900 mb-2">are you interested in building a<\/h2>/,
    `<h2 className="font-heading text-2xl md:text-3xl text-stone-900 mb-2">what jade piece would you</h2>`
);
content = content.replace(
    /<h2 className="font-heading text-2xl md:text-3xl text-stone-900 mb-10">jade necklace or bracelet\?<\/h2>/,
    `<h2 className="font-heading text-2xl md:text-3xl text-stone-900 mb-10">like to build today?</h2>`
);

// 8. Charm button
content = content.replace(
    /<button\s+onClick=\{\(\) => \{ updateSelection\('pieceType', 'bracelet'\); navigate\('bracelet_wrist'\) \}\}\s+className="bg-\[#38473b\] text-white text-xs font-bold uppercase tracking-\[0\.2em\] px-12 py-4 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0\.5 transition-all duration-300 w-56"\s*>\s*Bracelet\s*<\/button>/,
    `<button
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
                            </button>`
);

// 9. text-[7px]
content = content.replace(/text-\[7px\]/g, 'text-[5.5px]');

// 10 & 11 & 12. Screen includes
content = content.replace(
    /\['necklace_chain', 'necklace_bail', 'necklace_jade', 'bracelet_wrist', 'bracelet_cord', 'bracelet_jade'\]\.includes/,
    `['necklace_chain', 'necklace_bail', 'necklace_jade', 'bracelet_wrist', 'bracelet_cord', 'bracelet_jade', 'charm_bail', 'charm_jade'].includes`
);

content = content.replace(
    /pieceType=\{screen\.startsWith\('necklace'\) \? 'necklace' : 'bracelet'\}/,
    `pieceType={screen.startsWith('necklace') ? 'necklace' : screen.startsWith('charm') ? 'charm' : 'bracelet'}`
);

// Insert charm building screens after bracelet_jade
content = content.replace(
    /<\/AnimatePresence>\s*<\/div>\s*<\/motion\.div>\s*\)\}\s*\{\/\* ─── REVIEW SCREENS ─── \*\/\}/s,
    `                                {screen === 'charm_bail' && (
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

                {/* ─── REVIEW SCREENS ─── */}`
);

// 13. Replace #7BAE7F colors (which we used for Jade Bar green background)
content = content.replace(/#7BAE7F/g, '#f4f3f1');

// 14. Disclaimer and Charm Review Screen
const disclaimerSnippet = `
                                <div className="flex items-start gap-3 mb-6 max-w-sm mx-auto text-left">
                                    <input type="checkbox" id={\`jade-disclaimer-\${screen}\`} checked={acknowledged} onChange={(e) => setAcknowledged(e.target.checked)} className="mt-1 w-4 h-4 text-[#38473b] focus:ring-[#38473b] border-stone-300 rounded cursor-pointer" />
                                    <label htmlFor={\`jade-disclaimer-\${screen}\`} className="text-xs text-stone-500 leading-relaxed font-light cursor-pointer">I acknowledge that the store team will select the physical jade stone for my custom piece based on my preferences.</label>
                                </div>
`;

content = content.replace(
    /<div className="flex flex-col items-center gap-3">\s*<button onClick=\{handleAddToCart\} disabled=\{isAddingToCart\}/g,
    `${disclaimerSnippet}                                <div className="flex flex-col items-center gap-3">
                                    <button onClick={handleAddToCart} disabled={isAddingToCart || !acknowledged}`
);

// Append charm_review block after bracelet_review
content = content.replace(
    /<\/div>\s*\)\}\s*<\/AnimatePresence>/,
    `                )}

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
                                ${disclaimerSnippet}                                <div className="flex flex-col items-center gap-3">
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

            </AnimatePresence>`
);


fs.writeFileSync(file, content);
console.log('Patched JadeBarBuilder.tsx');
