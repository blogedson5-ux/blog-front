"use client";

import { useEffect, useRef, useState } from "react";

type CategoryTabsProps = {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  className?: string;
};

export function CategoryTabs({
  categories,
  selectedCategory,
  onSelectCategory,
  className = "",
}: CategoryTabsProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [animatedCategory, setAnimatedCategory] = useState(selectedCategory);

  useEffect(() => {
    setAnimatedCategory(selectedCategory);
  }, [selectedCategory]);

  useEffect(() => {
    const container = containerRef.current;
    const activeButton = buttonRefs.current[selectedCategory];

    if (!container || !activeButton) return;
    if (window.innerWidth >= 768) return;

    const containerWidth = container.offsetWidth;
    const buttonLeft = activeButton.offsetLeft;
    const buttonWidth = activeButton.offsetWidth;

    container.scrollTo({
      left: buttonLeft - containerWidth / 2 + buttonWidth / 2,
      behavior: "smooth",
    });
  }, [selectedCategory]);

  const handleClick = (category: string) => {
    setAnimatedCategory(category);
    onSelectCategory(category);
  };

  return (
    <>
      <div className={`relative ${className}`}>
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-8 bg-gradient-to-r from-white to-transparent md:hidden" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-8 bg-gradient-to-l from-white to-transparent md:hidden" />

        <div
          ref={containerRef}
          className="overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          <div className="flex min-w-max items-end gap-5 border-b border-slate-200 pb-1 md:flex-wrap md:gap-6">
            {categories.map((category) => {
              const isActive = selectedCategory === category;
              const shouldAnimate = animatedCategory === category && isActive;

              return (
                <button
                  key={category}
                  ref={(el) => {
                    buttonRefs.current[category] = el;
                  }}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => handleClick(category)}
                  className="group relative flex min-h-[42px] flex-col items-center justify-end px-1 pb-3 text-[13px] font-extrabold uppercase tracking-[0.12em] text-[#0f4fa8] transition-all duration-300 active:scale-95"
                >
                  <span
                    className={`whitespace-nowrap transition-all duration-300 ${
                      isActive
                        ? "text-[#1E90FF]"
                        : "text-[#0f4fa8] group-hover:text-[#1E90FF]"
                    }`}
                  >
                    {category}
                  </span>

                  <span className="pointer-events-none absolute bottom-0 left-1/2 h-[10px] w-[56px] -translate-x-1/2">
                    {isActive && (
                      <>
                        <span
                          key={shouldAnimate ? `${category}-line` : `${category}-line-static`}
                          className={`absolute left-1/2 top-1/2 h-[2px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1E90FF] ${
                            shouldAnimate
                              ? "w-12 animate-category-line-collapse"
                              : "w-0 opacity-0"
                          }`}
                        />

                        <span
                          key={shouldAnimate ? `${category}-dot` : `${category}-dot-static`}
                          className={`absolute left-1/2 top-1/2 rounded-full bg-[#1E90FF] shadow-[0_0_10px_rgba(30,144,255,0.30)] ${
                            shouldAnimate
                              ? "h-2 w-2 animate-category-dot-show"
                              : "h-2 w-2 -translate-x-1/2 -translate-y-1/2 opacity-100"
                          }`}
                        />
                      </>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes category-line-collapse {
          0% {
            width: 48px;
            opacity: 1;
          }
          25% {
            width: 36px;
            opacity: 1;
          }
          50% {
            width: 24px;
            opacity: 1;
          }
          75% {
            width: 10px;
            opacity: 1;
          }
          100% {
            width: 0px;
            opacity: 0;
          }
        }

        @keyframes category-dot-show {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0;
          }
          65% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0;
          }
          85% {
            transform: translate(-50%, -50%) scale(1.15);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
        }

        .animate-category-line-collapse {
          animation: category-line-collapse 0.42s ease forwards;
        }

        .animate-category-dot-show {
          animation: category-dot-show 0.42s ease forwards;
        }
      `}</style>
    </>
  );
}