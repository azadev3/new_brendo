// import type React from 'react';

// import { useState, useCallback, useRef, type TouchEvent } from 'react';
// import { ChevronLeft, ChevronRight } from 'lucide-react';

// type Slide = {
//   id: number;
//   image: string;
// };

// interface ImageSliderProps {
//   slides: Slide[];
//   onClick: () => void;
//   className?: string;
// }

// export default function ImageSlider({
//   slides,
//   onClick,
//   className = '',
// }: ImageSliderProps) {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [_, setIsHovering] = useState(false);

//   // Refs for touch handling
//   const touchStartX = useRef<number | null>(null);
//   const touchEndX = useRef<number | null>(null);
//   const sliderRef = useRef<HTMLDivElement>(null);
//   const [__, setIsSwiping] = useState(false);

//   const goToPrevious = useCallback(
//     (e: React.MouseEvent) => {
//       e.stopPropagation();
//       setCurrentIndex((prevIndex) =>
//         prevIndex === 0 ? slides.length - 1 : prevIndex - 1
//       );
//     },
//     [slides.length]
//   );

//   const goToNext = useCallback(
//     (e: React.MouseEvent) => {
//       e.stopPropagation();
//       setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
//     },
//     [slides.length]
//   );

//   // Touch event handlers
//   const handleTouchStart = useCallback((e: TouchEvent<HTMLDivElement>) => {
//     touchStartX.current = e.touches[0].clientX;
//     touchEndX.current = e.touches[0].clientX;
//     setIsSwiping(true);
//   }, []);

//   const handleTouchMove = useCallback((e: TouchEvent<HTMLDivElement>) => {
//     if (!touchStartX.current) return;
//     touchEndX.current = e.touches[0].clientX;

//     // Prevent default to stop scrolling while swiping
//     if (Math.abs((touchEndX.current || 0) - (touchStartX.current || 0)) > 5) {
//       e.preventDefault();
//     }
//   }, []);

//   const handleTouchEnd = useCallback(
//     (e: TouchEvent<HTMLDivElement>) => {
//       if (!touchStartX.current || !touchEndX.current) {
//         setIsSwiping(false);
//         return;
//       }

//       const distance = touchEndX.current - touchStartX.current;
//       const isSignificantSwipe = Math.abs(distance) > 50;

//       if (isSignificantSwipe) {
//         if (distance > 0) {
//           // Swipe right -> go to previous
//           setCurrentIndex((prevIndex) =>
//             prevIndex === 0 ? slides.length - 1 : prevIndex - 1
//           );
//         } else {
//           // Swipe left -> go to next
//           setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
//         }
//         e.stopPropagation(); // Prevent onClick from firing
//       } else {
//         // Small movement, treat it as a click
//         setIsSwiping(false);
//       }

//       // Reset touch coordinates
//       touchStartX.current = null;
//       touchEndX.current = null;

//       // Add a small delay before resetting isSwiping to prevent the click event
//       setTimeout(() => {
//         setIsSwiping(false);
//       }, 100);
//     },
//     [slides?.length]
//   );

//   // const handleClick = useCallback(
//   //   (e: React.MouseEvent) => {
//   //     if (!isSwiping) {
//   //       onClick();
//   //     }
//   //   },
//   //   [onClick, isSwiping]
//   // );

//   if (!slides || slides.length === 0) {
//     return (
//       <img
//         onClick={onClick}
//         className={`${className} object-cover w-full h-full`}
//         src="/placeholder.svg"
//         alt="No image available"
//         loading="lazy"
//       />
//     );
//   }

//   if (slides.length === 1) {
//     return (
//       <img
//         onClick={onClick}
//         className={`${className} object-cover w-full h-full`}
//         src={slides[0].image || '/placeholder.svg'}
//         alt="Product"
//         loading="lazy"
//       />
//     );
//   }

//   return (
//     <div
//       className="relative w-full h-full"
//       onMouseEnter={() => setIsHovering(true)}
//       onMouseLeave={() => setIsHovering(false)}>
//       <div
//         className="w-full h-full overflow-hidden"
//         ref={sliderRef}
//         onTouchStart={handleTouchStart}
//         onTouchMove={handleTouchMove}
//         onTouchEnd={handleTouchEnd}>
//         <div
//           className="flex transition-transform duration-300 ease-out h-full touch-pan-y"
//           style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
//           {slides.map((slide, index) => (
//             <img
//               key={index}
//               src={slide.image || '/placeholder.svg'}
//               alt={`Product slide ${index + 1}`}
//               className={`${className} min-w-full object-cover`}
//               // onClick={handleClick}
//               loading={index === 0 ? 'eager' : 'lazy'}
//             />
//           ))}
//         </div>
//       </div>

