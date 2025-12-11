"use client"

import React, { useEffect, useState } from 'react';

export type RevealVariant = 'organic' | 'editorial' | 'kinetic';

interface TomiRevealProps {
  height: string;
  variant: RevealVariant;
}

export const TomiReveal: React.FC<TomiRevealProps> = ({ height, variant }) => {
  const [scrollY, setScrollY] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);
  const [documentHeight, setDocumentHeight] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
        setScrollY(window.scrollY);
        setDocumentHeight(document.documentElement.scrollHeight);
    };
    
    const handleResize = () => {
        setWindowHeight(window.innerHeight);
        setDocumentHeight(document.documentElement.scrollHeight);
    };
    
    handleResize();
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    // Initial check
    setTimeout(handleResize, 100);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const distanceFromBottom = Math.max(0, documentHeight - (scrollY + windowHeight));
  const isVisible = distanceFromBottom < windowHeight;

  // Parallax utility
  const getParallaxY = (speed: number) => {
     if (!isVisible) return 150; 
     return Math.min(distanceFromBottom * speed, 400);
  };

  // --- Variant 1: Organic (The Reference) ---
  const RenderOrganic = () => (
    <>
      <div className="absolute inset-0 flex items-center justify-center p-4 md:p-12">
        <div 
          className="relative w-full h-[90%] md:h-[85%] bg-[#EEDCDC] rounded-[3rem] md:rounded-[5rem] overflow-hidden flex flex-col items-center justify-center shadow-[inset_0_10px_40px_rgba(0,0,0,0.05)] border border-white/20"
          style={{ transform: `scale(${Math.max(0.9, 1 - (distanceFromBottom * 0.0001))})` }}
        >
           <div className="absolute top-12 left-0 w-full px-12 flex justify-between items-center opacity-60">
             <span className="font-body text-xs uppercase tracking-widest text-tomi-text">Fig 01.</span>
             <span className="font-body text-xs uppercase tracking-widest text-tomi-text">The Collection</span>
           </div>
           <div className="relative z-10">
             <h1 
                className="font-heading text-[32vw] md:text-[28vw] leading-none text-tomi-text tracking-tight"
                style={{ 
                    transform: `translateY(${getParallaxY(0.15)}px)`,
                    textShadow: '0 20px 60px rgba(28, 41, 35, 0.1)'
                }}
             >
                tomi
             </h1>
           </div>
           <div 
             className="absolute -bottom-[20%] w-[120%] h-[40%] bg-tomi-text/5 rounded-[50%] blur-3xl"
             style={{ transform: `translateY(${getParallaxY(0.05)}px)` }}
           />
        </div>
      </div>
    </>
  );

  // --- Variant 2: Editorial (The Layout - Enhanced) ---
  const RenderEditorial = () => (
    <>
      <div className="absolute inset-0 flex flex-col p-6 md:p-12">
        {/* Border Container */}
        <div className="w-full h-full border border-tomi-text/10 relative flex flex-col rounded-r-full overflow-hidden">
            
            {/* Header Line & Badge */}
            <div className="w-full h-px bg-tomi-text/20 mt-24 relative">
                <div className="absolute -top-3 left-0 md:left-12 bg-[#EEDCDC] pr-4 font-body text-[10px] md:text-xs font-bold tracking-[0.2em] text-tomi-text uppercase flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-tomi-text"></span>
                    EST. 2023 / HOUSTON, TX
                </div>
            </div>

            {/* Split Screen Content */}
            <div className="flex-1 w-full flex relative overflow-hidden">
                {/* Center Vertical Divider */}
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-tomi-text/20" />

                {/* Left Side "to" */}
                <div className="flex-1 flex items-center justify-end pr-2 md:pr-8 overflow-hidden">
                    <span 
                        className="font-heading text-[35vw] md:text-[30vw] leading-none text-tomi-text relative -right-[2vw]"
                        style={{ 
                          transform: `translateY(${getParallaxY(0.25)}px)`,
                          opacity: isVisible ? 1 : 0.8 
                        }}
                    >
                        to
                    </span>
                </div>

                {/* Right Side "mi" */}
                <div className="flex-1 flex items-center justify-start pl-2 md:pl-8 overflow-hidden">
                    <span 
                        className="font-heading text-[35vw] md:text-[30vw] leading-none text-tomi-text relative -left-[2vw] italic"
                        style={{ 
                          transform: `translateY(${getParallaxY(0.15)}px)`, // Different speed for depth
                        }}
                    >
                        mi
                    </span>
                </div>
            </div>

            {/* Footer Grid Info */}
            <div className="h-auto md:h-32 border-t border-tomi-text/20 flex flex-col md:flex-row">
                <div className="flex-1 p-6 md:border-r border-tomi-text/20 flex items-center">
                    <p className="font-heading italic text-tomi-text text-lg md:text-2xl leading-tight max-w-sm">
                        &ldquo;Today&apos;s gem, tomorrow&apos;s gift.&rdquo;
                    </p>
                </div>
                <div className="flex-1 p-6 flex justify-between items-end">
                    <div className="flex flex-col gap-1">
                        <span className="font-body text-[10px] uppercase tracking-widest text-tomi-text/50">Collection</span>
                        <span className="font-heading text-tomi-text">Solid Gold / Timeless</span>
                    </div>
                    <div className="text-right flex flex-col gap-1">
                         <span className="font-body text-[10px] uppercase tracking-widest text-tomi-text/50">Origin</span>
                         <span className="font-heading text-tomi-text">Houston, TX</span>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </>
  );

  // --- Variant 3: Kinetic (The Motion) ---
  const RenderKinetic = () => (
    <>
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        
        {/* Abstract Background Circles */}
        <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] border border-tomi-text/5 rounded-full"
            style={{ transform: `translate(-50%, -50%) scale(${1 + (scrollY * 0.0005)}) rotate(${scrollY * 0.01}deg)` }}
        />
         <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] border border-tomi-text/5 rounded-full"
            style={{ transform: `translate(-50%, -50%) scale(${1 + (scrollY * 0.0008)}) rotate(-${scrollY * 0.015}deg)` }}
        />

        {/* Floating Letters */}
        <div className="relative z-10 flex gap-[2vw]">
            {['t', 'o', 'm', 'i'].map((char, i) => (
                <div 
                    key={i}
                    className="flex flex-col items-center origin-bottom"
                    style={{
                        transform: `
                            translateY(${getParallaxY(0.12 + (i * 0.03))}px)
                            rotate(${(distanceFromBottom * 0.015) * (i % 2 === 0 ? 1 : -0.8)}deg)
                        `
                    }}
                >
                    <span className={`
                        font-heading text-[28vw] leading-none text-tomi-text mix-blend-multiply
                        ${i === 1 ? 'font-light italic' : 'font-semibold'}
                        cursor-default select-none
                    `}>
                        {char}
                    </span>
                    <div 
                        className="w-2 h-2 bg-tomi-text rounded-full mt-4 transition-all duration-700 delay-100"
                        style={{ 
                          opacity: isVisible ? 0.3 : 0,
                          transform: `scale(${isVisible ? 1 : 0})`
                        }}
                    />
                </div>
            ))}
        </div>

        {/* Dual Vector Waves for "Liquid" effect */}
        <div 
          className="absolute bottom-0 left-0 w-full h-48 md:h-80 opacity-40 mix-blend-multiply"
          style={{ transform: `translateY(${getParallaxY(-0.05)}px)` }}
        >
          <svg className="w-full h-full text-[#E6CFCB] fill-current" viewBox="0 0 1440 320" preserveAspectRatio="none">
             <path d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,197.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
        <div 
          className="absolute bottom-0 left-0 w-full h-32 md:h-64 opacity-60"
          style={{ transform: `translateY(${getParallaxY(0.02)}px)` }}
        >
          <svg className="w-full h-full text-tomi-text/5 fill-current" viewBox="0 0 1440 320" preserveAspectRatio="none">
              <path d="M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,165.3C672,139,768,117,864,128C960,139,1056,181,1152,197.3C1248,213,1344,203,1392,197.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </div>
    </>
  );

  return (
    <div 
      className="fixed bottom-0 left-0 w-full z-0 bg-[#EEDCDC] flex flex-col justify-center items-center overflow-hidden"
      style={{ height }}
    >
      {variant === 'organic' && <RenderOrganic />}
      {variant === 'editorial' && <RenderEditorial />}
      {variant === 'kinetic' && <RenderKinetic />}
    </div>
  );
};

