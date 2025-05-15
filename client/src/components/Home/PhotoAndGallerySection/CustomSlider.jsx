import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CustomSlider = ({ images }) => {
  const [current, setCurrent] = useState(0);
  const containerRef = useRef(null);
  const startX = useRef(0);
  const endX = useRef(0);

  const next = () => setCurrent((prev) => (prev + 1) % images.length);
  const prev = () => setCurrent((prev) => (prev - 1 + images.length) % images.length);

  // Handle swipe gesture
  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    endX.current = e.changedTouches[0].clientX;
    handleSwipe();
  };

  const handleMouseDown = (e) => {
    startX.current = e.clientX;
  };

  const handleMouseUp = (e) => {
    endX.current = e.clientX;
    handleSwipe();
  };

  const handleSwipe = () => {
    const diff = startX.current - endX.current;
    if (Math.abs(diff) > 50) {
      diff > 0 ? next() : prev();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <div className="relative w-full max-w-6xl mx-auto overflow-hidden py-10 select-none">
      <button
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white shadow-md p-2 rounded-full z-10"
      >
        <ChevronLeft />
      </button>

      <div
        ref={containerRef}
        className="flex justify-center items-center relative h-80 perspective-[1000px]"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        {images.map((img, index) => {
          const offset = index - current;
          const isActive = offset === 0;
          const isVisible = Math.abs(offset) <= 2;

          return (
            <div
              key={index}
              className={`absolute transition-all duration-500 ease-in-out ${
                isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
              style={{
                transform: `
                  translateX(${offset * 280}px)
                  scale(${isActive ? 1 : 0.8})
                  rotateY(${offset * -30}deg)
                `,
                zIndex: 100 - Math.abs(offset),
              }}
            >
              <img
                src={img}
                alt={`Slide ${index}`}
                className="w-64 h-80 object-cover rounded-xl shadow-lg"
              />
            </div>
          );
        })}
      </div>

      <button
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white shadow-md p-2 rounded-full z-10"
      >
        <ChevronRight />
      </button>
    </div>
  );
};

export default CustomSlider;
