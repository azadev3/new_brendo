import { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { Tiktok, Tiktoks } from '../../setting/Types';

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

export default function InstaqramSlider({
    action,
    instragrams,
}: {
    action: (i: number) => void;
    instragrams: Tiktoks | undefined;
}) {
    const swiperRef = useRef<any>();
    const [isLast, setisLast] = useState(false);
    const [isFirst, setisFirst] = useState(true);

    const handlePrev = () => {
        if (swiperRef.current && swiperRef.current.swiper) {
            swiperRef.current.swiper.slidePrev();
        }
    };
    const handleNext = () => {
        if (swiperRef.current && swiperRef.current.swiper) {
            swiperRef.current.swiper.slideNext();
        }
    };
    return (
        <div className="slider-container mt-[40px] relative flex items-center">
            <Swiper
                ref={swiperRef}
                onSlideChange={(swiper) => {
                    if (swiper?.isEnd) {
                        setisLast(true);
                    } else {
                        setisLast(false);
                    }
                    if (swiper?.activeIndex === 0) {
                        setisFirst(true);
                    } else {
                        setisFirst(false);
                    }
                }}
                spaceBetween={10} // Space between slides
                slidesPerView={'auto'} // Show one slide at a time
                loop={false} // Loop the slider
                // Enable pagination dots
                navigation={false} // Enable navigation buttons (optional)
                className="mySwiper !pl-[40px] max-sm:!pl-4"
            >
                {instragrams?.map((story: Tiktok, i: number) => (
                    <SwiperSlide className="!w-fit" key={i}>
                        <div
                            className="flex flex-col self-stretch my-auto w-[120px] cursor-pointer"
                            onClick={() => action(i)}
                        >
                            <img
                                loading="lazy"
                                src={story.image}
                                className="object-cover self-center max-w-full aspect-square rounded-[100px] w-[120px]"
                            />
                            <div className="mt-3 text-center">
                                {story.title}
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
                {/* {Array.from({ length: 20 }).map((_, i) => (
                    
                ))} */}
            </Swiper>
            <div className="block max-sm:hidden">
                <button
                    style={!isFirst ? { display: 'flex' } : { display: 'none' }}
                    onClick={handlePrev}
                    className=" absolute   left-[20px] top-[35px]  z-50 w-[52px] h-[52px] rounded-full flex justify-center items-center shadow-2xl bg-white"
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
                </button>{' '}
                <button
                    onClick={handleNext}
                    className=" absolute right-[20px] rotate-180 top-[35px]  z-50 w-[52px] h-[52px] rounded-full flex justify-center items-center shadow-2xl bg-white"
                    style={!isLast ? { display: 'flex' } : { display: 'none' }}
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
                </button>{' '}
            </div>
        </div>
    );
}
