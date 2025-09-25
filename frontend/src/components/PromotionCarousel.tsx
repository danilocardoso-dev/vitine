// src/components/PromotionCarousel.tsx
import React, { useEffect, useRef, useState } from "react";

type Slide = { id: string; imageUrl: string; alt?: string; link?: string };

export default function PromotionCarousel({
  slides,
  autoplay = true,
  interval = 4000,
}: {
  slides: Slide[];
  autoplay?: boolean;
  interval?: number;
}) {
  const [index, setIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const autoplayRef = useRef<number | null>(null);

  // Pointer/drag state
  const dragging = useRef(false);
  const startX = useRef(0);
  const deltaX = useRef(0);

  useEffect(() => {
    if (!autoplay || slides.length <= 1) return;
    autoplayRef.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, interval);
    return () => {
      if (autoplayRef.current) window.clearInterval(autoplayRef.current);
    };
  }, [autoplay, slides.length, interval]);

  useEffect(() => {
    // stop autoplay while dragging
    if (dragging.current && autoplayRef.current) {
      window.clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
  }, []);

  const prev = () => setIndex((i) => Math.max(0, i - 1));
  const next = () => setIndex((i) => (i + 1) % slides.length);

  // Pointer handlers for swipe
  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    startX.current = e.clientX;
    deltaX.current = 0;
    (e.target as Element).setPointerCapture(e.pointerId);
    // pause autoplay while interacting
    if (autoplayRef.current) {
      window.clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    deltaX.current = e.clientX - startX.current;
    // move track visually while dragging
    if (trackRef.current) {
      trackRef.current.style.transition = "none";
      trackRef.current.style.transform = `translateX(calc(${-index * 100}% + ${deltaX.current}px))`;
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    dragging.current = false;
    (e.target as Element).releasePointerCapture(e.pointerId);

    const threshold = 60; // px
    if (deltaX.current > threshold) {
      // swipe right -> previous
      setIndex((i) => Math.max(0, i - 1));
    } else if (deltaX.current < -threshold) {
      // swipe left -> next
      setIndex((i) => (i + 1) % slides.length);
    } else {
      // small movement -> snap back (by forcing re-render)
      setIndex((i) => i);
    }

    // restore transition
    if (trackRef.current) {
      trackRef.current.style.transition = "";
      trackRef.current.style.transform = "";
    }

    // resume autoplay
    if (autoplay && slides.length > 1 && !autoplayRef.current) {
      autoplayRef.current = window.setInterval(() => {
        setIndex((i) => (i + 1) % slides.length);
      }, interval);
    }
  };

  return (
    <section className="relative w-full">
      {/* wrapper: overflow-hidden removes native scrollbars */}
      <div
        className="overflow-hidden w-full relative"
        aria-roledescription="carousel"
        aria-label="Promoções"
      >
        <div
          ref={trackRef}
          // track is wide: each slide is 100% of wrapper
          className="flex w-full"
          style={{
            transform: `translateX(-${index * 100}%)`,
            transition: "transform 420ms ease",
            touchAction: "pan-y", // allows horizontal pointer handling here
            userSelect: "none",
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {slides.map((s) => (
            <a
              key={s.id}
              href={s.link ?? "#"}
              className="flex-shrink-0 w-full"
              aria-hidden={false}
            >
              <img
                src={s.imageUrl}
                alt={s.alt ?? ""}
                loading="lazy"
                className="w-full h-52 md:h-96 object-cover block"
                draggable={false}
              />
            </a>
          ))}
        </div>
      </div>

      {/* Left / Right buttons */}
      <button
        aria-label="Anterior"
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/50 text-white focus:outline-none"
        disabled={index === 0}
      >
        ‹
      </button>

      <button
        aria-label="Próximo"
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/50 text-white focus:outline-none"
      >
        ›
      </button>

      {/* Indicators */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            aria-label={`Ir para slide ${i + 1}`}
            aria-current={i === index}
            onClick={() => setIndex(i)}
            className={`w-3 h-3 rounded-full ${i === index ? "bg-destaque" : "bg-white/50"}`}
          />
        ))}
      </div>
    </section>
  );
}