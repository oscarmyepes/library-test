import * as React from 'react';
import PlaceHolderImage from '../../icons/ImagePlaceHolder';

interface ImageProps {
  alt: string;
  url: string;
  className?: string;
  noImageUrl?: string;
}

const Image = ({ className, alt, url, noImageUrl }: ImageProps) => {
  const [isImageOk, setIsImageOk] = React.useState(true);

  return isImageOk && url ? (
    <img
      className={className}
      src={url}
      alt={alt}
      onError={() => setIsImageOk(false)}
    />
  ) : noImageUrl ? (
    <img src={noImageUrl} alt={alt} />
  ) : (
    <PlaceHolderImage className={className} />
  );
};

export default Image;
