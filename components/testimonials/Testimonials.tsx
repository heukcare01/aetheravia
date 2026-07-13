"use client";

import Autoplay from "embla-carousel-autoplay";
import { Star } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import {
  Carousel as SCarousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type Testimonial = {
  id: string;
  name: string;
  role?: string;
  rating?: number; // 1..5
  quote: string;
  images?: string[];
  isVerifiedPurchase?: boolean;
};

function Stars({ value = 5 }: { value?: number }) {
  const v = Math.max(0, Math.min(5, Math.round(value)));
  return (
    <div className="flex items-center gap-1" aria-label={`${v} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < v ? "fill-yellow-400 text-yellow-400" : "text-base-content/30"}`}
        />
      ))}
    </div>
  );
}

export default function Testimonials({
  items,
  title = "What our customers say",
  heading,
  subtitle,
}: {
  items?: Testimonial[];
  title?: string;
  heading?: string;
  subtitle?: string;
}) {
  const [remote, setRemote] = useState<Testimonial[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (items && items.length) return; // external data provided
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch('/api/testimonials', { credentials: 'same-origin' })
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        if (!cancelled) setRemote(Array.isArray(data?.items) ? data.items : []);
      })
      .catch((e) => !cancelled && setError(e?.message || 'Failed to load'))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [items]);

  const data = useMemo(() => {
    if (items && items.length) return items;
    if (remote && remote.length) return remote;
    return [];
  }, [items, remote]);

  // Don't render the section at all if there are no testimonials
  if (!loading && data.length === 0) {
    return null;
  }

  return (
    <section aria-label="Testimonials" className="mt-4 md:mt-10">
      {/* Optional heading rendered inside so it hides when no data */}
      {heading && (
        <div className="space-y-2 mb-8">
          {subtitle && (
            <h3 className="font-label uppercase text-[10px] tracking-widest text-on-surface-variant">{subtitle}</h3>
          )}
          <h2 className="font-headline text-3xl md:text-4xl text-primary italic text-center">{heading}</h2>
        </div>
      )}
      <div className="mb-3 flex items-end justify-end">
        {loading && <span className="text-xs opacity-60">Loading…</span>}
        {error && <span className="text-xs text-error">{error}</span>}
      </div>
      {data.length > 0 && (
        <SCarousel
          opts={{ loop: false, align: "start", skipSnaps: false }}
          plugins={[Autoplay({ delay: 2800, stopOnMouseEnter: true, stopOnInteraction: true })]}
          className="relative"
        >
          <CarouselContent>
            {data.map((t) => (
              <CarouselItem key={t.id} className="md:basis-1/2 lg:basis-1/3">
                <article 
                  className="card shadow-md transition hover:shadow-xl h-full"
                  style={{ backgroundColor: '#9F5035', color: 'white' }}
                >
                  <div className="card-body gap-3">
                    {typeof t.rating === "number" && <Stars value={t.rating} />}
                    <p className="text-sm md:text-base leading-relaxed opacity-95">&ldquo;{t.quote}&rdquo;</p>

                    {/* Review Images */}
                    {t.images && t.images.length > 0 && (
                      <div className="flex gap-2 mt-2">
                        {t.images.slice(0, 3).map((src, idx) => (
                          <a
                            key={idx}
                            href={src}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-14 h-14 rounded-lg overflow-hidden border border-white/20 flex-shrink-0 hover:opacity-80 transition-opacity"
                          >
                            <img src={src} alt={`Review image ${idx + 1}`} className="w-full h-full object-cover" />
                          </a>
                        ))}
                        {t.images.length > 3 && (
                          <div className="w-14 h-14 rounded-lg bg-black/30 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            +{t.images.length - 3}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="mt-2 border-t border-white/20 pt-3 flex items-center justify-between">
                      <div>
                        <p className="font-bold">{t.name}</p>
                        {t.role && <p className="text-xs opacity-80">{t.role}</p>}
                      </div>
                      {t.isVerifiedPurchase && (
                        <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-medium">✓ Verified</span>
                      )}
                    </div>
                  </div>
                </article>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-3 md:-left-4" />
          <CarouselNext className="-right-3 md:-right-4" />
        </SCarousel>
      )}
    </section>
  );
}
