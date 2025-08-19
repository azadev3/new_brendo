import { useEffect } from 'react';
import { ProductDetail } from '../../setting/Types';

type ProductsFiltersProps = {
  Productslingle: ProductDetail | undefined;
  setIsModalOpen: (isOpen: boolean) => void;
  setNotifyOptionId: (id: number | null) => void; // ✅ eklendi
  setCurrentColor: (color: string) => void;
  currentColor: string;
  setIsInStock: (isInStock: boolean) => void;
  isOptionSelected: (filterName: string, optionName: string) => boolean;
  handleOptionSelect: (filterName: string, optionName: string, optionId: number) => void;
};

const ProductFilters = ({
  Productslingle,
  setCurrentColor,
  setIsInStock,
  setIsModalOpen,
  setNotifyOptionId, // ✅ prop geldi
  handleOptionSelect,
  isOptionSelected,
}: ProductsFiltersProps) => {
  useEffect(() => {
    const firstOption = Productslingle?.filters?.[0]?.options?.[0];
    if (firstOption) {
      setIsInStock(firstOption.is_stock);
    }
  }, []);

  const handleOptionClick = (option: any, filterName: string) => {
    setCurrentColor(option.name);
    setIsInStock(option.is_stock);

    if (!option?.is_stock) {
      setNotifyOptionId(option.option_id); // ✅ seçilen ölçü kaydediliyor
      setIsModalOpen(true); // ✅ modal açılıyor
      handleOptionSelect(filterName, option.name, option.option_id);
    } else {
      handleOptionSelect(filterName, option.name, option.option_id);
    }
  };

  return (
    <div className="relative z-[0]">
      {Productslingle?.filters.map(filter => {
        if (filter.filter_name === 'Размер') {
          return (
            <div key={filter.filter_id} className="flex flex-col mt-7">
              <div className="text-sm text-black text-opacity-60">{filter.filter_name}</div>

              <div className="flex flex-wrap gap-2 mt-3 w-full text-xs text-black rounded">
                {filter.options.map(option => {
                  const isSelected = isOptionSelected(filter.filter_name, option.name);
                  const isOutOfStock = !option.is_stock;

                  return (
                    <div
                      key={option.option_id}
                      className={`relative flex items-center justify-center px-3 py-3.5 rounded border text-center cursor-pointer border-solid text-xs
                        ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-black border-neutral-400'
                        }
                        ${
                          isOutOfStock
                            ? 'out-of-stock-custom text-gray-400 border-gray-300 cursor-not-allowed'
                            : ''
                        }`}
                      onClick={() => handleOptionClick(option, filter.filter_name)}
                    >
                      {option.name}

                      {isOutOfStock && (
                        <div
                          onClick={e => e.stopPropagation()}
                          className="absolute -top-2 -right-2 bg-yellow-400 text-white text-[16px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-md"
                          title=""
                        >
                          🛎️
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};

export default ProductFilters;
