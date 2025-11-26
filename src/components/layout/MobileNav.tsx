'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useId, useRef, useState } from 'react'

type MobileNavSubLink = {
  href: string
  label: string
}

type MobileNavSection = {
  title?: string
  links: MobileNavSubLink[]
}

type MobileNavLink = {
  href: string
  label: string
  subLinks?: MobileNavSubLink[]
  sections?: MobileNavSection[]
}

type MobileNavProps = {
  links: MobileNavLink[]
}

function chunkSections(sections: MobileNavSection[], columns = 2) {
  return sections.reduce<MobileNavSection[][]>((acc, section, index) => {
    const columnIndex = index % columns
    if (!acc[columnIndex]) acc[columnIndex] = []
    acc[columnIndex].push(section)
    return acc
  }, [])
}

export function MobileNav({ links }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const previousBodyStyles = useRef<{ overflow: string; position: string; top: string; width: string; touchAction: string }>({
    overflow: '',
    position: '',
    top: '',
    width: '',
    touchAction: '',
  })
  const scrollPositionRef = useRef(0)
  const panelId = useId()
  const pathname = usePathname()

  useEffect(() => {
    setIsOpen(false)
    setExpandedSection(null)
  }, [pathname])

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 768) {
        setIsOpen(false)
        setExpandedSection(null)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (typeof document === 'undefined') {
      return
    }

    const body = document.body

    if (isOpen) {
      previousBodyStyles.current = {
        overflow: body.style.overflow || '',
        position: body.style.position || '',
        top: body.style.top || '',
        width: body.style.width || '',
        touchAction: body.style.touchAction || '',
      }
      scrollPositionRef.current = window.scrollY
      body.style.overflow = 'hidden'
      body.style.position = 'fixed'
      body.style.top = `-${scrollPositionRef.current}px`
      body.style.width = '100%'
      body.style.touchAction = 'none'

      return () => {
        const { overflow, position, top, width, touchAction } = previousBodyStyles.current
        body.style.overflow = overflow
        body.style.position = position
        body.style.top = top
        body.style.width = width
        body.style.touchAction = touchAction
        window.scrollTo(0, scrollPositionRef.current)
      }
    }

    const { overflow, position, top, width, touchAction } = previousBodyStyles.current
    body.style.overflow = overflow
    body.style.position = position
    body.style.top = top
    body.style.width = width
    body.style.touchAction = touchAction
    window.scrollTo(0, scrollPositionRef.current)
  }, [isOpen])


  const toggleSection = (label: string) => {
    setExpandedSection((prev) => (prev === label ? null : label))
  }

  const openMenu = () => {
    setIsOpen(true)
    setExpandedSection(null)
  }

  const closeMenu = () => {
    setIsOpen(false)
    setExpandedSection(null)
  }

  return (
    <div className="mobile-nav" data-open={isOpen ? 'true' : 'false'}>
      <button
        type="button"
        className="mobile-nav-toggle"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => {
          if (isOpen) {
            closeMenu()
          } else {
            openMenu()
          }
        }}
      >
        <span className="sr-only">{isOpen ? 'Close navigation menu' : 'Open navigation menu'}</span>
        <span aria-hidden="true" className="mobile-nav-icon">
          <span />
          <span />
          <span />
        </span>
        <span className="mobile-nav-label">Menu</span>
      </button>

      {isOpen ? (
        <div className="mobile-nav-layer" onClick={closeMenu}>
          <div id={panelId} className="mobile-nav-panel" role="menu" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-nav-panel-inner">
              {links.map((link) => {
                const hasSubLinks = link.subLinks && link.subLinks.length > 0
                const hasSections = link.sections && link.sections.length > 0
                const isExpanded = expandedSection === link.label

                if (hasSections || hasSubLinks) {
                  return (
                    <div key={link.href} className="mobile-nav-section">
                      <button
                        type="button"
                        className="mobile-nav-link mobile-nav-link--expandable"
                        aria-expanded={isExpanded}
                        onClick={() => toggleSection(link.label)}
                      >
                        {link.label}
                        <span className={`mobile-nav-chevron ${isExpanded ? 'mobile-nav-chevron--open' : ''}`}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </span>
                      </button>
                      {isExpanded && (
                        <div className="mobile-nav-mega">
                          {hasSections ? (
                            chunkSections(link.sections!).map((columnSections, columnIndex) => (
                              <div key={`column-${columnIndex}`} className="mobile-nav-column">
                                {columnSections.map((section) => (
                                  <div key={section.title || 'default'} className="mobile-nav-subsection">
                                    {section.title ? <p className="mobile-nav-section-title">{section.title}</p> : null}
                                    <div className="mobile-nav-sublinks">
                                      {section.links.map((subLink) => (
                                        <Link
                                          key={subLink.href}
                                          href={subLink.href}
                                          className="mobile-nav-sublink"
                                          role="menuitem"
                                          onClick={() => setIsOpen(false)}
                                        >
                                          {subLink.label}
                                        </Link>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ))
                          ) : (
                              <div className="mobile-nav-sublinks">
                                {link.subLinks!.map((subLink) => (
                                  <Link
                                    key={subLink.href}
                                    href={subLink.href}
                                    className="mobile-nav-sublink"
                                    role="menuitem"
                                    onClick={() => setIsOpen(false)}
                                  >
                                    {subLink.label}
                                  </Link>
                                ))}
                              </div>
                            )}
                        </div>
                      )}
                    </div>
                  )
                }

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="mobile-nav-link"
                    role="menuitem"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

