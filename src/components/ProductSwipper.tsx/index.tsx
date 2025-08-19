import { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import ProductCard from '../ProductCArd';
import { Product } from '../../setting/Types';

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
    data?: Product[];
}
export default function ProductSwipper({ bg, data }: Proops) {
    const swiperRef = useRef<any>();
    const [isLast, setIsLast] = useState(false);
    const [isFirst, setIsFirst] = useState(true);

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
        <div className="slider-container mt-[20px] relative flex justify-center items-center">
            <Swiper
                ref={swiperRef}
                spaceBetween={10} // Space between slides
                onSlideChange={(swiper) => {
                    setIsFirst(swiper.activeIndex === 0);
                    setIsLast(swiper.isEnd);
                }}
                breakpoints={{
                    268: {
                        slidesPerView: 'auto',

                        // centeredSlides: true,
                    },
                    568: {
                        slidesPerView: 2,
                        // centeredSlides: true,
                    },
                    1224: {
                        slidesPerView: 3,
                    },
                    1300: {
                        slidesPerView: 4,
                    },
                }}
                loop={false} // Loop the slider
                // Enable pagination dots
                onReachEnd={() => setIsLast(true)} // Explicitly handle end of slider
                onReachBeginning={() => setIsFirst(true)}
                navigation={false} // Enable navigation buttons (optional)
                className="mySwiper max-sm:!pl-4  !w-full"
            >
                {data?.map((item: Product, i: number) => (
                    <SwiperSlide
                        key={i}
                        className="!flex !justify-center max-sm:!w-fit"
                    >
                        <ProductCard
                            data={item}
                            isnew={i === 3}
                            bg={bg}
                            issale={i === 0}
                        />
                    </SwiperSlide>
                ))}
                {!data &&
                    Array.from({ length: 10 }).map((_, i) => (
                        <SwiperSlide
                            key={i}
                            className="!flex !justify-center max-sm:!w-fit"
                        >
                            <ProductCard isnew={false} bg={bg} issale={false} />
                        </SwiperSlide>
                    ))}
            </Swiper>
            {!isFirst && (
                <button
                    onClick={handlePrev}
                    className=" absolute max-sm:hidden left-[-28px] z-30 w-[52px] h-[52px] rounded-full flex justify-center items-center shadow-2xl bg-white"
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
            )}
            {!isLast && (
                <button
                    onClick={handleNext}
                    className=" absolute right-[-18px] max-sm:hidden z-30 w-[52px] h-[52px] rounded-full flex justify-center items-center shadow-2xl bg-white rotate-180"
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
            )}
        </div>
    );
}
