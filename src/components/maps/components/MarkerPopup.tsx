import React, { memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { X } from "lucide-react";

interface MarkerPopupProps {
  title: string;
  slug: string;
  status: "Active" | "Closed";
  onClose: () => void;
}

const statusConfig = {
  Active: {
    className: "bg-green-100 border-green-300 text-green-800",
    label: "Active"
  },
    Closed: {
    className: "bg-red-100 border-red-300 text-red-800",
    label: "Closed"
  }
} as const;

export default memo<MarkerPopupProps>(function MarkerPopup({ 
  title, 
  slug, 
  status, 
  onClose 
}) {
  const statusStyle = statusConfig[status];

  return (
    <div
      className="flex flex-col gap-3 bg-white rounded-2xl shadow-lg border border-gray-200 translate-x-[-20px] transition-all duration-300 opacity-0 animate-slideIn origin-left pb-4 min-w-[200px] max-w-[280px] cursor-pointer hover:shadow-xl relative"
      onClick={(e) => e.stopPropagation()}
      role="dialog"
      aria-labelledby="popup-title"
    >
      <button 
        onClick={onClose} 
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100" 
        aria-label="Close popup"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-center gap-3 pt-3 px-4">
        <div className="flex items-center justify-center">
          <Image 
            src="/icons/disco-icon.svg" 
            alt="" 
            className="w-8 h-8 shrink-0" 
            height={32} 
            width={32}
            priority
          />
        </div>
        <h2 
          id="popup-title"
          className="text-lg font-semibold text-gray-900 line-clamp-2"
        >
          {title}
        </h2>
      </div>

      <div className="flex items-center justify-between px-4">
        <span 
          className={`px-3 py-1 rounded-full text-sm font-medium ${statusStyle.className}`}
          aria-label={`Status: ${statusStyle.label}`}
        >
          {statusStyle.label}
        </span>
        
        <Link 
          href={`/the-clubs/${slug}`} 
          className="font-semibold text-blue-600 hover:text-blue-800 hover:underline transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1"
          onClick={(e) => e.stopPropagation()}
        >
          View Details
        </Link>
      </div>
    </div>
  );
}); 