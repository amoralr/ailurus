import { useState, useEffect } from 'react';
import { ImageLightbox } from './ImageLightbox';

interface ImageData {
  src: string;
  alt: string;
}

export function ImageLightboxController() {
  const [isOpen, setIsOpen] = useState(false);
  const [imageData, setImageData] = useState<ImageData>({ src: '', alt: '' });

  useEffect(() => {
    const handleOpenLightbox = (event: Event) => {
      const customEvent = event as CustomEvent<ImageData>;
      setImageData(customEvent.detail);
      setIsOpen(true);
    };

    window.addEventListener('openImageLightbox', handleOpenLightbox);
    return () => window.removeEventListener('openImageLightbox', handleOpenLightbox);
  }, []);

  return (
    <ImageLightbox
      src={imageData.src}
      alt={imageData.alt}
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
    />
  );
}
