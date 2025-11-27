"use client";

import type { PropsWithChildren } from "react";
import {
  motion,
  useScroll,
  useTransform,
  MotionStyle,
} from "framer-motion";
import { memo, useEffect, useMemo, useRef, useState } from "react";

type Section3DTransitionProps = PropsWithChildren<{
  className?: string;
  depth?: number;
  scrollEffect?: boolean;
}>;

const Section3DTransitionComponent = ({
  children,
  className = "",
  depth = 400,
  scrollEffect = true,
}: Section3DTransitionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();

    const resizeHandler = () => checkMobile();
    window.addEventListener("resize", resizeHandler, { passive: true });

    return () => window.removeEventListener("resize", resizeHandler);
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => setIsVisible(entry.isIntersecting));
      },
      { rootMargin: "120px", threshold: 0.1 },
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "center center", "end start"],
  });

  const shouldAnimate = scrollEffect && depth !== 0;

  const adjustedDepth = useMemo(
    () => (isMobile ? depth * 0.3 : depth),
    [isMobile, depth],
  );

  const translateZ = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [adjustedDepth, 0, -adjustedDepth * 0.5],
    { clamp: false },
  );

  const translateY = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [isMobile ? 30 : 100, 0, isMobile ? -15 : -50],
    { clamp: false },
  );

  const opacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0, 1, 1, 0.5],
    { clamp: true },
  );

  const scale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [0.97, 1, 0.98],
    { clamp: true },
  );

  const transformStyle: MotionStyle = shouldAnimate && isVisible
    ? {
        translateZ,
        translateY,
        opacity,
        scale,
        transformStyle: "preserve-3d",
        WebkitFontSmoothing: "subpixel-antialiased",
        MozOsxFontSmoothing: "grayscale",
      }
    : {
        opacity: 1,
      };

  return (
    <div ref={sectionRef} className={`relative ${className}`}>
      {shouldAnimate ? (
        <motion.div style={transformStyle} className="relative will-change-transform">
          {children}
        </motion.div>
      ) : (
        <div className="relative">
          {children}
        </div>
      )}
    </div>
  );
};

export const Section3DTransition = memo(Section3DTransitionComponent);
Section3DTransition.displayName = "Section3DTransition";


