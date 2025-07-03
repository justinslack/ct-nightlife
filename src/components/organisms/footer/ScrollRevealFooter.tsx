"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function ScrollRevealFooter() {
  const [scrollY, setScrollY] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);
  const [documentHeight, setDocumentHeight] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    const updateDimensions = () => {
      setWindowHeight(window.innerHeight);
      setDocumentHeight(document.documentElement.scrollHeight);
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    // Initial setup with slight delay to ensure content is loaded
    const timer = setTimeout(() => {
      updateDimensions();
      handleScroll();
    }, 100);

    // Event listeners
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updateDimensions);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateDimensions);
    };
  }, [pathname]); // Re-run when route changes

  // Additional effect to recalculate dimensions after route changes
  useEffect(() => {
    const recalculateAfterNavigation = () => {
      // Multiple checks to ensure content is fully loaded
      const checkDimensions = () => {
        const newHeight = document.documentElement.scrollHeight;
        if (newHeight !== documentHeight) {
          setDocumentHeight(newHeight);
          setWindowHeight(window.innerHeight);
        }
      };

      // Check immediately, then after short delays
      checkDimensions();
      const timer1 = setTimeout(checkDimensions, 200);
      const timer2 = setTimeout(checkDimensions, 500);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    };

    const cleanup = recalculateAfterNavigation();
    return cleanup;
  }, [pathname, documentHeight]);

  // Calculate reveal percentage based on scroll position
  const scrollableHeight = documentHeight - windowHeight;
  
  // Only start revealing when user has scrolled to the very bottom of the content
  // We subtract a small buffer (100px) to start the reveal just before the absolute bottom
  const revealTriggerPoint = Math.max(0, scrollableHeight - 100);
  
  // Calculate how much past the trigger point we've scrolled
  const pastTrigger = Math.max(0, scrollY - revealTriggerPoint);
  
  // Reveal progress: footer reveals over the last 100px of scroll
  const revealDistance = 100;
  const revealProgress = Math.min(1, pastTrigger / revealDistance);
  
  // Transform value: 0 = fully hidden, 1 = fully revealed
  const translateY = (1 - revealProgress) * 100;

  return (
    <div className="relative">
      {/* Spacer to prevent content from being hidden behind fixed footer */}
      <div className="h-96 md:h-[500px] lg:h-[600px]" />
      
      {/* Fixed footer that slides up from bottom */}
      <div 
        className="fixed bottom-0 left-0 w-full z-10 transition-transform duration-300 ease-out"
        style={{
          transform: `translateY(${translateY}%)`,
        }}
      >
        <Footer />
      </div>
    </div>
  );
} 