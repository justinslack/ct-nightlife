"use client";

import { motion } from "motion/react";

interface AnimatedTextProps {
  text: string;
  className?: string;
  startDelay?: number;
  staggerDelay?: number;
  duration?: number;
  slideDistance?: number;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";
}

export function AnimatedText({
  text,
  className = "",
  startDelay = 0,
  staggerDelay = 0.05,
  duration = 0.6,
  slideDistance = 100,
  as: Component = "div"
}: AnimatedTextProps) {
  return (
    <Component className={className}>
      {text.split("").map((letter, index) => (
        <motion.span
          key={index}
          initial={{ y: slideDistance, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ 
            delay: startDelay + index * staggerDelay, 
            duration: duration,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
          className="inline-block"
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </Component>
  );
} 