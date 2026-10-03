export default function Pumpkin({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 1000 700"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="flame" cx="50%" cy="58%" r="60%">
          <stop offset="0%" stopColor="#ffd27a" />
          <stop offset="35%" stopColor="#ff8a3d" />
          <stop offset="75%" stopColor="#d6361a" />
          <stop offset="100%" stopColor="#5c0f06" />
        </radialGradient>
        <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
        <filter id="halo" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="46" />
        </filter>
      </defs>

      <g fill="url(#flame)">
        <g filter="url(#halo)" opacity="0.75">
          <path d="M150 265 L390 130 L425 315 Z" />
          <path d="M850 265 L610 130 L575 315 Z" />
          <path d="M110 405 L195 455 L250 410 L305 465 L365 415 L430 475 L500 420 L570 475 L635 415 L695 465 L750 410 L805 455 L890 405 L850 525 L775 590 L705 545 L640 620 L575 560 L500 630 L425 560 L360 620 L295 545 L225 590 L150 525 Z" />
        </g>
        <g filter="url(#soft)">
          <path d="M150 265 L390 130 L425 315 Z" />
          <path d="M850 265 L610 130 L575 315 Z" />
          <path d="M110 405 L195 455 L250 410 L305 465 L365 415 L430 475 L500 420 L570 475 L635 415 L695 465 L750 410 L805 455 L890 405 L850 525 L775 590 L705 545 L640 620 L575 560 L500 630 L425 560 L360 620 L295 545 L225 590 L150 525 Z" />
        </g>
      </g>
    </svg>
  );
}
