import * as React from 'react';

const PlaceHolderImage = ({ className = '' }) => (
  <svg
    version="1.1"
    viewBox="0 0 600 400"
    enableBackground="new 0 0 600 400"
    xmlSpace="preserve"
    className={className}
  >
    <rect x="0" fill="#EDECEB" width="600" height="400" />
    <path
      fill="#FFFFFF"
      d="M234.539,148.5v103h130.922v-103H234.539z M354.908,240.33H245.707v-80.661h109.201V240.33L354.908,240.33z"
    />
    <polygon
      fill="#FFFFFF"
      // eslint-disable-next-line max-len
      points="251.58,231.643 274.088,207.984 282.521,211.633 309.13,183.308 319.604,195.836 324.329,192.982   349.898,231.643 "
    />
    <circle fill="#FFFFFF" cx="277.582" cy="180.18" r="9.83" />
  </svg>
);

export default PlaceHolderImage;
