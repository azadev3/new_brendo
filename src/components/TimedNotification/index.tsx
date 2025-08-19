import React, { useEffect, useState } from 'react';

// interface SpecialData {
//     minute: number;
//     image: string;
//     discount: string;
//     description: string;
// }

// interface Special {
//     is_special: boolean;
//     data: SpecialData;
// }

// interface TimedSpecialNotificationProps {
//     special: Special;
//     lang: string;
//     translation: {
//         Məhsullara_bax: string;
//     };
//     ROUTES: {
//         product: {
//             [key: string]: string;
//         };
//     };
// }

const TimedSpecialNotification: React.FC<any> = ({
    special,
    // lang,
    // translation,
    // ROUTES,
}) => {
    // const navigate = useNavigate();
    const [isSpecialOpen, setIsSpecialOpen] = useState(false);

    useEffect(() => {
        // Check if special offer exists and has timing data
        if (special?.is_special && special?.data?.minute) {
            const lastShownTime = localStorage.getItem(
                'specialNotificationLastShown'
            );
            const currentTime = new Date().getTime();

            // Convert minutes to milliseconds
            const expirationTime = special.data.minute * 60 * 1000;

            // Show notification if:
            // 1. Never shown before (lastShownTime is null)
            // 2. Last shown time has expired (current time - last shown time > expiration time)
            if (
                !lastShownTime ||
                currentTime - parseInt(lastShownTime) > expirationTime
            ) {
                setIsSpecialOpen(true);
                localStorage.setItem(
                    'specialNotificationLastShown',
                    currentTime.toString()
                );
            }
        }
    }, [special]);

    const closeNotification = () => {
        setIsSpecialOpen(false);
    };

    if (!isSpecialOpen || !special?.is_special) return null;

    return (
        <div className="w-full h-full bg-opacity-60 z-[9999999999999] fixed top-0 flex justify-center items-center">
            <div className="bg-black bg-opacity-60 backdrop-blur-sm absolute top-0 w-full h-full"></div>
            <div style={{ paddingBottom: "48px" }} className="bg-white max-w-[520px] mx-[40px] rounded-3xl z-30 overflow-hidden flex flex-col justify-center items-center relative">
                <img
                    src={special.data?.image}
                    alt=""
                    className="w-full max-h-[300px] object-cover"
                />
                <h5 className="text-[#FD0769] mt-5 text-[28px] font-semibold text-center mx-[40px] max-sm:text-[22px]">
                    {special.data?.discount}
                </h5>
                <p className="text-[16px] font-normal text-black opacity-80 text-center mx-[40px] max-sm:text-[12px]">
                    {special.data?.description}
                </p>
                {/* <button
                    className="bg-[#3873C3] w-full max-sm:w-[260px] max-w-[440px] mb-10 mt-[28px] px-4 rounded-[100px] text-white min-h-[52px]"
                    onClick={() =>
                        navigate(
                            `/${lang}/${ROUTES.product[lang]}?is_discount=1`
                        )
                    }
                >
                    {translation?.Məhsullara_bax}
                </button> */}

                <button
                    className="absolute top-4 right-4"
                    onClick={closeNotification}
                >
                    <svg
                        width="48"
                        height="48"
                        viewBox="0 0 48 48"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <circle cx="24" cy="24" r="24" fill="#F5F5F5" />
                        <g clipPath="url(#clip0_2562_5665)">
                            <path
                                d="M30 18L18 30"
                                stroke="black"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M18 18L30 30"
                                stroke="black"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </g>
                        <defs>
                            <clipPath id="clip0_2562_5665">
                                <rect
                                    width="24"
                                    height="24"
                                    fill="white"
                                    transform="translate(12 12)"
                                />
                            </clipPath>
                        </defs>
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default TimedSpecialNotification;
