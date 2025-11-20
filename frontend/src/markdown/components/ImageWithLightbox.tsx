import { useState } from 'react';
import { ImageLightbox } from './ImageLightbox';

interface ImageWithLightboxProps {
  src: string;
  alt: string;
  caption?: string;
}

export function ImageWithLightbox({ src, alt, caption }: ImageWithLightboxProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <figure className="markdown-image-container">
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="markdown-image"
          onClick={() => setIsOpen(true)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setIsOpen(true);
            }
          }}
        />
        {caption && <figcaption className="markdown-image-caption">{caption}</figcaption>}
      </figure>

      <ImageLightbox src={src} alt={alt} isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
