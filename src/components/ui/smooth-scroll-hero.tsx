"use client";

import * as React from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";

const DEFAULT_IMAGE = "/assets/discover_jade.png";

export interface SmoothScrollHeroProps {
  /**
   * Height of the scroll section in pixels.
   * @default 1500
   */
  scrollHeight?: number;
  /**
   * Background image URL for desktop view.
   * @default "/assets/discover_jade.png"
   */
  desktopImage?: string;
  /**
   * Background image URL for mobile view.
   * @default "/assets/discover_jade.png"
   */
  mobileImage?: string;
  /**
   * Initial clip path percentage.
   * @default 25
   */
  initialClipPercentage?: number;
  /**
   * Final clip path percentage.
   * @default 75
   */
  finalClipPercentage?: number;
  /**
   * Scroll progress (0-1) at which the hero should be fully revealed.
   * @default 0.7
   */
  revealAt?: number;
  /**
   * Starting background size in percent.
   * @default 170
   */
  initialBackgroundSize?: number;
  /**
   * Ending background size in percent.
   * @default 100
   */
  finalBackgroundSize?: number;
  /**
   * If true, the initial clip rectangle stays centered (percentages are treated as visible area sizes).
   * @default false
   */
  centerInitialFrame?: boolean;
  /**
   * Optional overlay content that fades in as the image is revealed.
   */
  overlayContent?: React.ReactNode;
  /**
   * Scroll progress (0-1) at which the overlay begins to appear.
   * @default 0.8
   */
  overlayRevealStart?: number;
  /**
   * Optional className override for the overlay container (defaults to full-bleed).
   */
  overlayContainerClassName?: string;
  /**
   * Optional className for the overlay backdrop. Set to undefined to remove.
   */
  overlayBackdropClassName?: string | null;
  /**
   * Optional className override for the overlay inner content wrapper.
   */
  overlayInnerClassName?: string;
  /**
   * Freeze the hero in its final state once the reveal completes so the overlay/buttons remain accessible.
   * @default false
   */
  freezeOnComplete?: boolean;
  /**
   * Minimum height of the sticky viewport while animating.
   * @default "80vh"
   */
  viewportHeight?: string | number;
}

interface SmoothScrollHeroBackgroundProps
  extends Required<
    Omit<
      SmoothScrollHeroProps,
      | "revealAt"
      | "initialBackgroundSize"
      | "finalBackgroundSize"
      | "centerInitialFrame"
      | "overlayContent"
      | "overlayRevealStart"
      | "overlayContainerClassName"
      | "overlayBackdropClassName"
      | "overlayInnerClassName"
      | "freezeOnComplete"
      | "viewportHeight"
    >
  > {
  targetRef: React.RefObject<HTMLDivElement>;
  revealAt: number;
  initialBackgroundSize: number;
  finalBackgroundSize: number;
  centerInitialFrame: boolean;
}

