"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { AnimatedText } from "@/components/ui/animated-text";
import { ScrambleText } from "@/components/ui/scramble-text";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const links = [
	{ href: "/the-clubs", label: "The Clubs", description: "The spaces we cherish" },
	{ href: "/djs", label: "The DJs", description: "The sounds we love" },
	{ href: "/about", label: "Who we are", description: "What is this thing?" },
	{ href: "/contribute", label: "How to contribute", description: "Get involved" },
];

export default function MainNav() {
	const pathname = usePathname();
	const [isOpen, setIsOpen] = useState(false);
	const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
	const isHomePage = pathname === '/';

	return (
		<>
			{/* Logo for internal pages */}
			{!isHomePage && (
				<motion.div
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					className="fixed top-6 left-6 z-50"
				>
					<Link href="/" className="text-2xl font-bold text-white">
						<AnimatedText
							text="ECHOES"
							as="h1"
							className="text-2xl text-black font-100 font-archivo tracking-tight"
							startDelay={0.1}
							staggerDelay={0.05}
							duration={0.3}
							slideDistance={10}
						/>
					</Link>
				</motion.div>
			)}

			{/* Sticky Menu Button */}
			<motion.div
				whileHover={{ scale: 1.1 }}
				whileTap={{ scale: 0.9 }}
				className="fixed top-6 right-6 z-50"
			>
				<Button
					onClick={() => setIsOpen(true)}
					className="w-12 h-12 bg-teal-200 rounded-full flex items-center justify-center hover:bg-teal-300 transition-colors shadow-lg"
					aria-label="Open menu"
				>
					<div className="flex flex-col gap-1">
						<span className="w-5 h-0.5 bg-black"></span>
						<span className="w-5 h-0.5 bg-black"></span>
					</div>
				</Button>
			</motion.div>
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, y: "-100%" }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: "-100%" }}
						transition={{ duration: 0.3, ease: "easeOut" }}
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
										text="ECHOES"
										as="h1"
										className="text-4xl text-white font-100 font-archivo tracking-tight"
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
								className="w-12 h-12 bg-black rounded-full flex items-center justify-center hover:bg-yellow-200 group transition-colors"
								aria-label="Close menu"
							>
								<svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-white group-hover:text-black transition-all">
									<path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
								</svg>
							</motion.button>
						</div>

						{/* Wave Element */}
						<motion.div 
							className="absolute bottom-0 left-0 right-0 overflow-hidden"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ delay: 0.1, duration: 0.3 }}
						>
							<svg
								width="100%"
								height="60"
								viewBox="0 0 1200 60"
								className="w-full h-[60px]"
								preserveAspectRatio="none"
							>
								<motion.path
									initial={{
										d: "M0,60 Q150,10 300,30 T600,20 T900,35 T1200,15 L1200,60 Z"
									}}
									animate={{
										d: "M0,60 Q150,60 300,60 T600,60 T900,60 T1200,60 L1200,60 Z"
									}}
									exit={{
										d: "M0,60 Q150,10 300,30 T600,20 T900,35 T1200,15 L1200,60 Z"
									}}
									transition={{ 
										delay: 0.2, 
										duration: 0.4, 
										ease: "easeOut" 
									}}
									fill="rgba(20, 184, 166, 0.1)"
									stroke="rgba(20, 184, 166, 0.3)"
									strokeWidth="1"
								/>
							</svg>
						</motion.div>

						{/* Menu Content */}
						<div className="flex-1 flex flex-col justify-between px-6 md:px-8 pb-20 max-w-7xl m-auto relative z-10">
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
											onMouseEnter={() => setHoveredIndex(index)}
											onMouseLeave={() => setHoveredIndex(null)}
											className="group block text-white text-7xl transition-all font-100 font-archivo"
										>
											<div className=" flex-col flex transition-transform duration-300 group-hover:translate-x-4">
												<div className="flex items-start gap-2">
													<span className="lg:text-9xl tracking-tight">{label}</span>
													<ArrowRight className="w-8 h-8 mt-2 transition-transform duration-300 group-hover:-rotate-45" />
												</div>
												<ScrambleText 
													text={description}
													isScrambling={hoveredIndex === index}
													className="text-[1.5rem] text-yellow-200"
													scrambleSpeed={15}
												/>
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
