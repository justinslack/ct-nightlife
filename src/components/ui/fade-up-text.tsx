"use client";

import { motion } from "motion/react";

interface FadeUpTextProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  slideDistance?: number;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";
}

export function FadeUpText({
  children,
  className = "",
  delay = 0,
  duration = 0.6,
  slideDistance = 30,
  as: Component = "div"
}: FadeUpTextProps) {
  const MotionComponent = motion(Component);
  
  return (
    <MotionComponent
      initial={{ y: slideDistance, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ 
        delay: delay, 
        duration: duration,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className={className}
    >
      {children}
    </MotionComponent>
  );
} 