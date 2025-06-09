"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import clsx from "clsx";

const links = [
	{ href: "/", label: "Home" },
	{ href: "/documents", label: "All Clubs" },
	{ href: "/djs", label: "The DJs" },
	{ href: "/contribute", label: "Contribute" },
];

export default function MainNav() {
	const pathname = usePathname();
	const [isOpen, setIsOpen] = useState(false);

	return (
		<header className="bg-white border-b">
			<div className="flex items-center justify-between p-4 md:px-8">
				<div className="text-lg font-bold">
					<Link href="/">MySite</Link>
				</div>

				{/* Desktop Nav */}
				<nav className="hidden md:flex gap-6">
					{links.map(({ href, label }) => (
						<Link key={href} href={href} className={clsx("text-gray-700 hover:text-black transition", pathname === href && "font-semibold underline")}>
							{label}
						</Link>
					))}
				</nav>

				{/* Mobile toggle */}
				<button className="md:hidden" onClick={() => setIsOpen((prev) => !prev)} aria-label="Toggle menu">
					{isOpen ? <X size={24} /> : <Menu size={24} />}
				</button>
			</div>

			{/* Mobile Nav Menu */}
			{isOpen && (
				<nav className="md:hidden px-4 pb-4 space-y-2">
					{links.map(({ href, label }) => (
						<Link
							key={href}
							href={href}
							onClick={() => setIsOpen(false)}
							className={clsx("block text-gray-700 hover:text-black transition", pathname === href && "font-semibold underline")}
						>
							{label}
						</Link>
					))}
				</nav>
			)}
		</header>
	);
}
