// A small hand-drawn-style globe doodle for the header's empty right side.
// The outer circle and continents are static; only the graticule (the
// wireframe latitude/longitude lines) spins, giving a lightweight "the
// globe is turning" effect without any JS animation loop — pure CSS. A
// pin marks India and pulses gently so the eye lands there first.
// Respects prefers-reduced-motion globally via the site's existing
// `* { animation: none !important }` rule in styles.css.
export function GlobeDoodle({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      aria-hidden="true"
      style={{ overflow: "visible" }}
    >
      {/* outer wobble ring — slightly irregular hand-drawn circle */}
      <circle
        cx="60"
        cy="60"
        r="42"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.85"
      />

      {/* rough doodle continents, static, roughly world-map shaped blobs */}
      <g fill="currentColor" opacity="0.18">
        <path d="M30 45 Q26 40 32 36 Q40 32 46 37 Q50 41 45 46 Q38 50 30 45Z" />
        <path d="M55 30 Q62 26 70 30 Q76 34 72 40 Q64 44 57 40 Q52 35 55 30Z" />
        <path d="M62 55 Q70 52 76 58 Q80 65 74 72 Q66 76 60 70 Q56 62 62 55Z" />
        <path d="M32 60 Q38 58 42 64 Q44 70 38 74 Q30 76 27 70 Q26 64 32 60Z" />
      </g>

      {/* spinning graticule */}
      <g className="globe-spin" style={{ transformOrigin: "60px 60px" }}>
        <ellipse
          cx="60"
          cy="60"
          rx="42"
          ry="14"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          opacity="0.5"
        />
        <ellipse
          cx="60"
          cy="60"
          rx="42"
          ry="28"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.35"
        />
        <ellipse
          cx="60"
          cy="60"
          rx="14"
          ry="42"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.35"
        />
      </g>
      <line x1="18" y1="60" x2="102" y2="60" stroke="currentColor" strokeWidth="1.2" opacity="0.5" />

      {/* pin marking India, with a gentle pulse ring */}
      <g transform="translate(68 52)">
        <circle r="7" fill="currentColor" opacity="0.25" className="globe-pulse" style={{ transformOrigin: "0px 0px" }} />
        <path
          d="M0 -9 C4.5 -9 8 -5.5 8 -1 C8 4.5 0 12 0 12 C0 12 -8 4.5 -8 -1 C-8 -5.5 -4.5 -9 0 -9Z"
          fill="#D9432A"
          stroke="currentColor"
          strokeWidth="1"
        />
        <circle r="2.4" cy="-1" fill="white" />
      </g>
    </svg>
  );
}
