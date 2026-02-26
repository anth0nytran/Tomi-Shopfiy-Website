// ── Jade Bar Builder Data ──
// All option arrays for the custom piece builder.
// Replace placeholder images with real product photos as they become available.

export type BuilderOption = {
    id: string
    label: string
    price?: number
    image?: string
    bgColor?: string
    attributes?: Record<string, string | null>
}

export type FilterDef = {
    id: string
    label: string
    options: { id: string; label: string }[]
}

// ─── CHAINS ───
export const chainFilters: FilterDef[] = [
    {
        id: 'metal_color',
        label: 'Metal Color',
        options: [
            { id: 'yellow_gold', label: 'Yellow Gold' },
            { id: 'white_gold', label: 'White Gold' },
        ],
    },
    {
        id: 'karat',
        label: 'Karat',
        options: [
            { id: '9k', label: '9k' },
            { id: '14k', label: '14k' },
        ],
    },
]

export const chains: BuilderOption[] = [
    {
        id: '14k_adjustable_wheat',
        label: 'Adjustable Wheat',
        price: 168,
        bgColor: '#7BAE7F',
        attributes: { karat: '14k', metal_color: 'yellow_gold' },
    },
    {
        id: '14k_adjustable_box',
        label: 'Adjustable Box',
        price: 178,
        bgColor: '#7BAE7F',
        attributes: { karat: '14k', metal_color: 'yellow_gold' },
    },
    {
        id: '14k_adjustable_sparkle',
        label: 'Adjustable Sparkle',
        price: 188,
        bgColor: '#7BAE7F',
        attributes: { karat: '14k', metal_color: 'yellow_gold' },
    },
    {
        id: '14k_adjustable_dainty_cable',
        label: 'Adjustable Dainty Cable',
        price: 158,
        bgColor: '#7BAE7F',
        attributes: { karat: '14k', metal_color: 'yellow_gold' },
    },
    {
        id: '9k_sparkle',
        label: '9k Sparkle',
        price: 128,
        bgColor: '#7BAE7F',
        attributes: { karat: '9k', metal_color: 'yellow_gold' },
    },
    {
        id: '14k_wg_adjustable_wheat',
        label: 'Adjustable Wheat',
        price: 168,
        bgColor: '#8BB8A0',
        attributes: { karat: '14k', metal_color: 'white_gold' },
    },
    {
        id: '14k_wg_adjustable_box',
        label: 'Adjustable Box',
        price: 178,
        bgColor: '#8BB8A0',
        attributes: { karat: '14k', metal_color: 'white_gold' },
    },
    {
        id: '14k_wg_adjustable_sparkle',
        label: 'Adjustable Sparkle',
        price: 188,
        bgColor: '#8BB8A0',
        attributes: { karat: '14k', metal_color: 'white_gold' },
    },
    {
        id: '14k_wg_adjustable_dainty_cable',
        label: 'Adjustable Dainty Cable',
        price: 158,
        bgColor: '#8BB8A0',
        attributes: { karat: '14k', metal_color: 'white_gold' },
    },
]

// ─── BAILS ───
export const bails: BuilderOption[] = [
    {
        id: 'yellow_gold_oval_bail',
        label: 'Yellow Gold Oval',
        price: 45,
        bgColor: '#7BAE7F',
        attributes: { metal_color: 'yellow_gold' },
    },
    {
        id: 'white_gold_oval_bail',
        label: 'White Gold Oval',
        price: 45,
        bgColor: '#8BB8A0',
        attributes: { metal_color: 'white_gold' },
    },
    {
        id: 'yellow_gold_round_bail',
        label: 'Yellow Gold Round',
        price: 45,
        bgColor: '#7BAE7F',
        attributes: { metal_color: 'yellow_gold' },
    },
    {
        id: 'white_gold_round_bail',
        label: 'White Gold Round',
        price: 45,
        bgColor: '#8BB8A0',
        attributes: { metal_color: 'white_gold' },
    },
    {
        id: 'yellow_gold_mini_oval_bail',
        label: 'Yellow Gold Mini Oval',
        price: 35,
        bgColor: '#7BAE7F',
        attributes: { metal_color: 'yellow_gold' },
    },
    {
        id: 'no_bail',
        label: 'No Bail',
        price: 0,
        bgColor: '#9CB8A0',
        attributes: { metal_color: null },
    },
]

