/**
 * A small original interlocking key-fret corner motif (evoking 회문/hoemun,
 * the traditional East Asian "returning line" lattice pattern seen on
 * Korean window screens and menu borders) - cascading double-line squares
 * anchored at one corner. Not a copy of any specific reference design;
 * built from scratch as nested rectangles.
 *
 * `corner` picks which of the panel's corners this sits in and orients
 * the motif to anchor into that corner correctly.
 */
const RING_COUNT = 4;
const STEP = 11;
const OUTER = 22;
const INSET = 5;
const VIEW_SIZE = 64;

const TRANSFORMS = {
  'top-left': undefined,
  'top-right': 'scaleX(-1)',
  'bottom-left': 'scaleY(-1)',
  'bottom-right': 'scale(-1, -1)',
};

export default function CornerOrnament({ corner = 'top-left', className = '' }) {
  const rings = Array.from({ length: RING_COUNT }, (_, i) => 4 + i * STEP);

  return (
    <svg
      viewBox={`0 0 ${VIEW_SIZE} ${VIEW_SIZE}`}
      className={className}
      style={{ transform: TRANSFORMS[corner] }}
      aria-hidden="true"
    >
      {rings.map((o) => (
        <g key={o}>
          <rect
            x={o}
            y={o}
            width={OUTER}
            height={OUTER}
            fill="none"
            stroke="var(--dancheong-red-deep)"
            strokeWidth="1.4"
          />
          <rect
            x={o + INSET}
            y={o + INSET}
            width={OUTER - 2 * INSET}
            height={OUTER - 2 * INSET}
            fill="none"
            stroke="var(--dancheong-red-deep)"
            strokeWidth="1.4"
          />
        </g>
      ))}
    </svg>
  );
}
