import React from 'react';

// Cute hand-drawn SVG doodles with bouncy, friendly aesthetics
export const DoodlePaw: React.FC<{ className?: string; color?: string }> = ({
  className = 'w-6 h-6',
  color = 'currentColor',
}) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Main pad */}
    <path
      d="M24 20C18.5 20 14 24.2 14 29.5C14 34.5 18 39 24 39C30 39 34 34.5 34 29.5C34 24.2 29.5 20 24 20Z"
      fill={color}
      opacity="0.9"
    />
    {/* Inner heart in main pad */}
    <path
      d="M24 33C22.5 31.5 20 29 20 27.5C20 26 21.2 25 22.5 25C23.3 25 24 25.5 24 25.5C24 25.5 24.7 25 25.5 25C26.8 25 28 26 28 27.5C28 29 25.5 31.5 24 33Z"
      fill="#FAF8F5"
      opacity="0.85"
    />
    {/* Toe 1 */}
    <ellipse cx="14" cy="15.5" rx="3.5" ry="5" transform="rotate(-20 14 15.5)" fill={color} />
    {/* Toe 2 */}
    <ellipse cx="20.5" cy="12" rx="3.5" ry="5.5" transform="rotate(-6 20.5 12)" fill={color} />
    {/* Toe 3 */}
    <ellipse cx="27.5" cy="12" rx="3.5" ry="5.5" transform="rotate(6 27.5 12)" fill={color} />
    {/* Toe 4 */}
    <ellipse cx="34" cy="15.5" rx="3.5" ry="5" transform="rotate(20 34 15.5)" fill={color} />
  </svg>
);

export const DoodleSparkle: React.FC<{ className?: string; color?: string }> = ({
  className = 'w-5 h-5',
  color = '#F59E0B',
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M12 2C12 7.5 7.5 12 2 12C7.5 12 12 16.5 12 22C12 16.5 16.5 12 22 12C16.5 12 12 7.5 12 2Z"
      fill={color}
    />
  </svg>
);

export const DoodleBone: React.FC<{ className?: string; color?: string }> = ({
  className = 'w-7 h-7',
  color = '#E5B842',
}) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M26.5 10C27.9 10 29 8.9 29 7.5C29 6.1 27.9 5 26.5 5C25.5 5 24.6 5.6 24.2 6.5L13.8 6.5C13.4 5.6 12.5 5 11.5 5C10.1 5 9 6.1 9 7.5C9 8 9.2 8.4 9.5 8.8C9.2 9.2 9 9.6 9 10.1C9 11.5 10.1 12.6 11.5 12.6C12.5 12.6 13.4 12 13.8 11.1L24.2 11.1C24.6 12 25.5 12.6 26.5 12.6C27.9 12.6 29 11.5 29 10.1C29 9.6 28.8 9.2 28.5 8.8C28.8 8.4 29 8 29 7.5C29 6.1 27.9 5 26.5 5"
      transform="rotate(-25 18 10)"
      stroke={color}
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="currentColor"
      fillOpacity="0.15"
    />
  </svg>
);

export const DoodleScissors: React.FC<{ className?: string; color?: string }> = ({
  className = 'w-6 h-6',
  color = '#10B981',
}) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle cx="8" cy="10" r="4.5" stroke={color} strokeWidth="2.2" />
    <circle cx="8" cy="22" r="4.5" stroke={color} strokeWidth="2.2" />
    <path
      d="M11.5 12L25 24M11.5 20L25 8"
      stroke={color}
      strokeWidth="2.4"
      strokeLinecap="round"
    />
    <circle cx="16" cy="16" r="1.5" fill={color} />
  </svg>
);

export const DoodleBubbles: React.FC<{ className?: string; color?: string }> = ({
  className = 'w-8 h-8',
  color = '#38BDF8',
}) => (
  <svg
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle cx="15" cy="18" r="9" stroke={color} strokeWidth="2" strokeDasharray="3 1" fill={color} fillOpacity="0.15" />
    <circle cx="26" cy="10" r="5" stroke={color} strokeWidth="1.8" fill={color} fillOpacity="0.2" />
    <circle cx="27" cy="25" r="4" stroke={color} strokeWidth="1.6" fill={color} fillOpacity="0.12" />
    <path d="M11 14C12 12.5 14 12 15 12" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export const DoodleCrown: React.FC<{ className?: string; color?: string }> = ({
  className = 'w-6 h-6',
  color = '#F59E0B',
}) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M5 23L7 10L12 16L16 7L20 16L25 10L27 23H5Z"
      fill={color}
      fillOpacity="0.2"
      stroke={color}
      strokeWidth="2.2"
      strokeLinejoin="round"
    />
    <circle cx="7" cy="9" r="1.8" fill={color} />
    <circle cx="16" cy="6" r="1.8" fill={color} />
    <circle cx="25" cy="9" r="1.8" fill={color} />
    <path d="M7 26H25" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);

export const DoodleWavyLine: React.FC<{ className?: string; color?: string }> = ({
  className = 'w-48 h-4',
  color = '#F59E0B',
}) => (
  <svg
    viewBox="0 0 200 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    preserveAspectRatio="none"
  >
    <path
      d="M3 11C20 4 35 15 55 9C75 3 90 14 110 8C130 2 145 13 165 7C180 3 192 10 197 8"
      stroke={color}
      strokeWidth="4"
      strokeLinecap="round"
    />
  </svg>
);

export const DoodleHeart: React.FC<{ className?: string; color?: string }> = ({
  className = 'w-5 h-5',
  color = '#F43F5E',
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z"
      fill={color}
      fillOpacity="0.85"
    />
  </svg>
);

export const DoodleArrow: React.FC<{ className?: string; color?: string }> = ({
  className = 'w-10 h-10',
  color = '#F59E0B',
}) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M10 38C18 36 28 30 32 18M32 18L24 16M32 18L35 26"
      stroke={color}
      strokeWidth="3.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const DoodleHome: React.FC<{ className?: string; color?: string }> = ({
  className = 'w-6 h-6',
  color = '#143826',
}) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M16 4L4 14H8V26H24V14H28L16 4Z"
      stroke={color}
      strokeWidth="2.2"
      strokeLinejoin="round"
      fill="currentColor"
      fillOpacity="0.1"
    />
    <path d="M13 26V18H19V26" stroke={color} strokeWidth="2.2" strokeLinejoin="round" fill="white" />
    <circle cx="16" cy="11" r="2" fill={color} />
  </svg>
);

export const DoodleShield: React.FC<{ className?: string; color?: string }> = ({
  className = 'w-6 h-6',
  color = '#10B981',
}) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M16 4L6 8V16C6 22.5 10.3 26.8 16 28C21.7 26.8 26 22.5 26 16V8L16 4Z"
      stroke={color}
      strokeWidth="2.2"
      fill={color}
      fillOpacity="0.12"
    />
    <path
      d="M11 16L14.5 19.5L21 12"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
