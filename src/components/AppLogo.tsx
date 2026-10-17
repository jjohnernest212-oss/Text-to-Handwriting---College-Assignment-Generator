import React from 'react';

interface AppLogoProps {
  className?: string;
  size?: number;
  variant?: 'monochrome' | 'brand' | 'amber';
}

export default function AppLogo({
  className = '',
  size = 28,
  variant = 'brand',
}: AppLogoProps) {
  // Color configuration
  const colorClass =
    variant === 'brand'
      ? 'text-white'
      : variant === 'amber'
      ? 'text-amber-400'
      : 'text-current';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none shrink-0 ${colorClass} ${className}`}
      aria-label="Text to Handwriting - Open Book with Quill Pen Logo"
    >
      <g fill="currentColor">
        {/* === CENTRAL QUILL FEATHER PEN === */}
        {/* Fountain Nib (Pointed tip pointing down to center spine) */}
        <path
          d="M256 368 L240 292 C238 282 245 272 256 272 C267 272 274 282 272 292 Z"
        />
        {/* Breather Hole and Slit */}
        <circle cx="256" cy="326" r="3" fill="#121214" />
        <line x1="256" y1="326" x2="256" y2="368" stroke="#121214" strokeWidth="2.5" />

        {/* Nib Collar / Ferrule */}
        <path
          d="M238 272 C238 266 246 262 256 262 C266 262 274 266 274 272 C274 276 266 279 256 279 C246 279 238 276 238 272 Z"
        />

        {/* Main Feather Vane & Shaft (Tilted ~35 deg to the right) */}
        <path
          d="M256 262 C251 228 259 188 277 152 C267 156 256 163 248 172 C258 144 277 121 299 101 C286 106 274 115 265 125 C279 93 306 67 340 48 C324 54 311 63 300 75 C324 45 358 24 398 12 C406 10 413 14 415 22 C416 30 411 38 404 43 C381 60 363 82 349 108 C361 102 374 97 387 95 C363 121 346 151 334 185 C345 178 358 174 371 172 C343 202 324 238 313 278 C306 272 297 267 288 264 C275 281 265 273 256 262 Z"
        />
        {/* Feather Quill Spine / Rachis Line */}
        <path
          d="M256 262 Q310 160 410 20"
          stroke="#121214"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />

        {/* === OPEN BOOK WITH FANNED PAGES === */}
        {/* Main Left Page */}
        <path
          d="M246 214 L128 162 C116 157 103 166 105 179 L138 368 C176 386 214 388 246 360 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="16"
          strokeLinejoin="round"
        />

        {/* Main Right Page */}
        <path
          d="M266 214 L384 162 C396 157 409 166 407 179 L374 368 C336 386 298 388 266 360 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="16"
          strokeLinejoin="round"
        />

        {/* Left Fanned Page 1 */}
        <path
          d="M96 226 L52 244 C41 249 35 260 37 272 L74 394 C124 428 182 436 244 420"
          fill="none"
          stroke="currentColor"
          strokeWidth="15"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Left Fanned Page 2 (Bottom layer) */}
        <path
          d="M60 300 L12 320 C2 324 -3 336 1 348 L40 436 C100 482 172 498 246 482"
          fill="none"
          stroke="currentColor"
          strokeWidth="15"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Right Fanned Page 1 */}
        <path
          d="M416 226 L460 244 C471 249 477 260 475 272 L438 394 C388 428 330 436 268 420"
          fill="none"
          stroke="currentColor"
          strokeWidth="15"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Right Fanned Page 2 (Bottom layer) */}
        <path
          d="M452 300 L500 320 C510 324 515 336 511 348 L472 436 C412 482 340 498 266 482"
          fill="none"
          stroke="currentColor"
          strokeWidth="15"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Center Spine Layers at Bottom */}
        <path
          d="M110 436 C154 470 204 484 256 484 C308 484 358 470 402 436"
          fill="none"
          stroke="currentColor"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <path
          d="M152 464 C184 486 218 496 256 496 C294 496 328 486 360 464"
          fill="none"
          stroke="currentColor"
          strokeWidth="10"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
