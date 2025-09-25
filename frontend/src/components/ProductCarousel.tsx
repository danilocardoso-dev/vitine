// src/components/ProductCarousel.tsx
import React, { useEffect, useRef, useState } from "react";
import ProductCard from "./ProductCard";

type Produto = any;

export default function ProductCarousel({ items, title }: { items: Produto[]; title?: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [index, setIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(1);
  const itemWidthRef = useRef(256); // fallback in px (w-64 ~= 256px)
  const gapRef = useRef(16); // gap-4 = 1rem = usually 16px

  // Measure container and first item to compute itemsPerPage
  useEffect(() => {
    const measure = () => {
      const container = containerRef.current;
      const track = trackRef.current;
      if (!container || !track) return;

      // measure first child width + gap
      const first = track.querySelector<HTMLElement>(".carousel-item");
      if (first) {
        const rect = first.getBoundingClientRect();
        const style = window.getComputedStyle(track);
        // gap is set by CSS via gap; we will use a fixed fallback if not available
        const gap = parseFloat(style.columnGap || style.gap || "") || gapRef.current;
        itemWidthRef.current = Math.round(rect.width);
        gapRef.current = gap;
      }

      const containerW = container.getBoundingClientRect().width;
      const step = itemWidthRef.current + gapRef.current;
      const perPage = Math.max(1, Math.floor((containerW + gapRef.current) / step));
      setItemsPerPage(perPage);

      // Ensure index is within bounds after resize
      const maxIndex = Math.max(0, Math.ceil(items.length / perPage) - 1);
      setIndex((i) => Math.min(i, maxIndex));
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [items.length]);

  const maxIndex = Math.max(0, Math.ceil(items.length / itemsPerPage) - 1);

  const prev = () => setIndex((i) => Math.max(0, i - 1));
  const next = () => setIndex((i) => Math.min(maxIndex, i + 1));

  // Pointer/drag support (similar approach)
  const dragging = useRef(false);
  const startX = useRef(0);
  const deltaX = useRef(0);

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    startX.current = e.clientX;
    deltaX.current = 0;
    (e.target as Element).setPointerCapture(e.pointerId);
    if (trackRef.current) trackRef.current.style.transition = "none";
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    deltaX.current = e.clientX - startX.current;
    if (trackRef.current) {
      const translate = -index * (itemWidthRef.current + gapRef.current) + deltaX.current;
      trackRef.current.style.transform = `translateX(${translate}px)`;
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    dragging.current = false;
    (e.target as Element).releasePointerCapture(e.pointerId);
    if (trackRef.current) trackRef.current.style.transition = "";

    const threshold = 60;
    if (deltaX.current > threshold) {
      // swipe right -> previous page
      prev();
    } else if (deltaX.current < -threshold) {
      // swipe left -> next page
      next();
    } else {
      // snap back to current
      setIndex((i) => i);
    }
  };

  // update track transform when index changes
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const translate = -index * (itemWidthRef.current + gapRef.current);
    track.style.transform = `translateX(${translate}px)`;
    track.style.transition = "transform 420ms ease";
  }, [index]);

  return (
    <section className="py-6">
      {title && <h3 className="text-white text-lg mb-3">{title}</h3>}

      <div className="relative">
        {/* viewport hides native scrollbar */}
        <div ref={containerRef} className="overflow-hidden w-full">
          <div
            ref={trackRef}
            className="flex items-start gap-4"
            style={{
              transform: `translateX(${-index * (itemWidthRef.current + gapRef.current)}px)`,
              transition: "transform 420ms ease",
              touchAction: "pan-y",
              userSelect: "none",
            }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            {items.map((p: Produto) => (
              <div
                key={p.id}
                className="carousel-item flex-none w-64" /* w-64 padrão (256px) */
                style={{ scrollSnapAlign: "start" }}
              >
                <ProductCard produto={p} />
              </div>
            ))}
          </div>
        </div>

        {/* Lateral buttons */}
        <button
          aria-label="Scroll left"
          onClick={prev}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-1 bg-black/40 rounded-full hidden md:flex"
          disabled={index === 0}
        >
          ‹
        </button>

        <button
          aria-label="Scroll right"
          onClick={next}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-1 bg-black/40 rounded-full hidden md:flex"
          disabled={index >= maxIndex}
        >
          ›
        </button>
      </div>
    </section>
  );
}