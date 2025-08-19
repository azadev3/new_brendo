import { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import { Fancybox } from '@fancyapps/ui';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import '@fancyapps/ui/dist/fancybox/fancybox.css';
import 'swiper/swiper-bundle.css';
import ImageMagnifier from '../magnifyImage';
import { useShowMagnify } from '../../hooks/useShowMagnify';
import { createPortal } from 'react-dom';
export default function ProductGallery({ images }: { images: string[] }) {
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const [index, setindex] = useState<any>(0);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const { showMagnifier, x, y } = useShowMagnify();

  useEffect(() => {
    Fancybox.bind('[data-fancybox="gallery"]', {
      Toolbar: {
        display: {
          left: ['prev'],
          middle: ['counter'],
          right: ['next', 'close'],
        },
      },
    });

    return () => {
      Fancybox.destroy();
    };
  }, []);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // 768 altı mobil olarak kabul ediliyor
    };

    handleResize(); // İlk renderda çalıştır
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-4 relative">
      {/* Main Swiper */}
      <div className="mb-4  group  relative ">
        <Swiper
          spaceBetween={10}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          onBeforeInit={swiper => {
            // @ts-expect-error prevRef.current
            swiper.params.navigation.prevEl = prevRef.current;
            // @ts-expect-error nextRef.current
            swiper.params.navigation.nextEl = nextRef.current;
          }}
          thumbs={{ swiper: thumbsSwiper }}
          modules={[FreeMode, Navigation, Thumbs]}
          onSlideChange={swiper => {
            setindex(swiper.activeIndex);
            // You can use swiper.activeIndex to access the current slide index
          }}
          className="aspect-square rounded-lg "
        >
          {images.map((img, index) => {
            return (
              <SwiperSlide key={index} className=" !overflow-visible">
                <a
                  href={img}
                  data-fancybox="gallery"
                  className="block w-full h-full relative object-contain"
                  style={{ objectFit: 'contain' }}
                >
                  {!isMobile && <ImageMagnifier src={img} width={'100%'} height={'100%'} />}
                  {isMobile && (
                    <img
                      src={img}
                      alt={`Product view ${index + 1}`}
                      className="w-full h-full object-contain"
                    />
                  )}

                  {/* <ImageMagnifier src={img} width={'100%'} height={'100%'} /> */}
                </a>
              </SwiperSlide>
            );
          })}
        </Swiper>
        {/* <img
          src={images[index] || '/placeholder.svg'}
          alt={`Product view ${index + 1}`}
          className="w-full h-full object-cover rounded-lg"
        /> */}

        {!isMobile &&
          showMagnifier &&
          createPortal(
            <div
              className="fixed z-[9999] top-[100px] left-[650px] w-[500px] h-[500px] rounded-lg shadow-lg"
              style={{
                backgroundImage: `url('${images[index]}')`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: `400% 400%`,
                backgroundPositionX: `${-x * 4 + 100}px`,
                backgroundPositionY: `${-y * 4 + 100}px`,
                border: '1px solid lightgray',
              }}
            ></div>,
            document.body,
          )}

        {/* Custom Navigation Buttons */}
        <button
          ref={prevRef}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 disabled:opacity-0"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          ref={nextRef}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 disabled:opacity-0"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Thumbnail Swiper */}
      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={10}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="thumbs-swiper"
      >
        {images.map((img, index) => (
          <SwiperSlide key={index}>
            <button className="w-full relative aspect-square rounded-md overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary">
              <img
                src={img || '/placeholder.svg'}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-contain"
                style={{ objectFit: 'contain' }}
              />
              <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors" />
            </button>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
