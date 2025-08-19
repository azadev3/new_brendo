'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Play } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Keyboard } from 'swiper/modules';
import type { Tiktoks } from '../../Header/StoryViewer';
import { useMediaQuery } from '../../../hooks/useMediaQuery';
import type { SwiperOptions } from 'swiper/types';
import Borttomswipper from '../../StoriesSwipper/borttomswipper';

interface FullscreenGalleryProps {
  images: Tiktoks;
  initialIndex?: number;
  onClose: () => void;
  isOpen: boolean;
}

export default function FullscreenGallery({
  images,
  initialIndex = 0,
  onClose,
  isOpen,
}: FullscreenGalleryProps) {
  const [activeVideoId, setActiveVideoId] = useState<number | null>(null);
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Reset active video when gallery opens
      setActiveVideoId(null);
      // Pause all videos when opening
      pauseAllVideos();
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      // Pause all videos when component unmounts
      pauseAllVideos();
    };
  }, [isOpen, initialIndex]);

  const pauseAllVideos = () => {
    Object.values(videoRefs.current).forEach((video) => {
      if (video) {
        video.pause();
      }
    });
  };

  const togglePlayPause = (id: number) => {
    const video = videoRefs.current[id];
    if (!video) return;

    if (video.paused) {
      pauseAllVideos();
      video.play();
      setActiveVideoId(id);
    } else {
      video.pause();
      setActiveVideoId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      <button
        onClick={onClose}
        className="absolute top-12 md:top-4 left-6 md:left-4 z-50 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition-colors"
        aria-label="Close gallery">
        <X className="h-6 w-6" />
      </button>

      <div className="w-full h-full flex items-center justify-center">
        <div className="w-full h-[90vh] relative">
          <Swiper
            spaceBetween={16}
            slidesPerView={1}
            direction={isMobile ? 'vertical' : 'horizontal'}
            breakpoints={
              isMobile
                ? {}
                : {
                    320: {
                      slidesPerView: 1,
                    } as SwiperOptions,
                    768: {
                      slidesPerView: 2,
                    } as SwiperOptions,
                    1024: {
                      slidesPerView: 3,
                    } as SwiperOptions,
                  }
            }
            initialSlide={initialIndex}
            modules={[Keyboard]}
            centeredSlides={true}
            className="h-full"
            onSlideChange={() => {
              // Pause all videos when changing slides
              pauseAllVideos();
              setActiveVideoId(null);
            }}>
            {images.map((image) => (
              <SwiperSlide
                key={image.id}
                className="flex relative cursor-pointer items-center justify-center">
                <div
                  className="relative rounded-[20px] max-w-[420px] w-full h-full md:h-[526px] flex items-center justify-center overflow-hidden"
                  onClick={() => togglePlayPause(image.id)}>
                  {activeVideoId !== image.id && (
                    <div className="absolute inset-0 bg-black/40 z-10 rounded-[20px]" />
                  )}

                  <video
                    ref={(el) => (videoRefs.current[image.id] = el)}
                    loop
                    src={image.image}
                    className="rounded-[20px] h-full w-full object-cover"
                    onPlay={() => setActiveVideoId(image.id)}
                    onPause={() => {
                      if (activeVideoId === image.id) {
                        setActiveVideoId(null);
                      }
                    }}
                  />
                  <Borttomswipper
                    onClick={(e: any) => e.stopPropagation()}
                    isopen={true}
                    products={image.products || []}
                  />
                  {activeVideoId !== image.id && (
                    <div className="absolute z-20 bg-white/90 p-3 rounded-full flex items-center justify-center shadow-lg transform transition-transform hover:scale-105">
                      <Play className="w-8 h-8 text-black fill-black" />
                    </div>
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
}
