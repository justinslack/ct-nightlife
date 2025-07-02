"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { AnimatedText } from "@/components/ui/animated-text";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const links = [
	{ href: "/documents", label: "The Clubs", description: "The spaces we cherish" },
	{ href: "/djs", label: "The DJs", description: "The sounds we love" },
	{ href: "/about", label: "Who we are", description: "What is this thing?" },
	{ href: "/contribute", label: "How to contribute", description: "Get involved" },
];

export default function MainNav() {
	const pathname = usePathname();
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			{/* Main Header */}
			<header className="bg-transparent absolute top-0 left-0 right-0 z-50">
				<div className="flex items-center justify-between p-6 md:px-8 w-full">
					<Button
						onClick={() => setIsOpen(true)}
						className="ml-auto w-12 h-12 bg-teal-200 rounded-full flex items-center justify-center hover:bg-teal-300 transition-colors"
						aria-label="Open menu"
					>
						<div className="flex flex-col gap-1">
							<span className="w-5 h-0.5 bg-black"></span>
							<span className="w-5 h-0.5 bg-black"></span>
						</div>
					</Button>
				</div>
			</header>
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.3 }}
						className="fixed inset-0 bg-black z-[100] flex flex-col"
					>
						{/* Menu Header */}
						<div className="flex items-center justify-between p-6 md:px-8">
							{/* Logo */}
							<motion.div 
								initial={{ x: -20, opacity: 0 }}
								animate={{ x: 0, opacity: 1 }}
								transition={{ delay: 0.1, duration: 0.3 }}
								className="text-2xl font-bold text-white"
							>
								<Link href="/" onClick={() => setIsOpen(false)}>							
									<AnimatedText
										text="Echoes"
										as="h1"
										className="text-4xl text-white font-archivo font-light"
										startDelay={0.5}
										staggerDelay={0.1}
										duration={0.3}
										slideDistance={20}
									/>
								</Link>
							</motion.div>

							{/* Close Button */}
							<motion.button
								initial={{ x: 20, opacity: 0 }}
								animate={{ x: 0, opacity: 1 }}
								transition={{ delay: 0.1, duration: 0.3 }}
								onClick={() => setIsOpen(false)}
								className="w-12 h-12 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
								aria-label="Close menu"
							>
								<svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-white">
									<path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
								</svg>
							</motion.button>
						</div>

						{/* Menu Content */}
						<div className="flex-1 flex flex-col justify-between px-6 md:px-8 pb-20 max-w-7xl m-auto">
							{/* Navigation Links */}
							<motion.nav 
								initial={{ y: 20, opacity: 0 }}
								animate={{ y: 0, opacity: 1 }}
								transition={{ delay: 0.2, duration: 0.3 }}
								className="flex flex-col gap-12 mt-12"
							>
								
								{links.map(({ href, label, description }, index) => (
									<motion.div
										key={href}
										initial={{ x: -20, opacity: 0 }}
										animate={{ x: 0, opacity: 1 }}
										transition={{ delay: 0.3 + index * 0.1, duration: 0.3 }}
									>
										<Link
											href={href}
											onClick={() => setIsOpen(false)}
											className="group block text-white text-7xl transition-all font-archivo font-light"
										>
											<div className=" flex-col flex transition-transform duration-300 group-hover:translate-x-4">
												<div className="flex items-start gap-2">
													<span className="text-7xl">{label}</span>
													<ArrowRight className="w-8 h-8 mt-2 transition-transform duration-300 group-hover:-rotate-45" />
												</div>
												<span className="text-[1.5rem] text-yellow-200">{description}</span>
											</div>
										</Link>
									</motion.div>
								))}
							</motion.nav>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}
