import { useState } from 'react';

const ImageWithFallback = ({ src, alt, className, ...props }) => {
  const [error, setError] = useState(false);
  
  // If source is already placeholder, or if error has occurred
  const imageSrc = error || !src || src === "" ? "/placeholder.jpg" : src;
  
  const handleError = () => {
    console.error(`Error loading image: ${src}`);
    // Only set error if the source wasn't already the placeholder
    if (!src.includes('/placeholder.jpg')) {
      setError(true);
    }
  };

  return (
    <img
      src={imageSrc}
      alt={alt || "Image"}
      className={className}
      onError={handleError}
      {...props}
    />
  );
};

export default ImageWithFallback;