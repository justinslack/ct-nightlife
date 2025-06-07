import Link from "next/link";
import Image from "next/image";
import { X } from "lucide-react";

type MarkerPopupProps = {
	title: string;
	slug: string;
	onClose: () => void;
};

export default function MarkerPopup({ title, slug, onClose }: MarkerPopupProps) {
	return (
		<div className="flex items-center flex-row gap-2 bg-white rounded-full shadow-lg h-10 translate-x-[-20px]" onClick={(e) => e.stopPropagation()}>
			<Image src="/icons/disco-icon.svg" alt="Disco icon" className="w-10 h-10 shrink-0" height={40} width={40} />
			<div className="transition-all duration-300 opacity-0 animate-slideIn origin-left pr-4">
				<Link href={`/documents/${slug}`} className=" font-semibold text-black-700 whitespace-nowrap hover:underline">
					{title}
				</Link>
				<button onClick={onClose} className="ml-2 text-gray-400 hover:text-gray-600 text-xs font-bold transform translate-x-1" aria-label="Close popup">
					<X className="w-4 h-4" />
				</button>
			</div>
		</div>
	);
}
