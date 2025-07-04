"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useAnimation } from "motion/react";
import { Music } from "lucide-react";
import { usePathname } from "next/navigation";

interface WavyToggleButtonProps {
  audioSrc?: string;
  className?: string;
}

export default function WavyToggleButton({ 
  audioSrc = "/media/AboveSmoke-SaveUs.mp3", // Fixed: was pointing to video file
  className = ""
}: WavyToggleButtonProps) {
  const pathname = usePathname();
  const [isWavy, setIsWavy] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [audioInitialized, setAudioInitialized] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const controls = useAnimation();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isHomePage = pathname === '/';

  const straightPath = "M 20 50 H 80";
  
  // Create multiple wave phases for smooth animation
  const createWavyPath = (phase: number) => {
    const amplitude = 8;
    return `M20,50 Q${30 + amplitude * Math.sin(phase)},${50 + amplitude * Math.cos(phase)} 40,50 T${60 + amplitude * Math.sin(phase + Math.PI)},${50 + amplitude * Math.cos(phase + Math.PI)} T80,50`;
  };

  // Track mouse position for tooltip
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    if (isHovered) {
      document.addEventListener('mousemove', handleMouseMove);
      return () => document.removeEventListener('mousemove', handleMouseMove);
    }
  }, [isHovered]);

  // Track scroll position (only on home page)
  useEffect(() => {
    if (!isHomePage) {
      setIsScrolled(true); // Always "scrolled" on non-home pages
      return;
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  // Initialize audio only when needed (lazy loading)
  const initializeAudio = () => {
    if (!audioInitialized && audioSrc) {
      audioRef.current = new Audio(audioSrc);
      audioRef.current.loop = true;
      audioRef.current.preload = "none"; // Don't preload audio
      
      // Handle audio events
      const audio = audioRef.current;
      
      const handleEnded = () => setIsPlaying(false);
      const handleError = () => {
        console.error('Audio failed to load:', audioSrc);
        setIsPlaying(false);
      };
      
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('error', handleError);
      
      setAudioInitialized(true);
    }
  };

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (isWavy) {
      const animateWave = async () => {
        await controls.start({
          d: [
            createWavyPath(0),
            createWavyPath(Math.PI / 2),
            createWavyPath(Math.PI),
            createWavyPath(3 * Math.PI / 2),
            createWavyPath(2 * Math.PI),
          ],
          transition: {
            duration: 2,
            ease: "linear",
            repeat: Infinity,
          },
        });
      };
      animateWave();
    } else {
      // Return to straight line
      controls.start({
        d: straightPath,
        transition: {
          duration: 0.6,
          ease: [0.4, 0, 0.2, 1],
        },
      });
    }
  }, [isWavy, controls]);

  const handleClick = async () => {
    const newWavyState = !isWavy;
    setIsWavy(newWavyState);
    
    if (newWavyState) {
      // Initialize audio on first click
      initializeAudio();
      
      // Try to play audio
      if (audioRef.current) {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
        } catch (error) {
          console.error('Failed to play audio:', error);
        }
      }
    } else if (audioRef.current && isPlaying) {
      // Stop playing audio
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  return (
    <>
      <motion.button
        type="button"
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label={`Toggle wavy animation${isPlaying ? ' and audio' : ''}`}
        animate={{
          x: isScrolled ? 0 : 0,
          y: isScrolled ? 0 : 0,
          scale: isScrolled ? 0.8 : 1,
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
        className={`fixed z-40 w-12 h-12 rounded-full flex items-center justify-center border transition-all duration-300 ${
          isScrolled 
            ? 'top-6 right-20 bg-teal-200 border-teal-300 shadow-lg' 
            : 'bottom-6 right-6 bg-transparent backdrop-blur-sm border-white shadow-lg'
        } ${
          isPlaying ? 'ring-2 ring-yellow-200 border-0' : ''
        } ${className}`}
      >
        <svg viewBox="0 0 100 100" className="w-8 h-8">
          <motion.path
            d={straightPath}
            fill="transparent"
            stroke={isScrolled ? "#000000" : "#ffffff"}
            strokeWidth={4}
            strokeLinecap="round"
            animate={controls}
          />
        </svg>
      </motion.button>

      {/* Cursor-following tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed pointer-events-none z-50 bg-black/80 backdrop-blur-sm text-white px-2 py-1 rounded-md text-sm flex items-center gap-1"
            style={{
              left: mousePosition.x - 80,
              top: mousePosition.y - 40,
            }}
          >
            <Music size={14} />
            <span>{isPlaying ? 'Stop Audio' : 'Play Audio'}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
