"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Rewind, FastForward } from "lucide-react";

export interface CarouselItem {
  id: number | string;
  title: string;
}

// Create infinite items by triplicating the array
const createInfiniteItems = (originalItems: CarouselItem[]) => {
  const items: any[] = [];
  for (let i = 0; i < 3; i++) {
    originalItems.forEach((item, index) => {
      items.push({
        ...item,
        id: `${i}-${item.id}`,
        originalIndex: index,
      });
    });
  }
  return items;
};

const RulerLines = ({
  top = true,
  totalLines = 100,
}: {
  top?: boolean;
  totalLines?: number;
}) => {
  const lines = [];
  const lineSpacing = 100 / (totalLines - 1);

  for (let i = 0; i < totalLines; i++) {
    const isFifth = i % 5 === 0;
    const isCenter = i === Math.floor(totalLines / 2);

    let height = "h-3";
    let color = "bg-gray-400 dark:bg-gray-600";

    if (isCenter) {
      height = "h-8";
      color = "bg-sasori-red";
    } else if (isFifth) {
      height = "h-4";
      color = "bg-gray-800 dark:bg-gray-200";
    }

    const positionClass = top ? "" : "bottom-0";

    lines.push(
      <div
        key={i}
        className={`absolute w-0.5 ${height} ${color} ${positionClass} transition-colors duration-300`}
        style={{ left: `${i * lineSpacing}%` }}
      />
    );
  }

  return <div className="relative w-full h-8 px-4">{lines}</div>;
};

export function RulerCarousel({
  originalItems,
}: {
  originalItems: CarouselItem[];
}) {
  const infiniteItems = createInfiniteItems(originalItems);
  const itemsPerSet = originalItems.length;

  // Start with the middle set, roughly in the center
  const initialIndex = itemsPerSet + Math.floor(itemsPerSet / 2);
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [isResetting, setIsResetting] = useState(false);
  const previousIndexRef = useRef(initialIndex);

  const handleItemClick = (newIndex: number) => {
    if (isResetting) return;

    // Find the original item index
    const targetOriginalIndex = newIndex % itemsPerSet;

    // Find all instances of this item across the 3 copies
    const possibleIndices = [
      targetOriginalIndex, // First copy
      targetOriginalIndex + itemsPerSet, // Second copy
      targetOriginalIndex + itemsPerSet * 2, // Third copy
    ];

    // Find the closest index to current position
    let closestIndex = possibleIndices[0];
    let smallestDistance = Math.abs(possibleIndices[0] - activeIndex);

    for (const index of possibleIndices) {
      const distance = Math.abs(index - activeIndex);
      if (distance < smallestDistance) {
        smallestDistance = distance;
        closestIndex = index;
      }
    }

    previousIndexRef.current = activeIndex;
    setActiveIndex(closestIndex);
  };

  const handlePrevious = () => {
    if (isResetting) return;
    setActiveIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    if (isResetting) return;
    setActiveIndex((prev) => prev + 1);
  };

  // Handle infinite scrolling
  useEffect(() => {
    if (isResetting) return;

    // If we're in the first set, jump to the equivalent position in the middle set
    if (activeIndex < itemsPerSet) {
      setIsResetting(true);
      setTimeout(() => {
        setActiveIndex(activeIndex + itemsPerSet);
        setIsResetting(false);
      }, 0);
    }
    // If we're in the last set, jump to the equivalent position in the middle set
    else if (activeIndex >= itemsPerSet * 2) {
      setIsResetting(true);
      setTimeout(() => {
        setActiveIndex(activeIndex - itemsPerSet);
        setIsResetting(false);
      }, 0);
    }
  }, [activeIndex, itemsPerSet, isResetting]);

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isResetting) return;

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setActiveIndex((prev) => prev - 1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        setActiveIndex((prev) => prev + 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isResetting]);

  // Calculate target position - center the active item
  // The original used 500 as width/offset
  const itemWidth = 500;
  const gap = 100;
  const fullItemWidth = itemWidth + gap;
  
  // Calculate centering: center of the container (x=0) minus center of active item
  const totalWidth = infiniteItems.length * itemWidth + (infiniteItems.length - 1) * gap;
  const targetX = (totalWidth / 2) - (activeIndex * fullItemWidth + itemWidth / 2);

  // Get current page info
  const currentPage = (activeIndex % itemsPerSet) + 1;
  const totalPages = itemsPerSet;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-transparent">
      <div className="w-full h-[220px] flex flex-col justify-center relative">
        <div className="flex items-center justify-center mb-4">
          <RulerLines top />
        </div>
        
        <div className="flex items-center justify-center w-full h-full relative overflow-hidden">
          <motion.div
            className="flex items-center gap-[100px]"
            initial={false}
            animate={{
              x: targetX,
            }}
            transition={
              isResetting
                ? { duration: 0 }
                : {
                    type: "spring",
                    stiffness: 200,
                    damping: 30,
                    mass: 0.8,
                  }
            }
          >
            {infiniteItems.map((item, index) => {
              const isActive = index === activeIndex;

              return (
                <motion.button
                  key={item.id}
                  onClick={() => handleItemClick(index)}
                  className={`text-2xl md:text-5xl font-black whitespace-nowrap cursor-pointer flex items-center justify-center transition-colors duration-500 uppercase tracking-tighter ${
                    isActive
                      ? "text-sasori-red"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                  animate={{
                    scale: isActive ? 1.1 : 0.8,
                    opacity: isActive ? 1 : 0.3,
                  }}
                  transition={
                    isResetting
                      ? { duration: 0 }
                      : {
                          type: "spring",
                          stiffness: 400,
                          damping: 25,
                        }
                  }
                  style={{
                    width: `${itemWidth}px`,
                  }}
                >
                  {item.title}
                </motion.button>
              );
            })}
          </motion.div>
        </div>

        <div className="flex items-center justify-center mt-4">
          <RulerLines top={false} />
        </div>
      </div>
      
      <div className="flex items-center justify-center gap-8 mt-12 bg-black/5 dark:bg-white/5 py-3 px-8 rounded-full backdrop-blur-sm">
        <button
          onClick={handlePrevious}
          disabled={isResetting}
          className="flex items-center justify-center cursor-pointer group transition-transform active:scale-95"
          aria-label="Previous item"
        >
          <Rewind className="w-6 h-6 text-sasori-red/60 group-hover:text-sasori-red transition-colors" />
        </button>

        <div className="flex items-center gap-3 font-black tabular-nums">
          <span className="text-lg text-sasori-red">
            {currentPage.toString().padStart(2, '0')}
          </span>
          <span className="text-sm text-gray-400">
            /
          </span>
          <span className="text-lg text-gray-600">
            {totalPages.toString().padStart(2, '0')}
          </span>
        </div>

        <button
          onClick={handleNext}
          disabled={isResetting}
          className="flex items-center justify-center cursor-pointer group transition-transform active:scale-95"
          aria-label="Next item"
        >
          <FastForward className="w-6 h-6 text-sasori-red/60 group-hover:text-sasori-red transition-colors" />
        </button>
      </div>
    </div>
  );
}
