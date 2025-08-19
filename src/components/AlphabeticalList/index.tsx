import React, { useRef } from 'react';
import { Brand } from '../../setting/Types';

interface AlphabeticalListProps {
  letters: string[];
  Brends?: Brand[];
}

const AlphabeticalList: React.FC<AlphabeticalListProps> = ({
  letters,
  Brends,
}) => {
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleLetterClick = (index: number) => {
    sectionRefs.current[index]?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="flex flex-col whitespace-nowrap">
      <div className="flex flex-col w-full text-xl font-light text-black  max-md:max-w-full">
        <nav className="flex w-[100vw]  max-sm:overflow-x-scroll pb-6 no-sc max-w-full  overflow-auto gap-7 items-center max-md:max-w-full justify-between hide-scrollbar">
          {letters.map((letter, index) => (
            <div
              key={letter}
              className="self-stretch my-auto cursor-pointer"
              onClick={() => handleLetterClick(index)}>
              {letter}
            </div>
          ))}
        </nav>
        <div className="mt-7 w-full border border-solid border-black border-opacity-60 min-h-[1px] max-md:max-w-full" />
      </div>
      <div className="grid lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-2 items-start mt-10 w-full max-md:max-w-full hide-scrollbar">
        {letters.map((letter, index) => (
          <div
            className="w-full min-w-[230px] pt-[20px]"
            key={letter}
            ref={(el) => (sectionRefs.current[index] = el)}>
            <div className="flex flex-wrap gap-10 items-center max-md:max-w-full">
              <div className="flex gap-5 items-start self-stretch my-auto">
                <div className="text-xl font-semibold text-[#B1C7E4] w-[43px]">
                  {letter}
                </div>
                <div className="flex flex-col text-base font-medium text-black text-opacity-80 w-[43px]">
                  {Brends?.filter((brad) => brad.title.startsWith(letter)).map(
                    (item, i) => (
                      <div key={i} className={i > 0 ? 'mt-4' : ''}>
                        {item.title}
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
            {index < letters.length - 1 && (
              <div className="self-stretch mt-5 w-full border border-solid border-black border-opacity-10 min-h-[1px] max-md:max-w-full" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default AlphabeticalList;