//       {/* Navigation arrows - only show on hover on desktop */}
//       {slides.length > 1 && (
//         <>
//           <button
//             onClick={goToPrevious}
//             className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-1 shadow-md hover:bg-white/90 transition-colors"
//             aria-label="Previous slide">
//             <ChevronLeft className="w-5 h-5" />
//           </button>
//           <button
//             onClick={goToNext}
//             className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-1 shadow-md hover:bg-white/90 transition-colors"
//             aria-label="Next slide">
//             <ChevronRight className="w-5 h-5" />
//           </button>
//         </>
//       )}

//       {/* Dots indicator */}
//       {slides.length > 1 && (
//         <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
//           {slides.map((_, index) => (
//             <button
//               key={index}
//               onClick={(e) => {
//                 e.stopPropagation();
//                 setCurrentIndex(index);
//               }}
//               className={`w-2 h-2 rounded-full ${
//                 index === currentIndex ? 'bg-white' : 'bg-white/50'
//               }`}
//               aria-label={`Go to slide ${index + 1}`}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }


import type React from 'react';

import { useState, useCallback, useRef, type TouchEvent } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Slide = {
  id: number;
  image: string;
};

interface ImageSliderProps {
  isHome: boolean;
  slides: Slide[];
  onClick: () => void;
  className?: string;
}

export default function ImageSlider({
  isHome,
  slides,
  onClick,
  className = '',
}: ImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  //@ts-expect-error
  const [isHovering, setIsHovering] = useState(false);

  // Refs for touch handling
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isSwiping, setIsSwiping] = useState(false);

  const goToPrevious = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? slides.length - 1 : prevIndex - 1
      );
    },
    [slides.length]
  );

  const goToNext = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    },
    [slides.length]
  );

  // Touch event handlers
  const handleTouchStart = useCallback((e: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = e.touches[0].clientX;
    setIsSwiping(true);
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent<HTMLDivElement>) => {
    if (!touchStartX.current) return;
    touchEndX.current = e.touches[0].clientX;

    // Prevent default to stop scrolling while swiping
    if (Math.abs((touchEndX.current || 0) - (touchStartX.current || 0)) > 5) {
      e.preventDefault();
    }
  }, []);

  const handleTouchEnd = useCallback(
    (e: TouchEvent<HTMLDivElement>) => {
      if (!touchStartX.current || !touchEndX.current) {
        setIsSwiping(false);
        return;
      }

      const distance = touchEndX.current - touchStartX.current;
      const isSignificantSwipe = Math.abs(distance) > 50;

      if (isSignificantSwipe) {
        if (distance > 0) {
          // Swipe right -> go to previous
          setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? slides.length - 1 : prevIndex - 1
          );
        } else {
          // Swipe left -> go to next
          setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
        }
        e.stopPropagation(); // Prevent onClick from firing
      } else {
        // Small movement, treat it as a click
        setIsSwiping(false);
      }

      // Reset touch coordinates
      touchStartX.current = null;
      touchEndX.current = null;

      // Add a small delay before resetting isSwiping to prevent the click event
      setTimeout(() => {
        setIsSwiping(false);
      }, 100);
    },
    [slides?.length]
  );

  const handleClick = useCallback(
    //@ts-expect-error
    (e: React.MouseEvent) => {
      if (!isSwiping) {
        onClick();
      }
    },
    [onClick, isSwiping]
  );

  if (!slides || slides.length === 0) {
    return (
      <img
        onClick={onClick}
        className={`${className} object-cover w-full h-full`}
        src="/placeholder.svg"
        alt="No image available"
        loading="lazy"
      />
    );
  }

  if (slides.length === 1) {
    return (
      <img
        onClick={onClick}
        className={`${className} object-cover w-full h-full`}
        src={slides[0].image || '/placeholder.svg'}
        alt="Product"
        loading="lazy"
      />
    );
  }


  return (
    <div
      className="relative w-full h-full"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}>
      <div
        className="w-full h-full overflow-hidden"
        style={{ backgroundColor: "#ececec" }}
        ref={sliderRef}
        onTouchStart={!isHome ? handleTouchStart : undefined}
        onTouchMove={!isHome ? handleTouchMove : undefined}
        onTouchEnd={!isHome ? handleTouchEnd : undefined}>
        <div
          className="flex transition-transform duration-300 ease-out h-full touch-pan-y"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
          {slides.map((slide, index) => (
            <img
              key={index}
              src={slide.image || '/placeholder.svg'}
              alt={`Product slide ${index + 1}`}
              className={`${className} min-w-full object-contain`}
              onClick={handleClick}
              loading={index === 0 ? 'eager' : 'lazy'}
            />
          ))}
        </div>
      </div>

      {/* Navigation arrows - only show on hover on desktop */}
      {slides.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-1 shadow-md hover:bg-white/90 transition-colors"
            aria-label="Previous slide">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-1 shadow-md hover:bg-white/90 transition-colors"
            aria-label="Next slide">
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Dots indicator */}
      {slides?.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(index);
              }}
              className={`w-2 h-2 rounded-full ${
                index === currentIndex ? 'bg-white' : 'bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
