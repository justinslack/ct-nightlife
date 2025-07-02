"use client";

import { useEffect, useState, memo, useCallback } from "react";
import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ScanEye, X } from "lucide-react";

interface GalleryProps {
  images: string[];
  cover_image: string;
  className?: string;
}

const GalleryItem = memo<{
  src: string;
  index: number;
  coverImage: string;
  onImageClick: (src: string) => void;
}>(({ src, index, coverImage, onImageClick }) => (
  <CarouselItem className="relative w-full rounded-xl">
    <button 
      onClick={() => onImageClick(src)} 
      className="aspect-square w-full overflow-hidden shadow-md cursor-pointer group relative rounded-xl"
      aria-label={`View image ${index + 1} in full size`}
    >
      <Image
        src={src}
        alt={`Gallery image ${index + 1}`}
        fill
        className="object-cover transition-transform duration-200 group-hover:scale-105"
        loading={index < 2 ? "eager" : "lazy"}
        quality={80}
        priority={index === 0}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        placeholder="blur"
        blurDataURL={coverImage}
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
      <span className="absolute right-2 top-2 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 w-10 h-10 rounded-full backdrop-blur-sm">
        <ScanEye aria-label="View full size" className="text-white" strokeWidth={1.5} size={18} />
      </span>
    </button>
  </CarouselItem>
));

GalleryItem.displayName = "GalleryItem";

const ImageModal = memo<{
  src: string;
  onClose: () => void;
}>(({ src, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="relative max-w-[90vw] max-h-[90vh]">
        <button 
          onClick={onClose} 
          className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors z-10"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>
        <Image 
          src={src} 
          alt="Selected image" 
          width={900} 
          height={700} 
          className="rounded-lg max-w-full max-h-[90vh] object-contain" 
          priority
        />
      </div>
    </div>
  );
});

ImageModal.displayName = "ImageModal";

export default memo<GalleryProps>(function Gallery({ 
  images, 
  cover_image, 
  className = "" 
}) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageClick = useCallback((src: string) => {
    setSelectedImage(src);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedImage(null);
  }, []);

  if (!images?.length) {
    return (
      <div className="max-w-[1120px] mx-auto p-6">
        <div className="text-center text-gray-500">No images available</div>
      </div>
    );
  }

  return (
    <div className={`max-w-[1120px] mx-auto p-6 ${className}`}>
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="h-128">
          {images.map((src, index) => (
            <GalleryItem
              key={`${src}-${index}`}
              src={src}
              index={index}
              coverImage={cover_image}
              onImageClick={handleImageClick}
            />
          ))}
        </CarouselContent>
        <CarouselPrevious className="top-[calc(100%+0.5rem)] translate-y-0 left-0" />
        <CarouselNext className="top-[calc(100%+0.5rem)] translate-y-0 left-12" />
      </Carousel>

      {selectedImage && (
        <ImageModal src={selectedImage} onClose={handleCloseModal} />
      )}
    </div>
  );
}); 