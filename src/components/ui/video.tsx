"use client";

import * as React from "react"
import { cn } from "@/lib/utils"
import { AnimatedText } from "@/components/ui/animated-text";
import { FadeUpText } from "@/components/ui/fade-up-text";

interface VideoProps extends React.ComponentProps<"div"> {
  src: string
  h1?: string
  h2?: string
  poster?: string
  className?: string
}

function Video({ 
  src, 
  h1, 
  h2, 
  poster, 
  className, 
  ...props 
}: VideoProps) {
  const videoRef = React.useRef<HTMLVideoElement>(null)

  React.useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Ensure video plays on mobile devices
    const playVideo = async () => {
      try {
        await video.play()
      } catch (error) {
        console.warn('Autoplay prevented:', error)
      }
    }

    // Set up intersection observer for autoplay
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            playVideo()
          } else {
            video.pause()
          }
        })
      },
      { threshold: 0.1 }
    )

    observer.observe(video)

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <div
      data-slot="video"
      className={cn(
        "relative w-full h-[100vh]",
        className
      )}
      {...props}
    >
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        poster={poster}
        preload="metadata"
      >
        <source src={src} type="video/mp4" />
        <source src={src.replace('.mp4', '.webm')} type="video/webm" />
        Your browser does not support the video tag.
      </video>
      
      {/* Overlay for text content */}
      {(h1 || h2) && (
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <div className="text-center text-white px-4 max-w-4xl">
            {h1 && (
              <AnimatedText
                text={h1}
                as="h1"
                className="text-6xl md:text-[240px] font-100 mb-4 drop-shadow-lg font-archivo tracking-tighter"
                startDelay={0.3}
                staggerDelay={0.05}
                duration={0.6}
                slideDistance={100}
              />
            )}
            <FadeUpText 
                as="h2" 
                className="text-6xl font-100 font-archivo tracking-tighter max-w-2xl mx-auto text-yellow-200"
                delay={0.6}
                duration={0.8}
                >
               The Clubs. The DJs. The Nights We Will Not Forget.
                </FadeUpText>
          </div>
        </div>
      )}
    </div>
  )
}

export { Video } 