"use client";

import { useState, useEffect, useRef } from "react";

interface ScrambleTextProps {
  text: string;
  isScrambling: boolean;
  className?: string;
  scrambleSpeed?: number;
}

const SCRAMBLE_CHARS = "!@#$%^&*()_+-=[]{}|;:,.<>?";

export function ScrambleText({ 
  text, 
  isScrambling, 
  className = "",
  scrambleSpeed = 50,
}: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const iterationRef = useRef(0);

  useEffect(() => {
    if (isScrambling) {
      // Start scrambling
      iterationRef.current = 0;
      
      const scramble = () => {
        setDisplayText(() => {
          return text
            .split("")
            .map((char, index) => {
              if (index < iterationRef.current) {
                return text[index];
              }
              if (char === " ") return " ";
              return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
            })
            .join("");
        });

        if (iterationRef.current >= text.length) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          return;
        }

        iterationRef.current += 1 / 3;
      };

      intervalRef.current = setInterval(scramble, scrambleSpeed);
    } else {
      // Stop scrambling and resolve to original text
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setDisplayText(text);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isScrambling, text, scrambleSpeed]);

  // Reset when text changes
  useEffect(() => {
    if (!isScrambling) {
      setDisplayText(text);
    }
  }, [text, isScrambling]);

  return <span className={className}>{displayText}</span>;
} 