import { useEffect, useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import Borttomswipper from '../StoriesSwipper/borttomswipper';
import { Tiktoks } from '../../setting/Types';

// Import Swiper styles

// import required modules

export default function TickTokSwipperVertical({
    isopen,
    onclose,
    Currentslide,
    Tiktoks,
}: {
    Tiktoks: Tiktoks | undefined;
    isopen: boolean;
    onclose: () => void;
    Currentslide: number;
}) {
    const swiperRef = useRef<any>();
    const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);

    const [currentslide] = useState<number>(Currentslide);
    // setcurrentslide
    useEffect(() => {
        Currentslide !== currentslide &&
            swiperRef.current.swiper.slideTo(Currentslide);
    }, [Currentslide]);
    useEffect(() => {
        const interval = setInterval(() => {
            if (swiperRef.current && swiperRef.current.swiper) {
                swiperRef.current.swiper.slideNext();
            }
        }, 5000);

        return () => clearInterval(interval); // Cleanup interval on unmount
    }, []);
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return (
        <>
            <div
                className="w-[100vW] h-[100vh] text-white  fixed top-0 left-0 bg-black z-50 "
                style={isopen ? { display: 'block' } : { display: 'none' }}
            >
                <Swiper
                    direction={isMobile ? 'vertical' : 'horizontal'}
                    pagination={{
                        clickable: true,
                    }}
                    centeredSlides={isMobile ? false : true} // Center the active slide
                    spaceBetween={isMobile ? 0 : 100}
                    slidesPerView={isMobile ? 1 : 'auto'}
                    className=" !h-screen"
                >
                    {Tiktoks?.map((item, i: number) => (
                        <SwiperSlide
                            className={`${
                                !isMobile ? '!w-fit' : ' w-full  !h-screen '
                            }`}
                            key={i}
                        >
                            <div className="w-full h-[100vh]  flex justify-center items-center">
                                <div
                                    className={`relative max-sm:scale-100  scale-125`}
                                >
                                    <img
                                        src={item.image}
                                        alt=""
                                        className="rounded-[20px] overflow-hidden  object-cover min-w-[300px] w-full h-[400px]"
                                    />

                                    <Borttomswipper
                                        products={item.products}
                                        isopen={true}
                                    />
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                    {/* <SwiperSlide>Slide 2</SwiperSlide>
                    <SwiperSlide>Slide 3</SwiperSlide>
                    <SwiperSlide>Slide 4</SwiperSlide>
                    <SwiperSlide>Slide 5</SwiperSlide>
                    <SwiperSlide>Slide 6</SwiperSlide>
                    <SwiperSlide>Slide 7</SwiperSlide>
                    <SwiperSlide>Slide 8</SwiperSlide>
                    <SwiperSlide>Slide 9</SwiperSlide> */}
                </Swiper>
                <svg
                    onClick={onclose}
                    className="fixed top-4 left-4 cursor-pointer z-[100] "
                    width="56"
                    height="56"
                    viewBox="0 0 56 56"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <rect
                        width="56"
                        height="56"
                        rx="28"
                        fill="white"
                        fillOpacity="0.12"
                    />
                    <path
                        d="M34 22L22 34"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M22 22L34 34"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>
        </>
    );
}
