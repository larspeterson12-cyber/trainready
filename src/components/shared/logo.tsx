export function Logo({ size = 56 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="-56 -56 112 112"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Circle background */}
      <circle cx="0" cy="0" r="54" fill="#1a1a1a" stroke="#dc2626" strokeWidth="2" />
      {/* Dumbbell - left plates */}
      <rect x="-34" y="-7" width="5" height="14" rx="1.5" fill="white" />
      <rect x="-28" y="-10" width="8" height="20" rx="2" fill="#dc2626" />
      <rect x="-19" y="-6" width="5" height="12" rx="1.5" fill="white" opacity="0.9" />
      {/* Bar */}
      <rect x="-14" y="-3" width="28" height="6" rx="3" fill="white" opacity="0.7" />
      {/* Dumbbell - right plates */}
      <rect x="14" y="-6" width="5" height="12" rx="1.5" fill="white" opacity="0.9" />
      <rect x="20" y="-10" width="8" height="20" rx="2" fill="#dc2626" />
      <rect x="29" y="-7" width="5" height="14" rx="1.5" fill="white" />
      {/* Heartbeat line */}
      <polyline
        points="-40,0 -28,0 -14,0 -6,-16 2,14 10,-6 15,5 20,0 28,0 40,0"
        fill="none"
        stroke="#dc2626"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
