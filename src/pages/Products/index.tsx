'use client';
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
  lazy,
  Suspense,
  memo,
} from 'react';
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import type {
  Category,
  Filter,
  Product,
  ProductResponse,
  TranslationsKeys,
} from '../../setting/Types';
import GETRequest from '../../setting/Request';
import Loading, { LoadingNoFix } from '../../components/Loading';
import ROUTES from '../../setting/routes';
import axios from 'axios';
import DropdownItemC from './DropdownItemC';

export interface SubCategoriesThirdCategories {
  id: number;
  title: string | null;
}

export interface SubCategories {
  id: number;
  title: string | null;
  third_categories: SubCategoriesThirdCategories[];
}

export interface NewFilterOptions {
  id: number;
  title: string | null;
  color_code: string | null;
}

export interface NewFilters {
  id: number;
  title: string | null;
  options: NewFilterOptions[];
}

export interface NewFiltersInterface {
  id: number;
  title: string;
  image: string;
  filters: NewFilters[];
  subCategories: SubCategories[];
}

// Lazy load components
const Header = lazy(() => import('../../components/Header'));
const Footer = lazy(() =>
  import('../../components/Footer').then(module => ({ default: module.Footer })),
);
const ProductCard = lazy(() => import('../../components/ProductCArd'));
const MobileFilter = lazy(() => import('./MobileFilter'));

// Brand type
type Brand = {
  id: number;
  title: string;
  image?: string;
};

// Loading skeleton components
const FilterSkeleton = memo(() => (
  <div className="space-y-4">
    {[1, 2, 3, 4].map(i => (
      <div key={i} className="h-12 bg-gray-200 rounded-full animate-pulse" />
    ))}
  </div>
));

const ProductGridSkeleton = memo(() => (
  <div className="w-full justify-items-center grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 mt-6">
    {Array.from({ length: 8 }).map((_, i) => (
      <div key={i} className="w-full h-64 bg-gray-200 rounded-lg animate-pulse" />
    ))}
  </div>
));

