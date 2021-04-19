import * as React from 'react';

interface AngleIconProps {
  className?: string;
  size?: number;
}

const Angle = ({ className = '', size = 20 }: AngleIconProps) => (
  <svg
    width={size}
    height={size}
    className={className}
    focusable="false"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path>
  </svg>
);

export default Angle;
