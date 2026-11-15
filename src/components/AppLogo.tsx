import React from 'react';

interface AppLogoProps {
  className?: string;
  size?: number;
  variant?: 'monochrome' | 'brand' | 'sienna';
}

/**
 * Clean Fountain Pen Nib + Ruled Paper & Handwritten Flourish emblem.
 * Colors harmonize with Oxford Fountain Ink (#1B4965) and Warm Sienna (#E07A48).
 */
export default function AppLogo({
  className = '',
  size = 28,
  variant = 'brand',
}: AppLogoProps) {
  const accentColor =
    variant === 'sienna'
      ? '#9A4319'
      : variant === 'brand'
      ? '#B45309'
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
      {/* Margin Line */}
      <line
        x1="11.5"
        y1="6.5"
        x2="11.5"
        y2="33.5"
        stroke={accentColor}
        strokeWidth="1.6"
        strokeOpacity="0.9"
      />
      {/* Horizontal Ruled Lines */}
      <line
        x1="9"
        y1="14"
        x2="26"
        y2="14"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeOpacity="0.34"
        strokeLinecap="round"
      />
      <line
        x1="9"
        y1="20.5"
        x2="22"
        y2="20.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeOpacity="0.34"
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
      {/* Precision Fountain Pen Nib */}
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
        stroke="#1E1B18"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
