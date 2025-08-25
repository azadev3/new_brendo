import { useEffect } from 'react';
import { ProductDetail } from '../../setting/Types';

type ProductsFiltersProps = {
  Productslingle: ProductDetail | undefined;
  setIsModalOpen: (isOpen: boolean) => void;
  setNotifyOptionId: (id: number | null) => void; // ✅
  setCurrentColor: (color: string) => void;
  currentColor: string;
  setIsInStock: (isInStock: boolean) => void;
  isOptionSelected: (filterName: string, optionName: string) => boolean;
  handleOptionSelect: (filterName: string, optionName: string, optionId: number) => void;
};

// Çoklu dil desteği için anahtarlar
const SIZE_KEYS   = ['Размер', 'Size', 'Ölçü'];
const COLOR_KEYS  = ['Цвет', 'Color', 'Rəng', 'Renk'];
const GENDER_KEYS = ['Пол', 'Gender', 'Cins', 'Cinsiyyət', 'Cinsiyet'];

const ProductFilters = ({
  Productslingle,
  setCurrentColor,
  setIsInStock,
  setIsModalOpen,
  setNotifyOptionId,
  handleOptionSelect,
  isOptionSelected,
}: ProductsFiltersProps) => {
  // ilk yüklemede ilk ölçünün stok bilgisini set et (eski davranış)
  useEffect(() => {
    const firstOption = Productslingle?.filters?.[0]?.options?.[0];
    if (firstOption) {
      setIsInStock(firstOption.is_stock);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOptionClick = (option: any, filterName: string) => {
    // renk seçildiyse rengin adını üst parent'a yaz
    if (COLOR_KEYS.includes(filterName)) {
      setCurrentColor(option.name);
    }

    // stok & bildirim sadece ÖLÇÜ için yönetilsin (eski mantık + modal)
    if (SIZE_KEYS.includes(filterName)) {
      setIsInStock(option.is_stock);
      if (!option?.is_stock) {
        setNotifyOptionId(option.option_id);
        setIsModalOpen(true);
      }
    }

    handleOptionSelect(filterName, option.name, option.option_id);
  };

  return (
    <div className="relative z-[0]">

      {/* ==== ÖLÇÜ (ESKİ BLOK AYNI, 🔔 ve kırmızı border geri) ==== */}
      {Productslingle?.filters
        .filter(f => SIZE_KEYS.includes(f.filter_name))
        .map(filter => (
          <div key={filter.filter_id} className="flex flex-col mt-7">
            <div className="text-sm text-black text-opacity-60">
              {filter.filter_name}
            </div>

            <div className="flex flex-wrap gap-2 mt-3 w-full text-xs text-black rounded">
              {filter.options.map(option => {
                const isSelected = isOptionSelected(filter.filter_name, option.name);
                const isOutOfStock = !option.is_stock;

                return (
                  <div
                    key={option.option_id}
                    className={`relative flex items-center justify-center px-3 py-3.5 rounded border text-center cursor-pointer border-solid text-xs
                      ${isSelected
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-black border-neutral-400'}
                      ${
                        isOutOfStock
                          // kırmızı border + yazı rengi (eski out-of-stock-custom varsa kalsın)
                          ? 'out-of-stock-custom border-red-500 text-red-500 cursor-not-allowed'
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
        ))}

      {/* ==== RENK (sadece İSİM, zil ve kırmızı border YOK) ==== */}
      {Productslingle?.filters
        .filter(f => COLOR_KEYS.includes(f.filter_name))
        .map(filter => (
          <div key={filter.filter_id} className="flex flex-col mt-7">
            <div className="text-sm text-black text-opacity-60">
              {filter.filter_name}
            </div>

            <div className="flex flex-wrap gap-2 mt-3 w-full text-xs text-black rounded">
              {filter.options.map(option => {
                const isSelected = isOptionSelected(filter.filter_name, option.name);
                return (
                  <div
                    key={option.option_id}
                    className={`relative flex items-center justify-center px-3 py-3.5 rounded border text-center cursor-pointer border-solid text-xs
                      ${isSelected
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-black border-neutral-400'}`}
                    onClick={() => handleOptionClick(option, filter.filter_name)}
                  >
                    {option.name}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

      {/* ==== CİNSİYET (sadece İSİM, zil ve kırmızı border YOK) ==== */}
      {Productslingle?.filters
        .filter(f => GENDER_KEYS.includes(f.filter_name))
        .map(filter => (
          <div key={filter.filter_id} className="flex flex-col mt-7">
            <div className="text-sm text-black text-opacity-60">
              {filter.filter_name}
            </div>

            <div className="flex flex-wrap gap-2 mt-3 w-full text-xs text-black rounded">
              {filter.options.map(option => {
                const isSelected = isOptionSelected(filter.filter_name, option.name);
                return (
                  <div
                    key={option.option_id}
                    className={`relative flex items-center justify-center px-3 py-3.5 rounded border text-center cursor-pointer border-solid text-xs
                      ${isSelected
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-black border-neutral-400'}`}
                    onClick={() => handleOptionClick(option, filter.filter_name)}
                  >
                    {option.name}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
    </div>
  );
};

export default ProductFilters;