// Optimized dropdown components
const DropdownItem = memo(({ data }: { data: Category }) => {
  const navigate = useNavigate();
  const { lang = 'ru' } = useParams<{ lang: string }>();
  const location = useLocation();

  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const subCategory = queryParams.get('subCategory');
  const category = queryParams.get('category');
  const third_category_id = queryParams.get('third_category_id');

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(category ? +category === data.id : false);
  }, [category, data.id]);

  const handleNavigate = useCallback(
    (path: string) => {
      navigate(path);
    },
    [navigate],
  );

  const renderSubCategories = useMemo(
    () =>
      isOpen && (
        <div className="flex flex-col w-full text-sm gap-3 my-3 mt-5">
          {data.subCategories.map(SubCategory => {
            const isSelected = subCategory && +subCategory === SubCategory.id;

            if (isSelected) {
              return (
                <div key={SubCategory.id}>
                  <div
                    className="overflow-hidden px-4 py-2.5 w-full text-white bg-[#3873C3] rounded-[100px] flex flex-row justify-between cursor-pointer"
                    onClick={() =>
                      handleNavigate(
                        `/${lang}/${
                          ROUTES.product[lang as keyof typeof ROUTES.product]
                        }?category=${data.id}`,
                      )
                    }
                  >
                    {SubCategory.title}
                    <img
                      style={{ transform: 'rotate(180deg)' }}
                      loading="lazy"
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/67247d6cece276d38b6843cadeec5ef50381594d81ab035a8f6139f4bac01ffa?placeholderIfAbsent=true&apiKey=2d5d82cf417847beb8cd2fbbc5e3c099"
                      className="object-contain shrink-0 w-6 aspect-square"
                      alt="Dropdown Icon"
                    />
                  </div>
                  <div className="bg-[#FAFAFA] mt-1 rounded-xl overflow-hidden">
                    {SubCategory.third_categories.map(item => {
                      const isThirdSelected =
                        third_category_id && +third_category_id === item.id;

                      return (
                        <p
                          key={item.id}
                          className={`h-[44px] w-full px-[16px] py-[14px] text-[14px] font-normal border-b border-[#E5E5E5] cursor-pointer hover:bg-gray-50 transition-colors ${
                            isThirdSelected ? 'bg-[#EBF2FF] font-medium' : ''
                          }`}
                          onClick={() =>
                            handleNavigate(
                              `/${lang}/${
                                ROUTES.product[lang as keyof typeof ROUTES.product]
                              }?category=${data.id}&subCategory=${
                                SubCategory.id
                              }&third_category_id=${item.id}`,
                            )
                          }
                        >
                          {item.title}
                        </p>
                      );
                    })}
                  </div>
                </div>
              );
            }

            return (
              <div
                key={SubCategory.id}
                className="overflow-hidden px-4 py-2.5 w-full text-black bg-[#F5F5F5] rounded-[100px] flex flex-row justify-between cursor-pointer hover:bg-gray-200 transition-colors"
                onClick={() =>
                  handleNavigate(
                    `/${lang}/${
                      ROUTES.product[lang as keyof typeof ROUTES.product]
                    }?category=${data.id}&subCategory=${SubCategory.id}`,
                  )
                }
              >
                {SubCategory.title}
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/67247d6cece276d38b6843cadeec5ef50381594d81ab035a8f6139f4bac01ffa?placeholderIfAbsent=true&apiKey=2d5d82cf417847beb8cd2fbbc5e3c099"
                  className="object-contain shrink-0 w-6 aspect-square"
                  alt="Dropdown Icon"
                />
              </div>
            );
          })}
        </div>
      ),
    [isOpen, data.subCategories, subCategory, third_category_id, lang, handleNavigate],
  );

  const currentPath = useMemo(() => {
    const baseRoute = `/${lang}/${ROUTES.product[lang as keyof typeof ROUTES.product]}`;
    return category && +category === data.id ? baseRoute : `${baseRoute}?category=${data.id}`;
  }, [lang, category, data.id]);

  return (
    <div className="flex flex-col w-full">
      <Link to={currentPath}>
        <div className="flex flex-col w-full text-base">
          <div
            className={`flex overflow-hidden flex-row gap-5 justify-between px-4 py-3.5 w-full rounded-[100px] cursor-pointer transition-colors hover:bg-gray-200 ${
              category && +category === data.id ? 'bg-neutral-100' : 'bg-neutral-100'
            }`}
          >
            <div className="my-auto font-semibold truncate">{data.title}</div>
            <img
              style={isOpen ? { transform: 'rotate(180deg)' } : {}}
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/67247d6cece276d38b6843cadeec5ef50381594d81ab035a8f6139f4bac01ffa?placeholderIfAbsent=true&apiKey=2d5d82cf417847beb8cd2fbbc5e3c099"
              className="object-contain shrink-0 w-6 aspect-square transition-transform"
              alt="Dropdown Icon"
            />
          </div>
        </div>
      </Link>
      {renderSubCategories}
    </div>
  );
});

