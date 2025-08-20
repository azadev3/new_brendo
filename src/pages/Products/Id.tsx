import Header from '../../components/Header';
import { Footer } from '../../components/Footer';
import ProductCard from '../../components/ProductCArd';
import { useNavigate, useParams, Link } from 'react-router-dom';
import GETRequest, { axiosInstance } from '../../setting/Request';
import { GiHanger } from 'react-icons/gi';
import {
  Basket,
  Favorite,
  Product,
  ProductDetail,
  TranslationsKeys,
} from '../../setting/Types';
import Loading from '../../components/Loading';
import React, { useEffect, useState } from 'react';
import ROUTES from '../../setting/routes';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import ProductGallery from '../../components/product-gallery';
import { useQueryClient } from '@tanstack/react-query';
import { FaRubleSign } from 'react-icons/fa';
import ProductFilters from './ProductFilters';
import SelectSizeSidebar from './SelectSizeSidebar';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
// function extractData(input: string) {
//   const match = input.match(/(\d+)% \((\d+)\)/);
//   if (match) {
//     const [, procent, users] = match;
//     return {
//       procent: parseInt(procent, 10),
//       users: parseInt(users, 10),
//     };
//   }
//   return null;
// }

/* =======================
   GUEST CART HELPERS
   ======================= */
const GUEST_CART_KEY = 'guest_cart';

type GuestCartItem = {
  id: number;
  product: ProductDetail;
  quantity: number;
  price: string;
  options: { filter: string; option: string }[];
};

type GuestCart = {
  basket_items: GuestCartItem[];
  total_price: number;
  discount: number;
  final_price: number;
};

const getGuestCart = (): GuestCart => {
  try {
    return JSON.parse(
      localStorage.getItem(GUEST_CART_KEY) ||
        '{"basket_items": [], "total_price": 0, "discount": 0, "final_price": 0}',
    );
  } catch {
    return { basket_items: [], total_price: 0, discount: 0, final_price: 0 };
  }
};

const setGuestCart = (cart: GuestCart) => {
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart));
};

// const sameLine = (a: GuestCartItem, b: GuestCartItem) => {
//   if (a.product_id !== b.product_id) return false;
//   // yalnız bir ölçü (Size/Ölçü/Размер) üzrə müqayisə kifayətdir
//   const ao = a.options?.[0];
//   const bo = b.options?.[0];
//   if (!ao || !bo) return false;
//   return ao.filter_id === bo.filter_id && ao.option_id === bo.option_id;
// };

