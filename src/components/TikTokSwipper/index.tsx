import { useRef, useState } from 'react';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { Tiktoks } from '../../setting/Types';

export default function TikTokSlider({
  action,
  Tiktoks,
}: {
  action: (id: number) => void;
  Tiktoks: Tiktoks | undefined;
}) {
  const swiperRef = useRef<any>(null);
  const [isLast, setIsLast] = useState(false);
  const [isFirst, setIsFirst] = useState(true);

  const handlePrev = () => {
    if (swiperRef.current && swiperRef.current.slidePrev) {
      swiperRef.current.slidePrev();
    }
  };

  const handleNext = () => {
    if (swiperRef.current && swiperRef.current.slideNext) {
      swiperRef.current.slideNext();
    }
  };

  return (
    <div className="slider-container mt-[24px] relative flex items-center justify-center">
      <Swiper
        onSlideChange={(swiper) => {
          setIsFirst(swiper.activeIndex === 0);
          setIsLast(swiper.isEnd);
        }}
        onReachEnd={() => setIsLast(true)}
        onReachBeginning={() => setIsFirst(true)}
        spaceBetween={10}
        slidesPerView="auto"
        loop={false}
        modules={[Navigation]}
        navigation={{
          prevEl: '.prev-button',
          nextEl: '.next-button',
        }}
        className="mySwiper !pl-[40px] max-sm:!pl-[16px]">
        {Tiktoks?.map((item, i) => (
          <SwiperSlide className="!w-[216px] max-sm:!w-[132px]" key={item.id}>
            <div
              onClick={() => action(i)}
              className="flex overflow-hidden flex-col justify-center text-xs font-semibold text-white w-[216px] max-sm:w-[132px] max-sm:h-[192px] border-[#A97EFF] border-2 p-2 rounded-[20px]">
              <div className="flex overflow-hidden flex-col rounded-3xl bg-neutral-100">
                <div className="flex relative flex-col px-5 pt-5 pb-48 w-full aspect-[0.714] max-sm:h-full cursor-pointer">
                  <video
                    loop
                    className="object-cover absolute inset-0 w-full h-full z-0"
                    src={item.image}
                  />
                  <div className=" absolute top-0 left-0 w-full h-full z-10 bg-black bg-opacity-20"></div>
                  <p className="z-20">{item.title} </p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="max-sm:hidden">
        {!isFirst && (
          <button
            onClick={handlePrev}
            aria-label="Previous slide"
            className=" absolute left-[20px] top-[40%] z-50 w-[52px] h-[52px] rounded-full flex justify-center items-center shadow-2xl bg-white">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M14.5 18L8.5 12L14.5 6"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}

        {!isLast && (
          <button
            onClick={handleNext}
            aria-label="Next slide"
            className="next-button absolute right-[20px] rotate-180 top-[40%] z-50 w-[52px] h-[52px] rounded-full flex justify-center items-center shadow-2xl bg-white">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M14.5 18L8.5 12L14.5 6"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