const SmoothScrollHeroBackground: React.FC<SmoothScrollHeroBackgroundProps> = ({
  scrollHeight,
  desktopImage,
  mobileImage,
  initialClipPercentage,
  finalClipPercentage,
  targetRef,
  revealAt,
  initialBackgroundSize,
  finalBackgroundSize,
  centerInitialFrame,
}) => {
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });

  const clampedRevealAt = React.useMemo(
    () => Math.min(Math.max(revealAt, 0.05), 1),
    [revealAt],
  );

  const revealProgress = useTransform(
    scrollYProgress,
    [0, clampedRevealAt],
    [0, 1],
  );

  const clampPercent = React.useCallback(
    (value: number) => Math.min(Math.max(value, 0), 100),
    [],
  );

  const [clipStartRange, clipEndRange] = React.useMemo(() => {
    if (!centerInitialFrame) {
      return [
        [clampPercent(initialClipPercentage), 0],
        [clampPercent(finalClipPercentage), 100],
      ];
    }

    const initialSize = clampPercent(initialClipPercentage);
    const finalSize = clampPercent(finalClipPercentage);

    const initialInset = (100 - initialSize) / 2;
    const finalInset = (100 - finalSize) / 2;

    return [
      [initialInset, finalInset],
      [100 - initialInset, 100 - finalInset],
    ];
  }, [centerInitialFrame, clampPercent, initialClipPercentage, finalClipPercentage]);

  const clipStart = useTransform(
    revealProgress,
    [0, 1],
    clipStartRange,
  );

  const clipEnd = useTransform(
    revealProgress,
    [0, 1],
    clipEndRange,
  );

  const clipPath = useMotionTemplate`polygon(${clipStart}% ${clipStart}%, ${clipEnd}% ${clipStart}%, ${clipEnd}% ${clipEnd}%, ${clipStart}% ${clipEnd}%)`;

  const backgroundSize = useTransform(
    revealProgress,
    [0, 1],
    [`${initialBackgroundSize}%`, `${finalBackgroundSize}%`],
  );

  return (
    <motion.div
      className="sticky top-0 h-screen w-full bg-transparent"
      style={{
        clipPath,
        willChange: "transform, opacity",
      }}
    >
      {/* Mobile background */}
      <motion.div
        className="absolute inset-0 md:hidden"
        style={{
          backgroundImage: `url(${mobileImage})`,
          backgroundSize,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      {/* Desktop background */}
      <motion.div
        className="absolute inset-0 hidden md:block"
        style={{
          backgroundImage: `url(${desktopImage})`,
          backgroundSize,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
    </motion.div>
  );
};

/**
 * Smooth scroll hero component with parallax background effect.
 */
let hasEverCompletedHero = false;

const SmoothScrollHero: React.FC<SmoothScrollHeroProps> = ({
  scrollHeight = 1500,
  desktopImage = DEFAULT_IMAGE,
  mobileImage = DEFAULT_IMAGE,
  initialClipPercentage = 25,
  finalClipPercentage = 75,
  revealAt = 0.7,
  initialBackgroundSize = 140,
  finalBackgroundSize = 100,
  centerInitialFrame = false,
  overlayContent,
  overlayRevealStart = 0.8,
  overlayContainerClassName = "absolute inset-0 flex items-center justify-center p-6 text-center",
  overlayBackdropClassName = "absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent pointer-events-none backdrop-blur-[2px]",
  overlayInnerClassName = "relative z-10 w-full max-w-3xl text-white",
  freezeOnComplete = false,
  viewportHeight = "80vh",
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [hasCompleted, setHasCompleted] = React.useState(
    () => hasEverCompletedHero && freezeOnComplete,
  );
  const [overlayInteractive, setOverlayInteractive] = React.useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const clampedRevealAt = React.useMemo(
    () => Math.min(Math.max(revealAt, 0.1), 1),
    [revealAt],
  );

  const revealProgress = useTransform(scrollYProgress, [0, clampedRevealAt], [0, 1]);

  const overlayRevealStartClamped = React.useMemo(
    () => Math.min(Math.max(overlayRevealStart, 0), 0.99),
    [overlayRevealStart],
  );

  const overlayOpacity = useTransform(
    revealProgress,
    [overlayRevealStartClamped, 1],
    [0, 1],
  );

  useMotionValueEvent(revealProgress, "change", (value) => {
    if (!overlayInteractive && value >= overlayRevealStartClamped) {
      setOverlayInteractive(true);
    }
    if (freezeOnComplete && !hasCompleted && value >= overlayRevealStartClamped) {
      hasEverCompletedHero = true;
      setHasCompleted(true);
    }
  });

  React.useEffect(() => {
    if (hasCompleted) {
      setOverlayInteractive(true);
    }
  }, [hasCompleted]);

  const isStatic = freezeOnComplete && hasCompleted;
  const viewportValue =
    typeof viewportHeight === "number" ? `${viewportHeight}px` : viewportHeight;
  const containerHeight = `calc(${scrollHeight}px + ${viewportValue})`;
  const overlayOpacityValue = isStatic ? 1 : overlayOpacity;
  const overlayPointerEvents =
    overlayInteractive || isStatic ? "auto" : "none";

  const refProps = {
    ref: containerRef,
    style: { height: containerHeight },
    className: "relative w-full",
  };

  return (
    <div {...refProps}>
      {isStatic ? (
        <>
          <div
            className="absolute inset-0 hidden md:block bg-transparent"
            style={{
              backgroundImage: `url(${desktopImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />
          <div
            className="absolute inset-0 md:hidden bg-transparent"
            style={{
              backgroundImage: `url(${mobileImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />
        </>
      ) : (
        <SmoothScrollHeroBackground
          scrollHeight={scrollHeight}
          desktopImage={desktopImage}
          mobileImage={mobileImage}
          initialClipPercentage={initialClipPercentage}
          finalClipPercentage={finalClipPercentage}
          targetRef={containerRef}
          revealAt={revealAt}
          initialBackgroundSize={initialBackgroundSize}
          finalBackgroundSize={finalBackgroundSize}
          centerInitialFrame={centerInitialFrame}
        />
      )}
      {overlayContent ? (
        <motion.div
          className={overlayContainerClassName}
          style={{
            opacity: overlayOpacityValue,
            pointerEvents: overlayPointerEvents,
          }}
        >
          {overlayBackdropClassName ? <div className={overlayBackdropClassName} /> : null}
          <div className={overlayInnerClassName}>
            {overlayContent}
          </div>
        </motion.div>
      ) : null}
    </div>
  );
};

export default SmoothScrollHero;