export default function ProductId() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notifyOptionId, setNotifyOptionId] = useState<number | null>(null);

  const collectionId = localStorage.getItem('collection_id') || '';
  const { lang = 'ru', slug } = useParams<{ lang: string; slug: string }>();

  const userStr = localStorage.getItem('user-info');
  const parse = userStr ? JSON.parse(userStr) : null;
  const token = parse?.token;

  const { data: Productslingle, isLoading: ProductslingleLoading } =
    GETRequest<ProductDetail>(`/productSingle/${slug}`, 'productSingle', [lang, slug]);

  const { data: tarnslation, isLoading: tarnslationLoading } =
    GETRequest<TranslationsKeys>(`/translates`, 'translates', [lang]);

  // oxşar məhsullar
  const [similarProducts, setSimilarProducts] = React.useState<Product[]>([]);
  const fetchSimilarProducts = async () => {
    try {
      const res = await axios.get(
        `https://admin.brendoo.com/api/more-products/${Productslingle?.id}`,
        { headers: { 'Accept-Language': lang || 'ru' } },
      );
      if (res.data) setSimilarProducts(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    if (slug && Productslingle?.id) {
      fetchSimilarProducts();
    }
  }, [Productslingle?.id, slug]);

  const [currentColor, setCurrentColor] = useState<string>('');
  const [currentOption, setCurrentOption] = useState<
    { filter_name: string; optionName: string; optionId: number }[]
  >([{ filter_name: '', optionName: '', optionId: 0 }]);

  const [isliked, setisliked] = useState<boolean>(false);
  const [isinbusked, setisinbusked] = useState<boolean>(false);
  const [IsSizeBarOpen, setIsSizeBarOpen] = useState<boolean>(false);
  const [openSideBar, setOpenSideBar] = useState(false);

  const { data: favorites } = GETRequest<Favorite[]>(`/favorites`, 'favorites', [lang]);
  const [isInStock, setIsInStock] = useState<boolean | null>(null);
  const { data: basked } = GETRequest<Basket>(`/basket_items`, 'basket_items', [lang]);

  const checkLikedProducts = () => {
    if (favorites?.some(item => item?.product?.id === Productslingle?.id)) {
      setisliked(true);
    } else {
      setisliked(false);
    }
  };

  const queryClient = useQueryClient();

  // SƏBƏTDƏ OLUB-OLMAMA (server + guest cart)
  useEffect(() => {
    let includes = false;

    // server səbəti (loginli)
    if (basked && Productslingle) {
      const selectedSize = currentOption.find(option =>
        ['Size', 'Ölçü', 'Размер'].includes(option.filter_name),
      );
      for (const item of basked.basket_items) {
        if (
          item.product?.id === Productslingle.id &&
          item.options?.some(
            (opt: any) => opt.option?.option_id === selectedSize?.optionId,
          )
        ) {
          includes = true;
          break;
        }
      }
    }

    if (!userStr && Productslingle && !includes) {
      const cart = getGuestCart(); // { basket_items: [...] }

      const sizeFilter = Productslingle.filters?.find((f: any) =>
        ['Size', 'Ölçü', 'Размер'].includes(f.filter_name),
      );

      const selectedSize = currentOption.find(o =>
        ['Size', 'Ölçü', 'Размер'].includes(o.filter_name),
      );

      if (sizeFilter && selectedSize) {
        const exists = cart.basket_items?.some(
          ci =>
            ci.product.id === Productslingle.id &&
            ci.options?.some(
              o =>
                o.filter === sizeFilter.filter_name &&
                o.option === selectedSize.optionName,
            ),
        );

        if (exists) includes = true;
      }
    }

    setisinbusked(includes);
  }, [basked, Productslingle, currentOption, userStr]);

  // favorit ilkin yoxlama
  useEffect(() => {
    checkLikedProducts();
  }, [favorites]);

  // stok modal
  useEffect(() => {
    if (isInStock === false) setIsModalOpen(true);
    else if (isInStock === true) setIsModalOpen(false);
  }, [isInStock]);

  // default opsionlar
  useEffect(() => {
    if (!Productslingle?.filters) return;

    const colorFilter = Productslingle.filters.find(
      item => item.filter_name === 'Color' || item.filter_name === 'Цвет',
    );
    const defaultColorOption = colorFilter?.options.find(option => option.is_default);
    if (defaultColorOption) setCurrentColor(defaultColorOption.name);

    const otherFilters = Productslingle?.filters.filter(
      item => item.filter_name !== 'Color' && item.filter_name !== 'Цвет',
    );

    const defaults: { filter_name: string; optionName: string; optionId: number }[] =
      [];
    otherFilters.forEach(filter => {
      const def = filter.options.find(item => item.is_default);
      if (def) {
        defaults.push({
          filter_name: filter.filter_name,
          optionName: def.name,
          optionId: +def.option_id,
        });
      }
    });
    if (defaults.length > 0) setCurrentOption(defaults);
  }, [Productslingle]);

  const handleOptionSelect = (
    filterName: string,
    optionName: string,
    optionId: number,
  ) => {
    const updated = currentOption.filter(option => option.filter_name !== filterName);
    updated.push({ filter_name: filterName, optionName, optionId });
    setCurrentOption(updated);

    if (!isInStock) {
      setNotifyOptionId(optionId);
    }
  };

  const isOptionSelected = (filterName: string, optionName: string): boolean =>
    currentOption.some(
      o => o.filter_name === filterName && o.optionName === optionName,
    );

  // SERVERƏ SƏBƏTƏ ƏLAVƏ ET (loginli üçün)
  const addToBasket = async (data: {
    product_id: number;
    quantity: number;
    price: number;
    token: string;
    options: { filter_id: number; option_id: number | undefined }[];
    collection_id?: string;
  }) => {
    const req_body = {
      product_id: data.product_id,
      quantity: data.quantity,
      price: data.price,
      options: data.options,
      collection_id: collectionId,
    };
    const req_body_none_collection_id = {
      product_id: data.product_id,
      quantity: data.quantity,
      price: data.price,
      options: data.options,
    };

    const response = await axios.post(
      'https://admin.brendoo.com/api/basket_items',
      collectionId?.length > 0 ? req_body : req_body_none_collection_id,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Accept-Language': lang || 'ru',
        },
      },
    );
    if (collectionId && collectionId?.length > 0)
      localStorage.removeItem('collection_id');
    return response.data;
  };

  // LOGIN OLMADAN da SƏBƏTƏ AT
  const handleAddToBasket = async () => {
    if (!Productslingle) return;

    // 1) ölçü seçilibmi?
    const sizeFilter = Productslingle.filters?.find((filter: any) =>
      ['Size', 'Ölçü', 'Размер'].includes(filter.filter_name),
    );
    const selectedSize = currentOption.find(option =>
      ['Size', 'Ölçü', 'Размер'].includes(option.filter_name),
    );
    if (!selectedSize) {
      toast.error(tarnslation?.olcu_secin_title || 'Ölçü seçin');
      return;
    }

    // 2) seçilən ölçü stokdadırmı?
    const selectedFilter = sizeFilter?.options.find(
      (option: any) => option.name === selectedSize.optionName,
    );
    if (!selectedFilter || !selectedFilter.is_stock) {
      toast.error(tarnslation?.bu_olcude_stokda_yox || 'Bu ölçü stokda yoxdur');
      return;
    }

    const optionsForApi = [
      { filter_id: sizeFilter!.filter_id, option_id: selectedFilter.option_id },
    ];

    console.log(optionsForApi);

    // 3) LOGIN YOXDUR → guest_cart (localStorage)

    if (!userStr) {
      const currentCart = getGuestCart();

      const price = +Productslingle.discounted_price || +Productslingle.price;
      const quantity = 1;

      const line: GuestCartItem = {
        id: Productslingle.id,
        product: Productslingle,
        quantity,
        price: price.toFixed(2),
        options: optionsForApi.map((opt: any) => ({
          filter: opt.filter_id, // backend-dən gələn filter adı
          option: opt.option_id, // backend-dən gələn option adı
        })),
      };

      const idx = currentCart.basket_items.findIndex(item => {
        if (item.id !== line.id) return false;

        const sizeOptA = item.options.find(o =>
          ['Size', 'Ölçü', 'Размер'].includes(o.filter.toString()),
        );
        const sizeOptB = line.options.find(o =>
          ['Size', 'Ölçü', 'Размер'].includes(o.filter.toString()),
        );

        return sizeOptA?.option === sizeOptB?.option;
      });

      if (idx === -1) {
        currentCart.basket_items.push(line);
      } else {
        currentCart.basket_items[idx].quantity += 1;
      }

      let total_price = 0;
      let discount = 0;
      let final_price = 0;

      currentCart.basket_items.forEach(item => {
        const original = +item.product.price;
        const discounted = +item.product.discounted_price;

        total_price += original * item.quantity;
        discount += (original - discounted) * item.quantity;
        final_price += discounted * item.quantity;
      });

      currentCart.total_price = total_price;
      currentCart.discount = discount;
      currentCart.final_price = final_price;

      // localStorage-yə yaz
      setGuestCart(currentCart);

      setisinbusked(true);
      toast.success(tarnslation?.handle_added || 'Məhsul səbətə əlavə olundu');
      return;
    }

    // 4) LOGIN VAR → serverə POST
    try {
      if (collectionId && collectionId?.length > 0) {
        await addToBasket({
          product_id: Productslingle.id,
          price: +Productslingle?.price,
          quantity: 1,
          token: token,
          options: optionsForApi,
          collection_id: collectionId,
        });
      } else {
        await addToBasket({
          product_id: Productslingle.id,
          price: +Productslingle?.price,
          quantity: 1,
          token: token,
          options: optionsForApi,
        });
      }

      toast.success(tarnslation?.handle_added || '');
      queryClient.invalidateQueries({ queryKey: ['basket_items'] });
      setisinbusked(true);
      window.location.reload();
    } catch (error) {
      console.log(error);
      toast.error('Error');
    }
  };

  const handleNotifyMe = async () => {
    try {
      if (!notifyOptionId) return;

      await axiosInstance.post(
        '/notify-me',
        {
          product_id: Productslingle?.id,
          option_id: notifyOptionId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      toast.success(tarnslation?.Notification_Success || 'Xəbər veriləcək!');
      setIsModalOpen(false);
    } catch (error) {
      toast.error(tarnslation?.Notification_Error || 'Xəta baş verdi!');
    }
  };

  const navigate = useNavigate();

  // disable şərtini ölçünün faktiki seçiminə bağlayaq
  const hasSize = currentOption.some(o =>
    ['Size', 'Ölçü', 'Размер'].includes(o.filter_name),
  );
  const isAddToBasketDisabled = !isInStock || !hasSize;

  const [favicon, setFavicon] = React.useState<{ image: string }>({ image: '' });
  const [faviconLoading, setFaviconLoading] = React.useState<boolean>(false);
  const getFavicon = async () => {
    setFaviconLoading(true);
    try {
      const res = await axios.get('https://admin.brendoo.com/api/favicon');
      if (res.data?.image) {
        setFavicon({ image: res.data.image });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setFaviconLoading(false);
    }
  };

  React.useEffect(() => {
    getFavicon();
  }, []);

  const changeFavicon = (faviconURL: string) => {
    let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = faviconURL;
  };

  const haslogo =
    favicon && favicon?.image && favicon?.image?.length > 0 ? favicon?.image : '';

  React.useEffect(() => {
    changeFavicon(haslogo);
  }, [favicon, haslogo]);

  if (ProductslingleLoading || tarnslationLoading || faviconLoading) {
    return <Loading />;
  }

  return (
    <div className="">
      <Helmet>
        <title>{Productslingle?.meta_title || 'My Page Title'}</title>
        <meta
          name="description"
          content={Productslingle?.meta_description || 'This is the page description'}
        />
        <meta
          name="keywords"
          content={Productslingle?.meta_keywords || 'keyword1, keyword2, keyword3'}
        />
      </Helmet>
      <Header />
      <main className=" lg:mt-[54px] mt-0 max-sm:mt-3">
        <div className="px-[40px] max-sm:px-4">
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              reloadDocument
              to={`/${lang}/${ROUTES.home[lang as keyof typeof ROUTES.product]}`}
            >
              <h6 className="text-nowrap self-stretch max-sm:text-[12px] my-auto text-black hover:text-blue-600">
                {tarnslation?.home}
              </h6>
            </Link>
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/64bb3b3dae771cd265db1accd95aa96f30bd9da3da88a57867743da53bebc0eb?placeholderIfAbsent=true&apiKey=2d5d82cf417847beb8cd2fbbc5e3c099"
              className="object-contain shrink-0 self-stretch my-auto w-6 aspect-square"
            />

            <Link
              reloadDocument
              to={`/${lang}/${ROUTES.product[lang as keyof typeof ROUTES.product]}`}
            >
              <h6 className="self-stretch  max-sm:text-[12px] my-auto hover:text-blue-600">
                {tarnslation?.Məhsullar}
              </h6>
            </Link>
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/64bb3b3dae771cd265db1accd95aa96f30bd9da3da88a57867743da53bebc0eb?placeholderIfAbsent=true&apiKey=2d5d82cf417847beb8cd2fbbc5e3c099"
              className="object-contain shrink-0 self-stretch my-auto w-6 aspect-square"
            />
            <h6 className=" self-stretch  max-sm:text-[12px] my-auto">
              {Productslingle?.title}
            </h6>
          </div>
        </div>
        <section className="flex lg:flex-row flex-col gap-10 mx-[40px]  max-sm:mx-4 relative">
          <div className=" lg:w-[40%] w-full ">
            <div className=" sticky top-[10px]">
              <ProductGallery
                images={Productslingle?.sliders.map(item => item.image) || []}
              />
            </div>
          </div>
          <section className="flex flex-col max-w-[650px] mt-[24px]">
            <div className="flex flex-col w-full max-md:max-w-full">
              <div className="isreturn-area">
                {typeof Productslingle?.is_return === 'boolean' &&
                Productslingle?.is_return === false ? (
                  <div className="return-tag noreturn">
                    <span>{tarnslation?.qaytarilmir_text || ''}</span>
                  </div>
                ) : typeof Productslingle?.is_return === 'boolean' &&
                  Productslingle?.is_return === true ? null : null}
              </div>
              <div
                style={{ marginTop: '12px' }}
                className="flex flex-col w-full text-black text-opacity-80 max-md:max-w-full"
              >
                {Productslingle?.discount && (
                  <div className="gap-2.5 self-start px-3 py-2 text-xs font-medium text-white bg-[#FF3C79] rounded-[100px]">
                    {Productslingle?.discount}% {tarnslation?.discount}
                  </div>
                )}

                <div className="mt-4 w-full text-3xl font-semibold text-black max-md:max-w-full">
                  {Productslingle?.title}
                </div>
                <div className="mt-4 w-full text-base max-md:max-w-full">
                  {Productslingle?.short_title}
                </div>
                <div className="mt-4 w-full text-sm max-md:max-w-full">
                  {tarnslation?.Məhsulun_kodu}:{Productslingle?.code}
                  <br />
                </div>
              </div>
              <div className="flex gap-3 items-center self-start mt-5">
                {Productslingle &&
                Productslingle.discount !== null &&
                Number(Productslingle.discount) > 0 ? (
                  <>
                    <div className="self-stretch my-auto text-base text-black text-opacity-60">
                      <span className="line-through flex items-center">
                        {Productslingle.price}
                        <FaRubleSign className="text-[13px] mt-2" />
                      </span>
                    </div>
                    <div className="self-stretch my-auto flex items-center text-2xl font-semibold text-rose-500">
                      {Productslingle.discounted_price}
                      <FaRubleSign className="text-[13px] mt-2" />
                    </div>
                  </>
                ) : (
                  <div className="self-stretch my-auto flex items-center text-2xl font-semibold text-black">
                    {Productslingle?.price}
                    <FaRubleSign className="text-[13px] mt-2" />
                  </div>
                )}
              </div>
            </div>

            <ProductFilters
              Productslingle={Productslingle}
              setIsModalOpen={setIsModalOpen}
              setNotifyOptionId={setNotifyOptionId}
              setCurrentColor={setCurrentColor}
              setIsInStock={setIsInStock}
              currentColor={currentColor}
              isOptionSelected={isOptionSelected}
              handleOptionSelect={handleOptionSelect}
            />

            {isModalOpen && (
              <div className="fixed inset-0 flex justify-center items-center bg-black/50 z-50">
                <div className="bg-white p-6 rounded-lg w-[300px] shadow-lg">
                  <h4 className="text-lg font-semibold mb-4">
                    {tarnslation?.Out_of_Stock || 'Bu ölçü stokda yoxdur'}
                  </h4>
                  <button
                    onClick={handleNotifyMe}
                    className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    {tarnslation?.Notify_Me || 'Notify Me'}
                  </button>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="w-full py-2 mt-2 border border-gray-400 rounded"
                  >
                    {tarnslation?.Cancel || 'Bağla'}
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-wrap justify-around gap-5 max-sm:justify-start items-center mt-7 w-full max-md:max-w-full">
              <div
                className={`flex gap-2 justify-center items-center self-stretch px-4 py-2.5 my-auto w-40 text-sm rounded-[100px] ${
                  Productslingle?.is_stock && isInStock
                    ? 'text-green-600 bg-emerald-50'
                    : 'text-red-600 bg-red-100'
                }`}
              >
                {Productslingle?.is_stock && isInStock ? (
                  <>
                    <img
                      loading="lazy"
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/3b62d68e0d6115b8dd376935f9a020305d201f125a5ae0023584b7f5eddf7971?placeholderIfAbsent=true&apiKey=2d5d82cf417847beb8cd2fbbc5e3c099"
                      className="object-contain shrink-0 self-stretch my-auto w-5 aspect-square"
                    />
                    <div className="self-stretch my-auto">
                      {tarnslation?.Stokda_var}
                    </div>
                  </>
                ) : (
                  <>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="object-contain shrink-0 self-stretch my-auto w-5 aspect-square"
                    >
                      <path
                        d="M15 5L5 15M5 5L15 15"
                        stroke="#DC2626"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="self-stretch my-auto truncate">
                      {tarnslation?.Out_of_Stock}
                    </div>
                  </>
                )}
              </div>

              <div className="flex gap-4 items-center self-stretch my-auto text-base font-semibold min-w-[240px] text-slate-800 w-[276px]">
                <div className="flex gap-2 items-center self-stretch my-auto">
                  <div className="flex flex-row gap-1">
                    {Array.from({ length: Productslingle?.avg_star || 0 }).map(
                      (_, i) => (
                        <svg
                          key={i}
                          width="20"
                          height="19"
                          viewBox="0 0 20 19"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="..." fill="#FABD21" />
                        </svg>
                      ),
                    )}
                  </div>
                  {/* <div className="self-stretch my-auto">
                    {Productslingle?.avg_star}{' '}
                    <span className="text-sm leading-4">
                      ({Productslingle?.comments.length}) {tarnslation?.rey}
                    </span>
                  </div> */}
                </div>
              </div>
              {/* 
              <button onClick={() => setIsSizeBarOpen(true)} className="flex flex-row bg-none gap-2 border-none text-[14px] font-normal">
                {tarnslation?.select_a_variant || ''}
              </button> */}
            </div>

            <div className="flex flex-wrap gap-5 items-center mt-7 text-base font-medium max-md:max-w-full">
              <div className="flex flex-wrap gap-3 items-center self-stretch my-auto min-w-[240px] max-md:max-w-full">
                {!isInStock ? (
                  <div className="n">
                    <button
                      onClick={handleNotifyMe}
                      className="flex  max-sm:items-center max-sm:w-full overflow-hidden flex-row justify-center gap-[10px] items-center self-stretch  py-3.5 my-auto text-blue-600 border border-blue-600 hover:bg-blue-600 transition-colors hover:text-white bg-white min-w-[240px] rounded-[100px] w-[285px] max-md:px-5"
                    >
                      {tarnslation?.Notify_Me}
                    </button>
                  </div>
                ) : (
                  <button
                    disabled={isAddToBasketDisabled || isinbusked}
                    onClick={handleAddToBasket}
                    style={
                      isAddToBasketDisabled || isinbusked
                        ? { background: '#B1C7E4', cursor: 'not-allowed' }
                        : {}
                    }
                    className="flex max-sm:items-center max-sm:w-full overflow-hidden flex-col justify-center items-center self-stretch  py-3.5 my-auto text-white bg-blue-600 min-w-[240px] rounded-[100px] w-[285px] max-md:px-5"
                  >
                    <div className="flex gap-2 items-center">
                      {!isinbusked ? (
                        <img
                          loading="lazy"
                          src="https://cdn.builder.io/api/v1/image/assets/TEMP/12162e338001dffe48b2f7720205d57a300942ee6d909f5e9d356e6bce11941f?placeholderIfAbsent=true&apiKey=2d5d82cf417847beb8cd2fbbc5e3c099"
                          className="object-contain shrink-0 self-stretch my-auto w-5 aspect-square"
                        />
                      ) : (
                        <img
                          loading="lazy"
                          src="https://cdn.builder.io/api/v1/image/assets/TEMP/7aea5798032300cff0cb8633f827efc8d9c19b5e90bd7d2d3214a3fe5775d3b4?placeholderIfAbsent=true&apiKey=2d5d82cf417847beb8cd2fbbc5e3c099"
                          className="object-contain shrink-0 self-stretch my-auto w-6 aspect-square"
                        />
                      )}
                      |
                      <div
                        className="self-stretch my-auto text-nowrap"
                        style={isinbusked ? { color: 'black' } : { color: 'white' }}
                      >
                        {!isinbusked
                          ? tarnslation?.add_to_cart
                          : tarnslation?.added_to_cart}
                      </div>
                    </div>
                  </button>
                )}
              </div>

              <div
                className="bg-[##F5F5F5]  rounded-full w-11 h-11 flex justify-center items-center"
                onClick={async () => {
                  const userStr = localStorage.getItem('user-info');
                  if (userStr) {
                    const User = JSON.parse(userStr);
                    if (User) {
                      axiosInstance
                        .post(
                          '/favorites/toggleFavorite',
                          { product_id: Productslingle?.id },
                          {
                            headers: {
                              Authorization: `Bearer ${token}`,
                              Accept: 'application/json',
                            },
                          },
                        )
                        .then(() => {
                          setisliked(p => !p);
                          queryClient.invalidateQueries({ queryKey: ['favorites'] });
                        })
                        .catch(error => console.log(error));
                    }
                  } else {
                    navigate(
                      `/${lang}/${ROUTES.login[lang as keyof typeof ROUTES.login]}`,
                    );
                  }
                }}
              >
                <img
                  src={!isliked ? '/svg/hartBlack.svg' : '/svg/hartRed.svg'}
                  alt=""
                />
              </div>

              <div
                onClick={() => setOpenSideBar(!openSideBar)}
                className="cursor-pointer  gap-2 pb-2 border-b-[#3873C3] border-b-[1px] flex items-center"
              >
                <span className="text-[#3873C3]">
                  <GiHanger size={24} />
                </span>
                <span className="text-[#3873C3] text-[14px]">
                  Испытайте продукт на себя
                </span>
              </div>
            </div>

            {Productslingle?.description && (
              <div
                className="flex rounded-3xl bg-stone-50 max-w-[670px] h-fit px-[40px] py-[48px] max-sm:mt-10 mt-[90px] flex-col"
                dangerouslySetInnerHTML={{ __html: Productslingle?.description || '' }}
              />
            )}
          </section>
        </section>
        {/* 
        <section className="mt-[100px] max-sm:mt-12 bg-[#F8F8F8] max-sm:px-4 px-[40px]">
          <div className="flex flex-wrap gap-8 justify-start max-md:justify-center items-center max-sm:pt-[24px] pt-[80px]">
            <div className="flex flex-col justify-center items-center self-stretch p-8 my-auto bg-white rounded-3xl min-w-[240px] w-[296px] max-md:px-5">
              <div className="text-6xl font-semibold leading-none text-center text-zinc-900 max-md:text-4xl">
                {Productslingle?.avg_star}
              </div>
              <div className="flex gap-0.5 items-start mt-3">
                {Array.from({ length: Productslingle?.avg_star || 0 }).map((_, i) => (
                  <img
                    key={i}
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/5dca374733cb9d1aba7db23d829c0e6bad1c18b8be000a06d9f7eafe138eabb2?placeholderIfAbsent=true&apiKey=2d5d82cf417847beb8cd2fbbc5e3c099"
                    className="object-contain shrink-0 w-6 aspect-square"
                  />
                ))}
              </div>
              <div className="mt-3 text-sm text-center text-neutral-600">
                {tarnslation?.İstifadəçi_dəyərləndirməsi}
                <span className="text-neutral-600">({Productslingle?.avg_star})</span>
              </div>
            </div>

            <div className="flex flex-col gap-4 items-start self-stretch my-auto min-w-[240px] w-[40%] max-md:w-full">
              {Productslingle?.rating_summary
                .map((item) => extractData(item))
                .filter((item) => item !== null)
                .map((item: any, index: number) => (
                  <div key={index} className="flex max-sm:flex-col flex-row gap-4 justify-between items-center  self-stretch w-full">
                    <div className="flex flex-row justify-between w-full">
                      <div className="flex gap-0.5 items-start self-stretch my-auto">
                        {Array.from({ length: 5 - index }).map((_, j) => (
                          <img
                            key={j}
                            loading="lazy"
                            src="https://cdn.builder.io/api/v1/image/assets/TEMP/05c694f83396f923195f2ce2eefa5960a5367c7d052eb1bbeca00c5ed8157138?placeholderIfAbsent=true&apiKey=2d5d82cf417847beb8cd2fbbc5e3c099"
                            className="object-contain shrink-0 aspect-square w-[18px]"
                          />
                        ))}
                      </div>
                      <div className=" max-sm:flex  hidden items-start self-stretch my-auto text-sm">
                        <div className="text-center text-zinc-900">{item.procent}%</div>
                        <div className="text-slate-500"> {item.users} </div>
                      </div>
                    </div>

                    <div className="flex overflow-hidden flex-col self-stretch my-auto max-md:min-w-[240px] min-w-[300px]  w-full">
                      <div className="flex flex-col items-start bg-gray-200 rounded-[100px] max-md:pr-5 max-md:max-w-full">
                        <div className="flex shrink-0 max-w-full h-1 bg-amber-400 rounded-[100px]" style={{ width: `${item.procent}%` }} />
                      </div>
                    </div>

                    <div className="flex max-sm:hidden items-start self-stretch my-auto text-sm min-w-[42px]">
                      <div className="text-center text-zinc-900">{item.procent}%</div>
                      <div className="text-slate-500"> {item.users} </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {Productslingle && tarnslation && <CommentsSection data={Productslingle} translate={tarnslation} />}
        </section> */}

        {similarProducts && similarProducts.length > 0 && (
          <section className="px-[40px] max-sm:px-4">
            <h3 className="text-[28px] font-semibold max-sm:mt-[48px] mt-[100px]">
              {tarnslation?.Tövsiyyələr}
            </h3>
            <div className="mt-[40px] max-sm:mt-[28px] mb-[100px]">
              <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={16}
                navigation
                pagination={{ clickable: true }}
                breakpoints={{
                  320: { slidesPerView: 1.2 },
                  640: { slidesPerView: 2 },
                  768: { slidesPerView: 2.5 },
                  1024: { slidesPerView: 3 },
                  1280: { slidesPerView: 4 },
                }}
              >
                {similarProducts
                  .filter(product => product.id !== Productslingle?.id)
                  .slice(0, 12)
                  .map(product => (
                    <SwiperSlide key={product.id}>
                      <ProductCard bg="grey" data={product} />
                    </SwiperSlide>
                  ))}
              </Swiper>
            </div>
          </section>
        )}

        {IsSizeBarOpen && (
          <div className="bg-black bg-opacity-35 flex justify-center items-center fixed top-0 left-0 w-full h-full  z-50">
            <div className="bg-white w-1/2 lg:w-[40%]  max-md:w-[80%] rounded-3xl max-sm:p-4 p-[50px] text-[28px] font-medium">
              <div className="w-full flex flex-row justify-between items-center">
                <h4>{tarnslation?.BodyMeasurements}</h4>
                <svg
                  className=" cursor-pointer"
                  onClick={() => setIsSizeBarOpen(false)}
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 6L6 18"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6 6L18 18"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <img className=" w-full " src={Productslingle?.size_image} alt="" />
            </div>
          </div>
        )}
      </main>

      <SelectSizeSidebar
        onClose={() => setOpenSideBar(false)}
        openSidebar={openSideBar}
      />
      <Footer />
    </div>
  );
}
