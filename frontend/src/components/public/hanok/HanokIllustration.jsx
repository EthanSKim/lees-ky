import { useEffect, useRef, useState } from 'react';
import './HanokIllustration.css';

/**
 * An original flat-illustration of a hanok (traditional Korean house),
 * built from what actually defines the form rather than generic "Asian
 * house" clip art:
 *  - 기와 (giwa): the curved clay-tile roof with its signature upward
 *    eave lift at each end
 *  - 처마 (cheoma): the deep eave overhang
 *  - 기둥 (gidung): exposed wood pillars and beam, "like a piece of
 *    furniture" rather than hidden structure
 *  - 창호지/한지 (hanji lattice doors): grid-latticed panels that glow
 *    warmly when lit from within - the detail that makes a hanok feel
 *    inhabited rather than a museum piece
 *  - 기단 (gidan): the stone foundation
 *  - 마당 (madang): the courtyard ground it sits on
 *
 * Animates in on mount/scroll-into-view: roof settles first, then the
 * frame, then the lattice doors, then the glow breathes and the lanterns
 * sway gently. All continuous motion is skipped under prefers-reduced-motion
 * (see HanokIllustration.css) - only a simple fade-in remains.
 */
export default function HanokIllustration() {
  const containerRef = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={`hanok-illustration ${inView ? 'in-view' : ''}`}>
      <svg
        viewBox="0 0 1200 600"
        role="img"
        aria-label="Illustration of a traditional Korean hanok house"
      >
        <defs>
          <radialGradient id="hanokGlow" cx="50%" cy="40%" r="65%">
            <stop offset="0%" stopColor="#F7D9A0" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#F7D9A0" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="hanokGround" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#DCCBA6" />
            <stop offset="100%" stopColor="#CBB78D" />
          </linearGradient>
        </defs>

        <ellipse
          className="hanok-glow"
          cx="600"
          cy="380"
          rx="420"
          ry="160"
          fill="url(#hanokGlow)"
        />

        <rect
          className="hanok-ground"
          x="0"
          y="478"
          width="1200"
          height="122"
          fill="url(#hanokGround)"
        />

        {/* Roof */}
        <g className="hanok-roof">
          <path
            d="M 90,270 C 100,190 190,150 300,165 C 400,178 480,150 600,148
               C 720,150 800,178 900,165 C 1010,150 1100,190 1110,270
               C 1060,225 970,200 900,205 C 800,215 700,195 600,195
               C 500,195 400,215 300,205 C 230,200 140,225 90,270 Z"
            fill="#2B2622"
          />
          <g fill="none" stroke="#453B32" strokeWidth="2" opacity="0.5">
            <path d="M 110,250 C 130,190 210,160 310,173 C 400,184 480,160 600,158 C 720,160 800,184 890,173 C 990,160 1070,190 1090,250" />
            <path d="M 130,232 C 150,182 220,168 315,178 C 400,188 480,168 600,166 C 720,168 800,188 885,178 C 980,168 1050,182 1070,232" />
          </g>
          <path
            d="M 300,165 C 400,178 480,150 600,148 C 720,150 800,178 900,165"
            fill="none"
            stroke="#5A4C3F"
            strokeWidth="3"
            opacity="0.7"
            strokeLinecap="round"
          />
          <ellipse cx="93" cy="269" rx="10" ry="7" fill="#211E1A" />
          <ellipse cx="1107" cy="269" rx="10" ry="7" fill="#211E1A" />
        </g>

        {/* Beam */}
        <rect className="hanok-beam" x="140" y="270" width="920" height="14" fill="#6E4A2C" />

        {/* Lattice door bays */}
        <g className="hanok-bays">
          <g fill="#FFFCF5">
            <rect x="168" y="284" width="182" height="170" />
            <rect x="368" y="284" width="223" height="170" />
            <rect x="609" y="284" width="223" height="170" />
            <rect x="850" y="284" width="182" height="170" />
          </g>
          <g stroke="#B99A6B" strokeWidth="2.5">
            <line x1="213" y1="284" x2="213" y2="454" />
            <line x1="259" y1="284" x2="259" y2="454" />
            <line x1="305" y1="284" x2="305" y2="454" />
            <line x1="168" y1="332" x2="350" y2="332" />
            <line x1="168" y1="380" x2="350" y2="380" />
            <line x1="168" y1="428" x2="350" y2="428" />

            <line x1="424" y1="284" x2="424" y2="454" />
            <line x1="479" y1="284" x2="479" y2="454" />
            <line x1="535" y1="284" x2="535" y2="454" />
            <line x1="368" y1="332" x2="591" y2="332" />
            <line x1="368" y1="380" x2="591" y2="380" />
            <line x1="368" y1="428" x2="591" y2="428" />

            <line x1="665" y1="284" x2="665" y2="454" />
            <line x1="720" y1="284" x2="720" y2="454" />
            <line x1="776" y1="284" x2="776" y2="454" />
            <line x1="609" y1="332" x2="832" y2="332" />
            <line x1="609" y1="380" x2="832" y2="380" />
            <line x1="609" y1="428" x2="832" y2="428" />

            <line x1="895" y1="284" x2="895" y2="454" />
            <line x1="941" y1="284" x2="941" y2="454" />
            <line x1="987" y1="284" x2="987" y2="454" />
            <line x1="850" y1="332" x2="1032" y2="332" />
            <line x1="850" y1="380" x2="1032" y2="380" />
            <line x1="850" y1="428" x2="1032" y2="428" />
          </g>
          <g fill="none" stroke="#8A5A34" strokeWidth="3">
            <rect x="168" y="284" width="182" height="170" />
            <rect x="368" y="284" width="223" height="170" />
            <rect x="609" y="284" width="223" height="170" />
            <rect x="850" y="284" width="182" height="170" />
          </g>
        </g>

        {/* Pillars */}
        <g className="hanok-pillars" fill="#8A5A34">
          <rect x="150" y="270" width="18" height="184" />
          <rect x="350" y="270" width="18" height="184" />
          <rect x="591" y="270" width="18" height="184" />
          <rect x="832" y="270" width="18" height="184" />
          <rect x="1032" y="270" width="18" height="184" />
        </g>

        {/* Stone base */}
        <rect className="hanok-base" x="90" y="454" width="1020" height="24" fill="#B7AFA0" />

        {/* Lanterns */}
        <g className="hanok-lantern hanok-lantern-left">
          <line x1="220" y1="284" x2="220" y2="310" stroke="#8A5A34" strokeWidth="2" />
          <ellipse cx="220" cy="326" rx="14" ry="18" fill="#9E2B25" />
          <ellipse
            cx="220"
            cy="326"
            rx="14"
            ry="18"
            fill="none"
            stroke="#C08A2E"
            strokeWidth="1.5"
          />
        </g>
        <g className="hanok-lantern hanok-lantern-right">
          <line x1="960" y1="284" x2="960" y2="310" stroke="#8A5A34" strokeWidth="2" />
          <ellipse cx="960" cy="326" rx="14" ry="18" fill="#9E2B25" />
          <ellipse
            cx="960"
            cy="326"
            rx="14"
            ry="18"
            fill="none"
            stroke="#C08A2E"
            strokeWidth="1.5"
          />
        </g>
      </svg>
    </div>
  );
}
