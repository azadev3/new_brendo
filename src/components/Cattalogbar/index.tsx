import React, { LegacyRef } from 'react';

interface CatalogBarProps {
    isCatalogOpen: boolean;
    setIsCatalogOpen: (value: boolean) => void;
    ref?: LegacyRef<HTMLDivElement> | undefined;
}

export const CatalogBar: React.FC<CatalogBarProps> = ({
    isCatalogOpen,
    setIsCatalogOpen,
}) => {
    return (
        <div
            className=" absolute top-[100%] w-full h-[200vh] px-10 py-2 z-[99999999999]"
            style={isCatalogOpen ? { display: 'block' } : { display: 'none' }}
        >
            <div
                className="h-[200vh] bg-black bg-opacity-60 w-full absolute top-0 left-0 z-[-1] "
                onClick={() => {
                    setIsCatalogOpen(false);
                }}
            ></div>
            {/* <ClothingMenu ref={ref} setIsCatalogOpen={setIsCatalogOpen} /> */}
        </div>
    );
};