// ─── JADE ───
export const jadeFilters: FilterDef[] = [
    {
        id: 'jade_size',
        label: 'Size',
        options: [
            { id: 'mini', label: 'Mini' },
            { id: 'big', label: 'Big' },
            { id: 'jumbo', label: 'Jumbo' },
        ],
    },
]

export const jades: BuilderOption[] = [
    { id: 'mini_green', label: 'Mini – Green', price: 88, bgColor: '#5A9E5F', attributes: { size: 'mini', color: 'green' } },
    { id: 'mini_lavender', label: 'Mini – Lavender', price: 98, bgColor: '#B8A0C8', attributes: { size: 'mini', color: 'lavender' } },
    { id: 'mini_yellow', label: 'Mini – Yellow', price: 88, bgColor: '#D4C97A', attributes: { size: 'mini', color: 'yellow' } },
    { id: 'mini_white', label: 'Mini – White', price: 88, bgColor: '#D8D8D0', attributes: { size: 'mini', color: 'white' } },
    { id: 'big_green', label: 'Big – Green', price: 168, bgColor: '#5A9E5F', attributes: { size: 'big', color: 'green' } },
    { id: 'big_lavender', label: 'Big – Lavender', price: 198, bgColor: '#B8A0C8', attributes: { size: 'big', color: 'lavender' } },
    { id: 'big_pink', label: 'Big – Pink', price: 288, bgColor: '#E8BFC6', attributes: { size: 'big', color: 'pink' } },
    { id: 'jumbo_green', label: 'Jumbo – Green', price: 268, bgColor: '#5A9E5F', attributes: { size: 'jumbo', color: 'green' } },
    { id: 'jumbo_grey', label: 'Jumbo – Grey', price: 248, bgColor: '#A8A8A0', attributes: { size: 'jumbo', color: 'grey' } },
    { id: 'jumbo_lavender', label: 'Jumbo – Lavender', price: 298, bgColor: '#B8A0C8', attributes: { size: 'jumbo', color: 'lavender' } },
    { id: 'jumbo_white', label: 'Jumbo – White', price: 248, bgColor: '#D8D8D0', attributes: { size: 'jumbo', color: 'white' } },
    { id: 'jumbo_yellow', label: 'Jumbo – Yellow', price: 248, bgColor: '#D4C97A', attributes: { size: 'jumbo', color: 'yellow' } },
    { id: 'jumbo_blue', label: 'Jumbo – Blue', price: 288, bgColor: '#7AAEC8', attributes: { size: 'jumbo', color: 'blue' } },
]

// ─── CORD COLORS ───
export const cordColors: BuilderOption[] = [
    { id: 'beige', label: 'Beige', price: 50, bgColor: '#D2C4A8' },
    { id: 'white', label: 'White', price: 50, bgColor: '#E8E4DC' },
    { id: 'red', label: 'Red', price: 50, bgColor: '#B03A3A' },
    { id: 'deep_red', label: 'Deep Red', price: 50, bgColor: '#7A1F1F' },
    { id: 'pink', label: 'Pink', price: 50, bgColor: '#E8A0B0' },
    { id: 'green', label: 'Green', price: 50, bgColor: '#5A8E5F' },
    { id: 'black', label: 'Black', price: 50, bgColor: '#2A2A2A' },
    { id: 'gray', label: 'Gray', price: 50, bgColor: '#8A8A8A' },
    { id: 'royal_blue', label: 'Royal Blue', price: 50, bgColor: '#2A4A8A' },
    { id: 'navy_blue', label: 'Navy Blue', price: 50, bgColor: '#1A2A4A' },
]

// ─── SCREEN DEFINITIONS ───
export type ScreenId =
    | 'intro'
    | 'piece_type'
    | 'necklace_chain'
    | 'necklace_bail'
    | 'necklace_jade'
    | 'necklace_review'
    | 'bracelet_wrist'
    | 'bracelet_cord'
    | 'bracelet_jade'
    | 'bracelet_review'

export type Selections = {
    pieceType: 'necklace' | 'bracelet' | null
    chain: string | null
    bail: string | null
    jade: string | null
    wristLength: number | null
    cordColor: string | null
}

export const initialSelections: Selections = {
    pieceType: null,
    chain: null,
    bail: null,
    jade: null,
    wristLength: null,
    cordColor: null,
}

export function getOptionById(list: BuilderOption[], id: string | null): BuilderOption | undefined {
    if (!id) return undefined
    return list.find((o) => o.id === id)
}

export function formatPrice(price: number): string {
    return `$${price.toLocaleString()}`
}
