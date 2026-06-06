"use client";

import { useEffect, useRef, useState } from "react";

const FADE_DURATION_SECONDS = 1.25;

export function HeroVideo() {
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);
  const activeIndexRef = useRef(0);
  const transitionInProgress = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    let animationFrame = 0;
    let transitionTimer: ReturnType<typeof setTimeout> | undefined;
    const videos = videoRefs.current;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    const playActiveVideo = () => {
      if (prefersReducedMotion.matches) {
        videoRefs.current.forEach((video) => video?.pause());
        return;
      }

      void videoRefs.current[activeIndexRef.current]?.play();
    };

    const crossfade = () => {
      const currentIndex = activeIndexRef.current;
      const nextIndex = currentIndex === 0 ? 1 : 0;
      const currentVideo = videoRefs.current[currentIndex];
      const nextVideo = videoRefs.current[nextIndex];

      if (!currentVideo || !nextVideo || transitionInProgress.current) {
        return;
      }

      transitionInProgress.current = true;
      nextVideo.currentTime = 0;

      void nextVideo
        .play()
        .then(() => {
          activeIndexRef.current = nextIndex;
          setActiveIndex(nextIndex);

          transitionTimer = setTimeout(() => {
            currentVideo.pause();
            currentVideo.currentTime = 0;
            transitionInProgress.current = false;
          }, FADE_DURATION_SECONDS * 1000);
        })
        .catch(() => {
          transitionInProgress.current = false;
          currentVideo.currentTime = 0;
          void currentVideo.play();
        });
    };

    const monitorPlayback = () => {
      const activeVideo = videoRefs.current[activeIndexRef.current];

      if (
        activeVideo?.duration &&
        activeVideo.currentTime >=
          activeVideo.duration - FADE_DURATION_SECONDS
      ) {
        crossfade();
      }

      animationFrame = window.requestAnimationFrame(monitorPlayback);
    };

    playActiveVideo();
    animationFrame = window.requestAnimationFrame(monitorPlayback);
    prefersReducedMotion.addEventListener("change", playActiveVideo);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      prefersReducedMotion.removeEventListener("change", playActiveVideo);
      if (transitionTimer) clearTimeout(transitionTimer);
      videos.forEach((video) => video?.pause());
    };
  }, []);

  return (
    <div className="absolute inset-0" aria-hidden="true">
      {[0, 1].map((index) => (
        <video
          key={index}
          ref={(video) => {
            videoRefs.current[index] = video;
          }}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity ease-in-out motion-reduce:hidden ${
            activeIndex === index ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDuration: `${FADE_DURATION_SECONDS}s` }}
          autoPlay={index === 0}
          muted
          playsInline
          preload="auto"
          poster={
            index === 0 ? "/images/tarttoria/pizza-wide.png" : undefined
          }
        >
          <source src="/video_hero.mp4" type="video/mp4" />
        </video>
      ))}
      <div className="absolute inset-0 bg-[url('/images/tarttoria/pizza-wide.png')] bg-cover bg-center motion-safe:hidden" />
    </div>
  );
}
