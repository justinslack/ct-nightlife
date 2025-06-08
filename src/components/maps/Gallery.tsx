// components/Gallery.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

type GalleryProps = {
	images: string[];
};

export default function Gallery({ images }: GalleryProps) {
	const [selectedImage, setSelectedImage] = useState<string | null>(null);

	return (
		<div className="max-w-xl mx-auto p-6">
			<Carousel>
				<CarouselContent>
					{images.map((src, i) => (
						<CarouselItem key={i}>
							<button key={i} onClick={() => setSelectedImage(src)} className="aspect-w-1 aspect-h-1 w-fit overflow-hidden rounded shadow">
								<Image
									src={src}
									alt={`Gallery image ${i + 1}`}
									width={400}
									height={300}
									className="object-fill hover:scale-105 transition-transform duration-200"
								/>
							</button>
						</CarouselItem>
					))}
				</CarouselContent>
				<CarouselPrevious />
				<CarouselNext />
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
