import Link from "next/link";
import Image from "next/image";
import { X } from "lucide-react";

type MarkerPopupProps = {
	title: string;
	slug: string;
	onClose: () => void;
	status: "active" | "closed";
};

export default function MarkerPopup({ title, slug, onClose, status }: MarkerPopupProps) {
	const bgColor = status === "closed" ? "bg-red-100 border-red-300 text-red-800" : "bg-green-100 border-green-300 text-green-800";
	return (
		<div
			className="flex flex-col gap-3 bg-white rounded-[1.35rem] shadow-lg translate-x-[-20px] transition-all duration-300 opacity-0 animate-slideIn origin-left width-fit pb-4 min-w-[200px] max-w-fit cursor-pointer hover:shadow-xl relative"
			onClick={(e) => e.stopPropagation()}
		>
			<div className="flex items-center gap-1">
				<div className="flex items-center p-[6px]">
					<Image src="/icons/disco-icon.svg" alt="Disco icon" className="w-8 h-8 shrink-0" height={40} width={40} />
				</div>
				<h2 className="text-lg font-semibold pt-0.5">{title}</h2>
			</div>
			<div className="flex items-center justify-between px-4 text-gray-500 font-semibold">
				<span className={`px-2 rounded-lg text-[14px] ${bgColor}`}>{status}</span>
				<Link href={`/documents/${slug}`} className=" font-semibold text-black-700 whitespace-nowrap hover:underline">
					View
				</Link>
			</div>
			<button onClick={onClose} className="ml-2 text-gray-400 hover:text-gray-600 text-xs font-bold absolute top-2 right-2" aria-label="Close popup">
				<X className="w-4 h-4" />
			</button>
		</div>
	);
}
