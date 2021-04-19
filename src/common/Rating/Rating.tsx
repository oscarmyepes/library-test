import * as React from 'react';
import StarIcon from '../../icons/StarIcon';

interface RatingProps {
  value: number;
  className?: string;
}

const Rating = ({ value, className }: RatingProps) => (
  <div className={className}>
    {Array.from({ length: 5 }).map((_, index) => (
      <StarIcon key={index} filled={value > index} />
    ))}
  </div>
);

export default Rating;
