import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";

import "@/features/bizzShorts/styles/BizzShorts.css";
import { dummyShorts } from "../data/dummyShorts";

export default function BizzShortsCarousel() {
  const [shorts, setShorts] = useState(dummyShorts);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    skipSnaps: false,
    containScroll: "trimSnaps",
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const updateScrollState = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    updateScrollState();
    emblaApi.on("select", updateScrollState);
    emblaApi.on("reInit", updateScrollState);
    return () => {
      emblaApi.off("select", updateScrollState);
      emblaApi.off("reInit", updateScrollState);
    };
  }, [emblaApi, updateScrollState]);

  const handleDelete = useCallback((id) => {
    setShorts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  useEffect(() => {
    emblaApi?.reInit();
    updateScrollState();
  }, [shorts, emblaApi, updateScrollState]);

  if (!shorts.length) return null;

  return (
    <section className="bizz-shorts">
      <header className="bizz-shorts__header">
        <div>
          <h2>বিজ শোর্টস</h2>
          <p>কৃষির দ্রুত হাইলাইটগুলো এক নজরে দেখুন</p>
        </div>
        <div className="bizz-shorts__controls">
          <button
            className="bizz-shorts__nav"
            type="button"
            onClick={scrollPrev}
            disabled={!canScrollPrev}>
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
              <polyline
                points="15 18 9 12 15 6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            className="bizz-shorts__nav"
            type="button"
            onClick={scrollNext}
            disabled={!canScrollNext}>
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
              <polyline
                points="9 6 15 12 9 18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </header>

      <div className="bizz-shorts__viewport" ref={emblaRef}>
        <div className="bizz-shorts__container">
          {shorts.map((short) => (
            <article key={short.id} className="bizz-shorts__slide">
              <div className="bizz-shorts__card">
                <img
                  src={short.mediaUrl}
                  alt={short.title}
                  loading="lazy"
                  className="bizz-shorts__image"
                />
                <div className="bizz-shorts__meta">
                  <span className="bizz-shorts__title">{short.title}</span>
                  <span className="bizz-shorts__credit">{short.photographer}</span>
                </div>
                <button
                  type="button"
                  className="bizz-shorts__delete"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleDelete(short.id);
                  }}
                  aria-label={`Remove ${short.title}`}>
                  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                    <polyline
                      points="3 6 5 6 21 6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <line
                      x1="10"
                      y1="11"
                      x2="10"
                      y2="17"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <line
                      x1="14"
                      y1="11"
                      x2="14"
                      y2="17"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
