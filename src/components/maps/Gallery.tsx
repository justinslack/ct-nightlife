// components/Gallery.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ScanEye } from "lucide-react";

type GalleryProps = {
	images: string[];
	cover_image: string;
};

export default function Gallery({ images, cover_image }: GalleryProps) {
	const [selectedImage, setSelectedImage] = useState<string | null>(null);

	useEffect(() => {
		if (!selectedImage) return;
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") setSelectedImage(null);
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [selectedImage]);

	return (
		<div className="max-w-[1120px] mx-auto p-6">
			<Carousel
				opts={{
					align: "start",
					loop: true,
				}}
			>
				<CarouselContent className="h-128">
					{images.map((src, i) => (
						<CarouselItem key={i} className="relative w-full rounded-xl">
							<button key={i} onClick={() => setSelectedImage(src)} className="aspect-w-1 aspect-h-1 w-fit overflow-hidden shadow cursor-pointer group">
								<Image
									src={src}
									alt={`Gallery image ${i + 1}`}
									fill={true}
									className="object-cover"
									loading="eager"
									quality={80}
									priority={i === 0}
									decoding="async"
									placeholder="blur"
									blurDataURL={cover_image}
								/>
								<span className="absolute right-2 top-2 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 w-10 h-10">
									<ScanEye aria-label="View full size" className="text-white" strokeWidth={1} size={18} />
								</span>
							</button>
						</CarouselItem>
					))}
				</CarouselContent>
				<CarouselPrevious className="top-[calc(100%+0.5rem)] translate-y-0 left-0" />
				<CarouselNext className="top-[calc(100%+0.5rem)] translate-y-0 left-2 translate-x-full" />
			</Carousel>

			{selectedImage && (
				<div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center">
					<div className="relative">
						<button onClick={() => setSelectedImage(null)} className="absolute top-2 right-2 text-white text-xl z-10">
							&times;
						</button>
						<Image src={selectedImage} alt="Selected" width={900} height={700} className="rounded max-w-full max-h-[90vh]" />
					</div>
				</div>
			)}
		</div>
	);
}
