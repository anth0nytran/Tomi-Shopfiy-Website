'use client'

import ScrollExpandMedia from '@/components/ui/scroll-expansion-hero'

/**
 * JewelryBoxReveal – scroll-expand section placed between Categories and Vintage.
 * Uses the jewelry-box.png asset and the title "add your story to a vintage piece".
 */
export function JewelryBoxReveal() {
  return (
    <ScrollExpandMedia
      mediaType="image"
      mediaSrc="/assets/jewelry-box.png"
      title="add your story to a vintage piece"
      scrollToExpand="scroll to explore"
      ctaLabel="shop vintage"
      ctaHref="/shop/category/one-of-a-kind-vintage"
    />
  )
}

