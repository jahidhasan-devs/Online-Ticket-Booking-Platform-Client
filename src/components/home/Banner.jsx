/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/refs */

"use client";

import React, { useCallback, useEffect, useState, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";

const banners = [
  "https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=1400&q=80", // Train
  "https://images.pexels.com/photos/9244269/pexels-photo-9244269.jpeg?auto=compress&cs=tinysrgb&w=1400", // Launch / Ferry
  "https://images.unsplash.com/photo-1557223562-6c77ef16210f?auto=format&fit=crop&w=1400q=80", // Luxury Bus
  "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1400&q=80", // Airplane
  "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=1400&q=80", // Highway Bus
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=80", // Night Bus
];

export default function BannerSlider() {
  const autoplay = useRef(
    Autoplay({
      delay: 3000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    }),
  );

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    autoplay.current,
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => emblaApi.off("select", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div
      className="relative overflow-hidden rounded-3xl shadow-lg"
      ref={emblaRef}
    >
      <div className="flex">
        {banners.map((banner, index) => (
          <div key={index} className="relative min-w-0 flex-[0_0_100%]">
            <img
              src={banner}
              alt={`Banner ${index + 1}`}
              className="h-[280px] w-full object-cover sm:h-[360px] md:h-[420px] lg:h-[480px]"
              loading={index === 0 ? "eager" : "lazy"}
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={() => emblaApi?.scrollPrev()}
        className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full 
             bg-white/90 dark:bg-zinc-800/90 
             text-zinc-800 dark:text-white
             p-2.5 shadow-lg transition 
             hover:bg-white dark:hover:bg-zinc-700 
             sm:left-5 sm:p-3"
      >
        <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>

      <button
        onClick={() => emblaApi?.scrollNext()}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full 
             bg-white/90 dark:bg-zinc-800/90 
             text-zinc-800 dark:text-white
             p-2.5 shadow-lg transition 
             hover:bg-white dark:hover:bg-zinc-700 
             sm:right-5 sm:p-3"
      >
        <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              selectedIndex === index ? "w-8 bg-white" : "w-2.5 bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
