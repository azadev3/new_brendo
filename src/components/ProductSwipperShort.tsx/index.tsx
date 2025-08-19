import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';

// Sample slider items
// const sliderItems = [
//     {
//         id: 1,
//         content: 'Slide 1 Content',
//         imageUrl: 'https://via.placeholder.com/600x400/ff7f7f',
//     },
//     {
//         id: 2,
//         content: 'Slide 2 Content',
//         imageUrl: 'https://via.placeholder.com/600x400/7f7fff',
//     },
//     {
//         id: 3,
//         content: 'Slide 3 Content',
//         imageUrl: 'https://via.placeholder.com/600x400/7fff7f',
//     },
//     // Add more slides as needed
// ];
interface Proops {
    bg: 'white' | 'grey';
}
export default function ProductSwipperShort({}: Proops) {
    const swiperRef = useRef<any>();
    const handleNext = () => {
        if (swiperRef.current && swiperRef.current.swiper) {
            swiperRef.current.swiper.slideNext();
        }
    };

    const handlePrev = () => {
        if (swiperRef.current && swiperRef.current.swiper) {
            swiperRef.current.swiper.slidePrev();
        }
    };

    return (
        <div className="slider-container  relative flex justify-center items-center lg:w-[70%] w-full">
            <Swiper
                ref={swiperRef}
                spaceBetween={10} // Space between slides
                breakpoints={{
                    268: {
                        slidesPerView: 'auto',
                    },
                    568: {
                        slidesPerView: 'auto',
                    },
                    768: {
                        slidesPerView: 3,
                    },
                }}
                loop={false} // Loop the slider
                // Enable pagination dots
                navigation={false} // Enable navigation buttons (optional)
                className="mySwiper max-sm:!pl-4"
            >
                {Array.from({ length: 10 }).map((_, i) => (
                    <SwiperSlide
                        key={i}
                        className="!flex !justify-center max-sm:!block max-sm:!w-[80vw]  "
                    >
                        {/* <ProductCard isnew={i === 3} bg={bg} issale={i === 0} /> */}
                    </SwiperSlide>
                ))}
            </Swiper>
            <button
                onClick={handlePrev}
                className=" absolute left-[-28px] max-sm:hidden z-30 w-[52px] h-[52px] rounded-full flex justify-center items-center shadow-2xl bg-white"
            >
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M14.5 18L8.5 12L14.5 6"
                        stroke="black"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button>
            <button
                onClick={handleNext}
                className=" absolute right-[-20px]  max-sm:hidden z-30 w-[52px] h-[52px] rounded-full flex justify-center items-center shadow-2xl bg-white rotate-180"
            >
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M14.5 18L8.5 12L14.5 6"
                        stroke="black"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button>
        </div>
    );
}
