"use client";

import { useState, type CSSProperties } from "react";

/**
 * Image with graceful degradation: if the file is missing (assets not yet
 * fetched), renders a labeled charcoal block instead of a broken image —
 * layout and art direction stay readable while iterating.
 */
export function MediaImage({
  src,
  alt,
  label,
  className = "",
  imgClassName = "",
  loading = "lazy",
  style,
}: {
  src: string;
  alt: string;
  /** Name shown on the placeholder block when the file is absent. */
  label: string;
  className?: string;
  imgClassName?: string;
  loading?: "lazy" | "eager";
  style?: CSSProperties;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div className={`relative overflow-clip bg-surface ${className}`} style={style}>
      {failed ? (
        <div
          aria-label={alt}
          role="img"
          className="absolute inset-0 flex items-center justify-center"
          style={{
            background:
              "radial-gradient(120% 120% at 30% 20%, #1a1a21 0%, #101014 55%, #0b0b0d 100%)",
          }}
        >
          <span className="px-6 text-center text-[10px] uppercase tracking-[0.3em] text-muted">
            {label}
            <br />
            <span className="text-accent/70">npm run fetch:assets</span>
          </span>
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element -- graceful onError fallback needs a plain img
        <img
          src={src}
          alt={alt}
          loading={loading}
          decoding="async"
          onError={() => setFailed(true)}
          className={`absolute inset-0 h-full w-full object-cover ${imgClassName}`}
        />
      )}
    </div>
  );
}
