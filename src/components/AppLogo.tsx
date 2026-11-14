import React from 'react';

interface AppLogoProps {
  className?: string;
  size?: number;
  variant?: 'monochrome' | 'brand' | 'gold';
}

/**
 * Clean, high-contrast Fountain Pen Nib + Ruled Paper & Handwritten Flourish emblem.
 * Engineered to stay crisp at 16px favicon sizes up to 64px hero marks.
 */
export default function AppLogo({
  className = '',
  size = 28,
  variant = 'brand',
}: AppLogoProps) {
  const accentColor =
    variant === 'gold'
      ? '#C59B27'
      : variant === 'brand'
      ? '#F5C451'
      : 'currentColor';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none shrink-0 ${className}`}
      aria-label="Human Handwriting AI Logo"
    >
      {/* Crisp Ruled Notebook Sheet */}
      <rect
        x="6"
        y="5"
        width="24"
        height="30"
        rx="3.5"
        stroke="currentColor"
        strokeWidth="2.2"
      />
      {/* Red Margin Line hint */}
      <line
        x1="11.5"
        y1="6.5"
        x2="11.5"
        y2="33.5"
        stroke={accentColor}
        strokeWidth="1.6"
        strokeOpacity="0.85"
      />
      {/* Horizontal Ruled Lines */}
      <line
        x1="9"
        y1="14"
        x2="26"
        y2="14"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeOpacity="0.32"
        strokeLinecap="round"
      />
      <line
        x1="9"
        y1="20.5"
        x2="22"
        y2="20.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeOpacity="0.32"
        strokeLinecap="round"
      />
      {/* Flowing Handwritten Signature Ink Stroke */}
      <path
        d="M13 28C15.5 23.5 18 24 19 27.5C20 30 22.5 25.5 25.5 25"
        stroke={accentColor}
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Precision Fountain Pen Nib angled onto page */}
      <path
        d="M34.2 6.8L36.2 8.8C37 9.6 37 10.9 36.2 11.7L27.2 22.8L23.5 24.6L25.2 20.8L31.3 6.8C32.1 6 33.4 6 34.2 6.8Z"
        fill={accentColor}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      {/* Pen nib slit */}
      <line
        x1="25.6"
        y1="22.4"
        x2="29.4"
        y2="17.8"
        stroke="#18181B"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
