import React, { ReactNode } from 'react';

interface NoneToBlueProps {
    children: ReactNode;
    isactive?: boolean;
    action?: () => void;
}

const NoneToBlue: React.FC<NoneToBlueProps> = ({
    children,
    isactive = false,
    action,
}) => {
    return (
        <button
            onClick={action}
            className={`rounded-[100px] h-fit duration-300 ${
                isactive ? 'bg-[#3873C3] text-white ' : 'bg-none'
            }  px-[28px] py-[14px] leading-[19.5px]   border border-black border-opacity-10`}
        >
            <p className="text-[16px] font-medium text-nowrap leading-[19.5px]">
                {children}
            </p>
        </button>
    );
};
export const NoneTolightBlue = ({
    children,
    isactive = false,
    action = () => {},
}: {
    isactive?: boolean;
    children: ReactNode;
    action?: () => void;
}) => {
    return (
        <button
            onClick={action}
            className={`rounded-[100px] duration-300 text-nowrap ${
                isactive ? 'bg-[#B1C7E4]' : ''
            } hover:text-black bg-none px-[28px] py-[14px]   max-sm:w-full w-fit  border text-[16px]  leading-[19px] border-black border-opacity-10`}
        >
            {children}
        </button>
    );
};
export default NoneToBlue;
