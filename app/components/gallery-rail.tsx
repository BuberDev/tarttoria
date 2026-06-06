"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeftRight, Maximize2 } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type GalleryItem = {
  title: string;
  label: string;
  description: string;
  image: string;
};

export function GalleryRail({ items }: Readonly<{ items: GalleryItem[] }>) {
  const railRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const selected = items[selectedIndex] ?? items[0];

  const updateScrollProgress = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;

    const maxScroll = rail.scrollWidth - rail.clientWidth;
    setScrollProgress(maxScroll <= 0 ? 1 : rail.scrollLeft / maxScroll);
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(updateScrollProgress);
    window.addEventListener("resize", updateScrollProgress);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", updateScrollProgress);
    };
  }, [updateScrollProgress]);

  const scrollForward = () => {
    const rail = railRef.current;
    if (!rail) return;

    rail.scrollBy({
      left: Math.min(rail.clientWidth * 0.78, 560),
      behavior: "smooth",
    });
  };

  return (
    <>
      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={scrollForward}
          className="group inline-flex min-h-11 w-fit items-center gap-3 rounded-[8px] border border-white/14 bg-white/8 px-4 py-2 text-sm font-semibold text-white/78 backdrop-blur-md transition hover:border-[#d9b46f]/45 hover:bg-white/12 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d9b46f]"
        >
          <span className="gallery-cue-icon flex h-7 w-7 items-center justify-center rounded-[8px] bg-[#d9b46f]/12 text-[#d9b46f]">
            <ArrowLeftRight className="size-4" />
          </span>
          <span>Przesuń w bok</span>
        </button>

        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10 sm:max-w-64" aria-hidden="true">
          <div
            className="gallery-progress h-full rounded-full bg-[#d9b46f]"
            style={{ width: `${Math.max(12, Math.min(100, scrollProgress * 100))}%` }}
          />
        </div>
      </div>

      <div
        ref={railRef}
        onScroll={updateScrollProgress}
        className="gallery-rail -mx-4 mt-6 overflow-x-auto px-4 pb-6 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
      >
        <div className="flex w-max gap-4">
          {items.map((item, index) => (
            <button
              key={item.title}
              type="button"
              className="group block w-[82vw] max-w-[520px] shrink-0 snap-start text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d9b46f] sm:w-[52vw] lg:w-[420px] xl:w-[470px]"
              onClick={() => {
                setSelectedIndex(index);
                setOpen(true);
              }}
            >
              <Card className="overflow-hidden rounded-[8px] border-white/10 bg-white/6 p-0 text-white shadow-[0_24px_80px_rgba(0,0,0,0.30)] backdrop-blur-sm transition duration-500 group-hover:-translate-y-1 group-hover:border-[#d9b46f]/35 group-hover:bg-white/10">
                <CardContent className="p-0">
                  <AspectRatio ratio={4 / 3} className="relative aspect-[4/3] overflow-hidden bg-black">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 82vw, (max-width: 1024px) 52vw, 470px"
                      priority={index === 0}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b0a09]/88 via-[#0b0a09]/18 to-transparent" />
                    <div className="absolute left-4 top-4 rounded-[8px] border border-white/15 bg-black/28 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/76 backdrop-blur-md">
                      {item.label}
                    </div>
                    <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-[8px] border border-white/18 bg-white/10 text-white opacity-0 backdrop-blur-md transition group-hover:opacity-100">
                      <Maximize2 className="size-4" />
                    </div>
                    <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                      <h3 className="text-2xl font-semibold leading-tight sm:text-3xl">
                        {item.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/68">
                        {item.description}
                      </p>
                    </div>
                  </AspectRatio>
                </CardContent>
              </Card>
            </button>
          ))}
        </div>
      </div>

      {selected ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-6xl border-white/10 bg-[#0b0a09] p-2 text-white sm:max-w-6xl">
            <DialogHeader className="px-2 pt-2 sm:px-4">
              <DialogTitle className="text-2xl text-white">{selected.title}</DialogTitle>
              <DialogDescription className="text-white/62">
                {selected.description}
              </DialogDescription>
            </DialogHeader>
            <AspectRatio ratio={16 / 10} className="relative aspect-[16/10] overflow-hidden rounded-[8px] bg-black">
              <Image
                src={selected.image}
                alt={selected.title}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </AspectRatio>
          </DialogContent>
        </Dialog>
      ) : null}
    </>
  );
}