const DropdownItemFilter = memo(
  ({
    data,
    setoptions,
    options,
  }: {
    data: Filter;
    setoptions: (par: any) => void;
    options: number[];
  }) => {
    const { lang = 'ru' } = useParams<{ lang: string }>();
    const { data: tarnslation } = GETRequest<TranslationsKeys>(`/translates`, 'translates', [
      lang,
    ]);
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const toggleDropdown = useCallback(() => {
      setIsOpen(prev => !prev);
    }, []);

    const filteredOptions = useMemo(
      () =>
        data.options.filter(item =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
      [data.options, searchTerm],
    );

    const handleOptionClick = useCallback(
      (itemId: number) => {
        const isSelected = options.includes(itemId);
        if (isSelected) {
          setoptions(options.filter(id => id !== itemId));
        } else {
          setoptions([...options, itemId]);
        }
      },
      [options, setoptions],
    );

    return (
      <div className="flex flex-col w-full">
        <div className="flex flex-col w-full text-base">
          <div
            className="flex overflow-hidden flex-row gap-5 justify-between px-4 py-3.5 w-full bg-neutral-100 rounded-[100px] cursor-pointer hover:bg-gray-200 transition-colors"
            onClick={toggleDropdown}
          >
            <div className="my-auto">{data.title}</div>
            <img
              style={isOpen ? { transform: 'rotate(180deg)' } : {}}
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/67247d6cece276d38b6843cadeec5ef50381594d81ab035a8f6139f4bac01ffa?placeholderIfAbsent=true&apiKey=2d5d82cf417847beb8cd2fbbc5e3c099"
              className="object-contain shrink-0 w-6 aspect-square transition-transform"
              alt="Dropdown Icon"
            />
          </div>
        </div>

        {isOpen && (
          <div className="bg-[#F5F5F5] rounded-[20px] mt-3 max-h-[300px] overflow-y-auto p-5">
            <div className="mb-4">
              <input
                type="text"
                placeholder={`${data.title} ${tarnslation?.bro_tit || 'axtar'}`}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 text-sm border border-[#E5E5E5] rounded-md outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="flex flex-row flex-wrap justify-start gap-[14px]">
              {filteredOptions.map(item => {
                const isSelected = options.includes(item.id);

                return item.color_code ? (
                  <div
                    key={item.id}
                    className="flex justify-center items-center flex-col cursor-pointer"
                    onClick={() => handleOptionClick(item.id)}
                  >
                    <div
                      style={{
                        backgroundColor: item.color_code,
                        border: isSelected ? '2px solid #3873C3' : '1px solid #ccc',
                      }}
                      className="w-11 h-11 rounded-full flex justify-center items-center transition-all duration-200 hover:scale-105"
                    >
                      {isSelected && (
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path
                            d="M4.16675 9.99992L8.33341 14.1666L16.6667 5.83325"
                            stroke="black"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                    <p className="text-[10px] mt-2 text-black text-opacity-60">{item.title}</p>
                  </div>
                ) : (
                  <div
                    key={item.id}
                    onClick={() => handleOptionClick(item.id)}
                    className={`overflow-hidden px-4 py-3.5 cursor-pointer rounded-[100px] text-sm transition-all duration-200 hover:scale-105 ${
                      isSelected
                        ? 'bg-[#3873C3] text-white'
                        : 'bg-[#FCFCFC] text-black hover:bg-gray-100'
                    }`}
                  >
                    {item.title}
                  </div>
                );
              })}

              {filteredOptions.length === 0 && (
                <div className="text-gray-500 text-sm">
                  {tarnslation?.netice_yoxdur || 'Nəticə yoxdur'}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  },
);

const DropdownItemBrand = memo(
  ({
    brands,
    selectedBrandIds,
    onSelectBrand,
  }: {
    brands: Brand[];
    selectedBrandIds: number[];
    onSelectBrand: (brandIds: number[]) => void;
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const { lang = 'ru' } = useParams<{ lang: string }>();
    const { data: tarnslation } = GETRequest<TranslationsKeys>(`/translates`, 'translates', [
      lang,
    ]);

    const toggleDropdown = useCallback(() => setIsOpen(prev => !prev), []);

    const handleBrandClick = useCallback(
      (brandId: number) => {
        if (selectedBrandIds.includes(brandId)) {
          onSelectBrand(selectedBrandIds.filter(id => id !== brandId));
        } else {
          onSelectBrand([...selectedBrandIds, brandId]);
        }
      },
      [selectedBrandIds, onSelectBrand],
    );

    const clearAll = useCallback(() => onSelectBrand([]), [onSelectBrand]);

    const filteredBrands = useMemo(
      () =>
        brands.filter(brand => brand.title.toLowerCase().includes(searchTerm.toLowerCase())),
      [brands, searchTerm],
    );

    return (
      <div className="flex flex-col w-full">
        <div className="flex flex-col w-full text-base">
          <div
            className="flex overflow-hidden flex-row gap-5 justify-between px-4 py-3.5 w-full bg-neutral-100 rounded-[100px] cursor-pointer hover:bg-gray-200 transition-colors"
            onClick={toggleDropdown}
          >
            <div className="my-auto">{tarnslation?.brendler_soz || 'Brendlər'}</div>
            <img
              style={isOpen ? { transform: 'rotate(180deg)' } : {}}
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/67247d6cece276d38b6843cadeec5ef50381594d81ab035a8f6139f4bac01ffa?placeholderIfAbsent=true&apiKey=2d5d82cf417847beb8cd2fbbc5e3c099"
              className="object-contain shrink-0 w-6 aspect-square transition-transform"
              alt="Dropdown Icon"
            />
          </div>
        </div>

        {isOpen && (
          <div className="bg-[#FAFAFA] mt-3 rounded-xl overflow-hidden max-h-[300px] overflow-y-auto">
            <div className="sticky top-0 bg-[#FAFAFA] z-10">
              <input
                type="text"
                placeholder={tarnslation?.brend_placeholder || 'Brend axtar...'}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 text-sm border-b border-[#E5E5E5] outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div
              className={`h-[44px] w-full px-[16px] py-[14px] text-[14px] font-normal border-b border-[#E5E5E5] cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedBrandIds.length === 0 ? 'bg-[#EBF2FF] font-medium' : ''
              }`}
              onClick={clearAll}
            >
              {tarnslation?.butun_brendler || 'Bütün brendlər'}
            </div>

            {filteredBrands.map(brand => (
              <div
                key={brand.id}
                className={`h-[44px] w-full px-[16px] py-[14px] text-[14px] font-normal border-b border-[#E5E5E5] cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedBrandIds.includes(brand.id) ? 'bg-[#EBF2FF] font-medium' : ''
                }`}
                onClick={() => handleBrandClick(brand.id)}
              >
                {brand.title}
              </div>
            ))}

            {filteredBrands.length === 0 && (
              <div className="px-4 py-3 text-sm text-gray-500">
                {tarnslation?.brend_not_found || 'Brend tapılmadı'}
              </div>
            )}
          </div>
        )}
      </div>
    );
  },
);

// Main Products Component
export default function Products({
  collectionProducts,
  slug,
}: {
  collectionProducts?: Product[];
  slug?: string;
}) {
  // State management
  const [checked, setChecked] = useState(false);
  const [Sort, setSort] = useState<string>('');
  const [minPrice, setminPrice] = useState<number>(0);
  const [maxPrice, setmaxPrice] = useState<number>(0);
  const [options, setoptions] = useState<number[]>([]);
  const [selectedBrandIds, setSelectedBrandIds] = useState<number[]>([]);
  const [, setIsFilterOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [collectionProductsData, setColProdData] = useState<Product[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();
  const { lang = 'ru' } = useParams<{ lang: string }>();

  // URL params
  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const subCategory = queryParams.get('subCategory');
  const category = queryParams.get('category');
  const brand_id = queryParams.get('brand_id');
  const max_price = queryParams.get('max_price');
  const min_price = queryParams.get('min_price');
  const is_season = queryParams.get('is_season');
  const is_popular = queryParams.get('is_popular');
  const is_discount = queryParams.get('discount');
  const third_category_id = queryParams.get('third_category_id');

  // API query string
  const brandQuery = useMemo(
    () =>
      selectedBrandIds.length ? selectedBrandIds.map(id => `brand_id[]=${id}`).join('&') : '',
    [selectedBrandIds],
  );

  const apiQuery = useMemo(() => {
    const params = [
      `page=${page}`,
      category ? `category_id=${category}` : '',
      subCategory ? `sub_category_id=${subCategory}` : '',
      is_discount === 'true' ? `discount=1` : '',
      Sort ? `sort=${Sort}` : '',
      minPrice > 0 ? `min_price=${minPrice}` : '',
      maxPrice > 0 ? `max_price=${maxPrice}` : '',
      is_popular ? `is_popular=${is_popular}` : '',
      is_season ? `is_season=${is_season}` : '',
      third_category_id ? `third_category_id=${third_category_id}` : '',
      brandQuery || '',
    ].filter(Boolean);

    return `/products?${params.join('&')}`;
  }, [
    page,
    category,
    subCategory,
    is_discount,
    Sort,
    minPrice,
    maxPrice,
    is_popular,
    is_season,
    third_category_id,
    brandQuery,
  ]);

  // API requests
  const { data: brands, isLoading: brandsLoading } = GETRequest<Brand[]>(`/brands`, 'brands', [
    lang,
  ]);
  const { data: categories, isLoading: categoriesLoading } = GETRequest<Category[]>(
    `/categories`,
    'categories',
    [lang],
  );
  const { data: tarnslation, isLoading: tarnslationLoading } = GETRequest<TranslationsKeys>(
    `/translates`,
    'translates',
    [lang],
  );
  const { data: filters, isLoading: filtersLoading } = GETRequest<Filter[]>(
    `/filters`,
    'filters',
    [lang],
  );
  const { data: product_hero, isLoading: product_heroLoading } = GETRequest<Response>(
    `/product_hero`,
    'product_hero',
    [lang],
  );

  const { data: products, isLoading: productsLoading } = GETRequest<ProductResponse>(
    apiQuery,
    'products',
    [
      lang,
      page,
      category,
      subCategory,
      checked,
      options,
      Sort,
      minPrice,
      maxPrice,
      is_popular,
      is_season,
      third_category_id,
      selectedBrandIds,
    ],
    { 'option_ids[]': options },
  );

  // Effects
  useEffect(() => {
    setoptions([]);
    if (min_price && +min_price > 0) setminPrice(+min_price);
    if (max_price && +max_price > 0) setmaxPrice(+max_price);
    if (is_discount) setChecked(true);
  }, [category, subCategory, max_price, min_price, brand_id, is_discount]);

  useEffect(() => {
    if (brand_id) {
      const ids = brand_id
        .split(',')
        .map(Number)
        .filter(n => !isNaN(n));
      setSelectedBrandIds(ids);
    } else {
      setSelectedBrandIds([]);
    }
  }, [brand_id]);

  useEffect(() => {
    setPage(1);
    setAllProducts([]);
    setHasMore(true);
  }, [
    category,
    subCategory,
    checked,
    options,
    Sort,
    minPrice,
    maxPrice,
    is_popular,
    is_season,
    third_category_id,
    selectedBrandIds,
  ]);

  useEffect(() => {
    if (!products) return;

    if (page === 1) {
      setAllProducts(products.data);
    } else {
      setAllProducts(prev => {
        const prevIds = new Set(prev.map(p => p.id));
        const uniqueNew = products.data.filter(p => !prevIds.has(p.id));
        return [...prev, ...uniqueNew];
      });
    }

    setHasMore(products.meta.current_page < products.meta.last_page);
  }, [products, page]);

  useEffect(() => {
    if (collectionProducts && collectionProducts.length > 0) {
      setColProdData(collectionProducts);
    } else {
      setColProdData([]);
    }
  }, [collectionProducts]);

  // Callbacks
  const handleBrandSelect = useCallback(
    (brandIds: number[]) => {
      setSelectedBrandIds(brandIds);
      setPage(1);

      const currentParams = new URLSearchParams(location.search);
      if (brandIds.length === 0) {
        currentParams.delete('brand_id');
      } else {
        currentParams.set('brand_id', brandIds.join(','));
      }

      navigate(
        `/${lang}/${
          ROUTES.product[lang as keyof typeof ROUTES.product]
        }?${currentParams.toString()}`,
        { replace: true },
      );
    },
    [location.search, navigate, lang],
  );

  const closeFilter = useCallback(() => {
    setIsFilterOpen(false);
  }, []);

  // Intersection Observer for infinite scroll
  const observer = useRef<IntersectionObserver | null>(null);
  const loaderCallback = useCallback(
    (node: HTMLDivElement | null) => {
      if (observer.current) observer.current.disconnect();

      if (node && hasMore && !productsLoading) {
        observer.current = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setPage(prev => prev + 1);
            }
          },
          { threshold: 0.1 },
        );
        observer.current.observe(node);
      }
    },
    [hasMore, productsLoading],
  );

  // Memoized data
  const renderProducts = useMemo(
    () =>
      collectionProductsData && collectionProductsData.length > 0
        ? collectionProductsData
        : allProducts,
    [collectionProductsData, allProducts],
  );

  const isInitialLoading = tarnslationLoading || product_heroLoading;

  // Kullanıcı bilgileri localStorage'dan
  const userStr = localStorage.getItem('user-info');
  const parsedUser = userStr ? JSON.parse(userStr) : null;
  const token = parsedUser?.token || '';

  // get filters by categories
  const [newFiltersData, setNewFiltersData] = React.useState<NewFiltersInterface | null>(null);
  const [newFiltersLoading, setNewFiltersLoading] = React.useState<boolean>(false);
  const fetchNewFilters = async () => {
    setNewFiltersLoading(true);
    try {
      const res = await axios.get(
        `https://admin.brendoo.com/api/category/${category}/get-filters`,
        {
          headers: {
            'Accept-Language': lang,
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.data) {
        setNewFiltersData(res.data);
        console.log(res.data, 'SALAM ALA COCUX!');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setNewFiltersLoading(false);
    }
  };

  React.useEffect(() => {
    fetchNewFilters();
  }, [category, lang]);

  if (isInitialLoading) {
    return <Loading />;
  }

  return (
    <div className="relative">
      <Suspense fallback={<div className="h-20 bg-gray-100" />}>
        <Header />
      </Suspense>

      <main className="mt-0">
        {/* Hero Section */}
        <section className="flex overflow-hidden flex-col bg-black">
          <div
            className="flex relative flex-col pt-10 pr-20 pb-36 pl-10 w-full min-h-[324px] max-md:px-5 max-md:pb-24 max-md:max-w-full"
            style={{
              //@ts-expect-error data.image
              backgroundImage: `url(${product_hero?.data.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            <div className="absolute inset-0 bg-black opacity-50"></div>

            <div className="flex relative gap-2 items-center self-start text-base">
              <Link
                to={`/${lang}/${ROUTES.home[lang as keyof typeof ROUTES.home]}`}
                className="flex gap-2 items-center"
              >
                <div className="self-stretch my-auto text-white">
                  {tarnslation?.Ana_səhifə}
                </div>
              </Link>
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/a06e1c6285cb46f6524f6d6023531f25dabadfc0b9b5097943e091c33f26f94a?placeholderIfAbsent=true&apiKey=2d5d82cf417847beb8cd2fbbc5e3c099"
                className="object-contain shrink-0 self-stretch my-auto w-6 aspect-square"
                alt="breadcrumb arrow"
              />
              <div className="self-stretch my-auto text-white text-opacity-80">
                {tarnslation?.Məhsullar}
              </div>
            </div>
            <div className="relative self-center mt-20 mb-0 text-4xl font-semibold text-white max-md:mt-10 max-md:mb-2.5 max-md:max-w-full">
              {
                //@ts-expect-error data.title
                slug?.length > 0 ? slug : product_hero?.data.title
              }
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="flex flex-col w-full max-md:px-5 max-sm:px-0">
          <div className="flex lg:flex-row flex-col mt-[60px] lg:px-[40px] px-[10px] gap-4">
            {/* Sidebar */}
            {category && category?.length > 0 ? (
              <section className="flex flex-col w-full lg:max-w-[330px]">
                <div className="text-xl font-semibold text-black">
                  {tarnslation?.Filter || 'Фильтр'}
                </div>
                {/* Desktop Filter - always visible on desktop */}
                <div className="hidden md:flex overflow-hidden flex-col px-5 py-6 mt-5 w-full rounded-3xl border border-solid border-black border-opacity-10">
                  <div className="flex flex-col mt-2 text-black whitespace-nowrap gap-4">
                    <label className="text-black">
                      {tarnslation?.Kateqoriyalar || 'Категории'}
                    </label>

                    {newFiltersLoading ? (
                      <FilterSkeleton />
                    ) : (
                      newFiltersData?.subCategories?.map(categoryItem => (
                        <DropdownItemC key={categoryItem.id} data={categoryItem} />
                      ))
                    )}

                    {newFiltersData?.filters?.map(item => (
                      <DropdownItemFilter
                        key={item.id}
                        options={options}
                        setoptions={setoptions}
                        data={item as any}
                      />
                    ))}

                    {/* Price Filter */}
                    <div className="flex flex-col mt-4 w-full text-sm whitespace-nowrap">
                      <label className="text-black">{tarnslation?.Qiymət || 'Цена'}</label>
                      <div className="flex overflow-hidden gap-2 p-1.5 mt-2 w-full bg-neutral-100 rounded-[100px] text-black text-opacity-60">
                        <input
                          onChange={e => setminPrice(+e.target.value)}
                          value={minPrice === 0 ? '' : minPrice}
                          type="number"
                          placeholder={tarnslation?.min_placeholder || 'мин'}
                          className="overflow-hidden p-3 bg-white rounded-[100px] outline-none w-full"
                        />
                        <input
                          onChange={e => setmaxPrice(+e.target.value)}
                          value={maxPrice === 0 ? '' : maxPrice}
                          type="number"
                          placeholder={tarnslation?.max_placeholder || 'макс'}
                          className="overflow-hidden p-3 bg-white rounded-[100px] outline-none w-full"
                        />
                      </div>
                    </div>

                    {/* Discount Checkbox */}
                    <div className="flex gap-3 items-center self-start mt-4 font-medium text-black text-opacity-80">
                      <div
                        onClick={() => setChecked(!checked)}
                        className={`flex shrink-0 self-stretch my-auto w-6 h-6 border border-solid border-black border-opacity-40 rounded-[100px] cursor-pointer transition-colors ${
                          checked ? 'bg-[#3873C3]' : ''
                        }`}
                      />
                      <div className="self-stretch my-auto">
                        {tarnslation?.Endirimli_məhsullar || 'Товары со скидкой'}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            ) : (
              <section className="flex flex-col w-full lg:max-w-[330px]">
                <div className="text-xl font-semibold text-black">
                  {tarnslation?.Filter || 'Фильтр'}
                </div>

                {/* Mobile Filter - only show on mobile */}
                <div className="md:hidden">
                  <Suspense
                    fallback={<div className="h-12 bg-gray-200 rounded-full animate-pulse" />}
                  >
                    <MobileFilter
                      translation={tarnslation}
                      selectedItems={{
                        category: category,
                        subCategory: null,
                        thirdCategory: null,
                        options: options,
                      }}
                      onClose={closeFilter}
                    >
                      <div className="p-4">
                        <p className="text-sm text-gray-600 mb-4">
                          {tarnslation?.Filter_description || 'Məhsulları filtrlə'}
                        </p>

                        {/* Mobile filter content */}
                        <div className="space-y-4">
                          {categoriesLoading ? (
                            <FilterSkeleton />
                          ) : (
                            categories?.map(categoryItem => (
                              <DropdownItem key={categoryItem.id} data={categoryItem} />
                            ))
                          )}

                          {brandsLoading ? (
                            <div className="h-12 bg-gray-200 rounded-full animate-pulse" />
                          ) : (
                            <DropdownItemBrand
                              brands={brands || []}
                              selectedBrandIds={selectedBrandIds}
                              onSelectBrand={handleBrandSelect}
                            />
                          )}
                        </div>
                      </div>
                    </MobileFilter>
                  </Suspense>
                </div>

                {/* Desktop Filter - always visible on desktop */}
                <div className="hidden md:flex overflow-hidden flex-col px-5 py-6 mt-5 w-full rounded-3xl border border-solid border-black border-opacity-10">
                  <div className="flex flex-col mt-2 text-black whitespace-nowrap gap-4">
                    <label className="text-black">
                      {tarnslation?.Kateqoriyalar || 'Категории'}
                    </label>

                    {categoriesLoading ? (
                      <FilterSkeleton />
                    ) : (
                      categories?.map(categoryItem => (
                        <DropdownItem key={categoryItem.id} data={categoryItem} />
                      ))
                    )}

                    {brandsLoading ? (
                      <div className="h-12 bg-gray-200 rounded-full animate-pulse" />
                    ) : (
                      <DropdownItemBrand
                        brands={brands || []}
                        selectedBrandIds={selectedBrandIds}
                        onSelectBrand={handleBrandSelect}
                      />
                    )}

                    {filtersLoading ? (
                      <FilterSkeleton />
                    ) : category ? (
                      categories
                        ?.find(item => item.id === +category)
                        ?.filters?.map(item => (
                          <DropdownItemFilter
                            key={item.id}
                            options={options}
                            setoptions={setoptions}
                            data={item}
                          />
                        ))
                    ) : (
                      filters?.map(item => (
                        <DropdownItemFilter
                          key={item.id}
                          options={options}
                          setoptions={setoptions}
                          data={item}
                        />
                      ))
                    )}

                    {/* Price Filter */}
                    <div className="flex flex-col mt-4 w-full text-sm whitespace-nowrap">
                      <label className="text-black">{tarnslation?.Qiymət || 'Цена'}</label>
                      <div className="flex overflow-hidden gap-2 p-1.5 mt-2 w-full bg-neutral-100 rounded-[100px] text-black text-opacity-60">
                        <input
                          onChange={e => setminPrice(+e.target.value)}
                          value={minPrice === 0 ? '' : minPrice}
                          type="number"
                          placeholder={tarnslation?.min_placeholder || 'мин'}
                          className="overflow-hidden p-3 bg-white rounded-[100px] outline-none w-full"
                        />
                        <input
                          onChange={e => setmaxPrice(+e.target.value)}
                          value={maxPrice === 0 ? '' : maxPrice}
                          type="number"
                          placeholder={tarnslation?.max_placeholder || 'макс'}
                          className="overflow-hidden p-3 bg-white rounded-[100px] outline-none w-full"
                        />
                      </div>
                    </div>

                    {/* Discount Checkbox */}
                    <div className="flex gap-3 items-center self-start mt-4 font-medium text-black text-opacity-80">
                      <div
                        onClick={() => setChecked(!checked)}
                        className={`flex shrink-0 self-stretch my-auto w-6 h-6 border border-solid border-black border-opacity-40 rounded-[100px] cursor-pointer transition-colors ${
                          checked ? 'bg-[#3873C3]' : ''
                        }`}
                      />
                      <div className="self-stretch my-auto">
                        {tarnslation?.Endirimli_məhsullar || 'Товары со скидкой'}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Products Section */}
            <section className="flex w-full my-8 flex-col rounded-none w-full">
              {/* Sort and Count */}
              <div
                style={{ display: slug && slug?.length > 0 ? 'none' : '' }}
                className="flex flex-wrap gap-5 items-center justify-between w-full max-md:max-w-full mt-[44px]"
              >
                <div className="flex gap-4 items-center flex-wrap">
                  <div className="self-stretch my-auto text-sm text-black text-opacity-60">
                    {tarnslation?.Sırala}
                  </div>
                  <div className="flex overflow-hidden gap-10 self-stretch px-4 py-3.5 my-auto text-base font-medium text-black bg-neutral-100 rounded-[100px] lg:w-[283px] w-[200px]">
                    <select
                      onChange={e => setSort(e.target.value)}
                      value={Sort}
                      className="w-full focus:outline-none bg-[#F5F5F5]"
                    >
                      <option value="">{tarnslation?.Sırala}</option>
                      <option value="A-Z">A-Z</option>
                      <option value="Z-A">Z-A</option>
                      <option value="expensive-cheap">{tarnslation?.Expensive_Cheap}</option>
                      <option value="cheap-expensive">{tarnslation?.Cheap_Expensive}</option>
                      <option value="old-new">{tarnslation?.Old_New}</option>
                      <option value="new-old">{tarnslation?.New_Old}</option>
                    </select>
                  </div>
                </div>
                <div className="">
                  <span className="mr-2">{tarnslation?.Количество_key || 'Məhsul sayı'}</span>{' '}
                  : {products?.meta?.total || 0}
                </div>
              </div>

              {/* Active Filters Display */}
              <div className="flex flex-row flex-wrap gap-3">
                {/* Category filter tag */}
                {category &&
                  categories
                    ?.filter((item: Category) => +category === item.id)
                    .map(item => (
                      <div
                        key={item.id}
                        className="flex gap-2.5 justify-center items-center self-start px-7 py-3.5 max-sm:mt-1 mt-5 text-base font-medium text-black whitespace-nowrap border border-solid border-black border-opacity-10 rounded-[100px] max-md:px-5"
                      >
                        <div className="self-stretch my-auto">{item.title}</div>
                        <Link
                          to={`/${lang}/${
                            ROUTES.product[lang as keyof typeof ROUTES.product]
                          }`}
                        >
                          <img
                            loading="lazy"
                            src="https://cdn.builder.io/api/v1/image/assets/TEMP/4cb50113a191ac3232ff04e9cd73f88231de4b607b8e1436abe0365b70e6b221?placeholderIfAbsent=true&apiKey=2d5d82cf417847beb8cd2fbbc5e3c099"
                            className="object-contain cursor-pointer shrink-0 self-stretch my-auto w-5 aspect-square"
                            alt="Remove filter"
                          />
                        </Link>
                      </div>
                    ))}
              </div>

              {/* Products Grid */}
              {filtersLoading ||
              brandsLoading ||
              categoriesLoading ||
              (productsLoading && page === 1) ? (
                <ProductGridSkeleton />
              ) : (
                <div className="w-full justify-items-center grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 mt-6">
                  <Suspense fallback={<ProductGridSkeleton />}>
                    {renderProducts.map(product => (
                      <ProductCard key={product.id} bg="grey" data={product} />
                    ))}
                  </Suspense>

                  {productsLoading && page > 1 && !slug?.length && (
                    <p className="w-full my-8 flex justify-center items-center col-span-full">
                      <LoadingNoFix />
                    </p>
                  )}

                  <div ref={loaderCallback} className="h-10 w-full col-span-full" />
                </div>
              )}
            </section>
          </div>
        </section>
      </main>

      <Suspense fallback={<div className="h-32 bg-gray-100" />}>
        <Footer />
      </Suspense>
    </div>
  );
}
