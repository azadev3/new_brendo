import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Basket,
  Favorite,
  Product,
  TranslationsKeys,
} from '../../setting/Types';
import { FaRubleSign } from 'react-icons/fa';

import ROUTES from '../../setting/routes';
import GETRequest, { axiosInstance } from '../../setting/Request';
import axios from 'axios';
import toast from 'react-hot-toast';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import ImageSlider from './ImageSlider';
import { useCollectionModal } from '../../contexts/CollectionModalProvider';
import { useCollections } from '../../pages/influencer_dashboard/CollectionProvider';
interface Props {
  isHome?: boolean;
  data?: Product;
  isnew?: boolean;
  issale?: boolean;
  bg: 'white' | 'grey';
}

export default function ProductCard({
  isHome = false,
  data,
  issale = false,
  bg,
}: Props) {
  const queryClient = useQueryClient();
  const [isliked, setisliked] = useState<boolean>(false);
  const [isMauseOn, setisMauseOn] = useState<boolean>(false);
  const [variant, setvariant] = useState<number>(1);

  const navigate = useNavigate();
  const checkLikedProducts = () => {
    if (favorites?.some((item: any) => item && item?.product && item?.product?.id ? item?.product?.id === data?.id : "")) {
      setisliked(true);
    } else {
      setisliked(false);
    }
  };

  const { lang = 'ru' } = useParams<{
    lang: string;
  }>();

  const { data: translation } = GETRequest<TranslationsKeys>(
    `/translates`,
    'translates',
    [lang]
  );
  const { data: favorites } = GETRequest<Favorite[]>(
    `/favorites`,
    'favorites',
    [lang]
  );

  const { data: basked } = GETRequest<Basket>(`/basket_items`, 'basket_items', [
    lang,
    isMauseOn,
  ]);

  const hasTrackedView = useRef(false);

  const trackProductView = useCallback(async () => {
    try {
      if (hasTrackedView.current) return;
      const userStr = localStorage.getItem('user-info');
      const token = userStr ? JSON.parse(userStr).token : null;

      await axios.post(
        'https://admin.brendoo.com/api/track-product-view',
        { product_id: data && data?.id },
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );

      hasTrackedView.current = true;

      const trackedProducts = JSON.parse(
        localStorage.getItem('tracked_products') || '[]'
      );
      if (!trackedProducts.includes(data?.id)) {
        trackedProducts.push(data?.id);
        localStorage.setItem(
          'tracked_products',
          JSON.stringify(trackedProducts)
        );
      }
    } catch (error) {
      console.error('Error tracking product view:', error);
    }
  }, [data?.id]);

  // useEffect(() => {
  //   if (data?.id && !hasTrackedView.current) {
  //     trackProductView();
  //     hasTrackedView.current = true;
  //   }
  // }, [data, trackProductView]);

  const addToBasket = async (Data: {
    product_id: number;
    quantity: number;
    price: number;
    token: string;
  }) => {
    const response = await axios.post(
      'https://admin.brendoo.com/api/basket_items',
      {
        product_id: Data.product_id,
        quantity: Data.quantity,
        price: Data.price,
        options:
          data?.filters && data?.filters.length > 0
            ? data?.filters.map((filter) => {
              const defoultOption = filter.options.find(
                (item) => +item.is_default === 1
              );
              return {
                filter_id: filter.filter_id,
                option_id: defoultOption?.option_id,
              };
            })
            : [],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Data.token}`,
        },
      }
    );
    return response.data;
  };
  const mutation = useMutation({
    mutationFn: addToBasket,
    onSuccess: () => {
      toast.success('Товар добавлен в корзину');
      queryClient.invalidateQueries({ queryKey: ['basket_items'] });
    },
    onError: (error) => {
      toast.error('Произошла ошибка.');
      console.error(error);
    }
  });

  useEffect(() => {
    checkLikedProducts();
  }, [favorites]);

  const hasDiscount = Number(data?.discount) > 0 && data?.discount !== null;

  // const handleNavigateToProduct = useCallback(() => {
  //   if (!data) return;

  //   trackProductView();

  //   localStorage.setItem('ProductSlug', JSON.stringify(data.slug));
  //   navigate(
  //     `/${lang}/${ROUTES.product[lang as keyof typeof ROUTES.product]}/${
  //       data.slug[lang as keyof typeof data.slug]
  //     }`
  //   );
  // }, [data, lang, navigate, trackProductView]);

  // For same-tab updates

  const handleNavigateToProduct = useCallback(() => {
    if (!data) return;

    trackProductView();

    localStorage.setItem('ProductSlug', JSON.stringify(data.slug));
    // navigate(
    //   `/${lang}/${ROUTES.product[lang as keyof typeof ROUTES.product]}/${
    //     data.slug[lang as keyof typeof data.slug]
    //   }`
    // );
    window.open(
      `/${lang}/${ROUTES.product[lang as keyof typeof ROUTES.product]}/${data.slug[lang as keyof typeof data.slug]
      }`,
      "_blank",
    )
  }, [data, lang, navigate, trackProductView]);

  useEffect(() => {
    const originalSetItem = localStorage.setItem;

    localStorage.setItem = function (key, value) {
      const event = new Event('local-storage-changed');
      originalSetItem.apply(this, [key, value]);
      if (key === 'liked_Produckts') {
        window.dispatchEvent(event);
      }
    };

    const handleLocalStorageChange = () => {
      checkLikedProducts();
    };

    window.addEventListener('local-storage-changed', handleLocalStorageChange);

    return () => {
      localStorage.setItem = originalSetItem;
      window.removeEventListener(
        'local-storage-changed',
        handleLocalStorageChange
      );
    };
  }, [data?.id]);

  useEffect(() => {
    let includes = false;
    if (basked) {
      for (let i = 0; i < basked.basket_items?.length; i++) {
        if (basked.basket_items[i]?.product?.id === data?.id) {
          includes = true;
        }
      }
    }
    if (includes) {
      setvariant(3);
    } else if (data) {
      setvariant(1);
    }
  }, [basked, data]);

  useEffect(() => {
    let includes = false;
    if (basked) {
      for (let i = 0; i < basked.basket_items?.length; i++) {
        if (basked.basket_items[i]?.product?.id === data?.id) {
          includes = true;
        }
      }
    }
    if (data && !includes) {
      const fetchData = async () => {
        const userStr = localStorage.getItem('user-info');
        if (userStr) {
          const user = JSON.parse(userStr);

          if (variant === 3) {
            mutation.mutate({
              product_id: data.id,
              quantity: 1,
              price: +data.discounted_price,
              token: user.token,
            });
          }
        }
      };
      fetchData();
    }
  }, [variant]);

  useEffect(() => {
    const userStr = localStorage.getItem('user-info');
    if (!userStr && data) {
      const storedIds = localStorage.getItem('ids') || '';
      const idArray = storedIds.split(',').filter(Boolean);
      const index = idArray.indexOf(`${data.id}`);
      if (index === -1) {
        setvariant(1);
      } else {
        setvariant(3);
      }
    }
  }, [data]);

  const userType = localStorage.getItem("user_type");
  const hasUserType = userType && userType?.length > 0 ? userType : null;
  const [isMouseOn, setIsMouseOn] = useState(false);
  const { setCreateCollectionModal, setAddProductCollection, setProductId } = useCollectionModal();
  const { collections } = useCollections();

  if (!data) {
    return (
      <>
        <div className="flex flex-col w-full h-[400px] max-w-sm p-4 bg-gray-100 rounded-3xl animate-pulse">
          <div className="w-full h-full bg-gray-300 rounded-3xl"></div>
        </div>
      </>
    );
  }

  return (
    <div
      className="flex relative cursor-pointer  flex-col pb-5 text-base text-black  w-full min-w-full"
      onMouseEnter={() => setIsMouseOn(true)}
      onMouseLeave={() => setIsMouseOn(false)}
    >
      <div
        className={`flex w-full relative bg-${bg === 'white' ? 'white' : '[#F5F5F5]'
          } md:rounded-3xl rounded-md md:p-3 p-2  border border-white overflow-hidden border-solid aspect-[0.8]`}>
        <ImageSlider
          isHome={isHome}
          onClick={handleNavigateToProduct}
          className="md:rounded-3xl rounded-md hover:scale-110 duration-300"
          slides={data?.sliders && data?.sliders?.length > 0 ? data?.sliders : [{ id: data?.id, image: data?.image }]}
        />
        <div
          className="bg-[#FFFFFF99]  rounded-full w-[13%] aspect-square absolute top-6 right-6 flex justify-center items-center"
          onClick={async () => {
            const userStr = localStorage.getItem('user-info');
            if (userStr) {
              const User = JSON.parse(userStr);
              if (User) {
                axiosInstance
                  .post(
                    '/favorites/toggleFavorite',
                    { product_id: data.id },
                    {
                      headers: {
                        Authorization: `Bearer ${User.token}`,
                        Accept: 'application/json',
                      },
                    }
                  )
                  .then(() => {
                    // toast.success(
                    //     'Product is sucsesfully aded to favorites'
                    // );
                    if (isliked) {
                      setisliked(false);
                    } else {
                      setisliked(true);
                    }
                    queryClient.invalidateQueries({
                      queryKey: ['favorites'],
                    });
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              }
            } else {
              navigate(
                `/${lang}/${ROUTES.login[lang as keyof typeof ROUTES.login]}`
              );
            }
          }}>
          <img
            src={!isliked ? '/svg/hartBlack.svg' : '/svg/hartRed.svg'}
            alt=""
          />
        </div>
        <div className="absolute bottom-3 left-2 md:left-2 md:bottom-3 flex justify-center items-center flex-row gap-2">
          {data.is_new && (
            <div className="bg-[#8E98B8] text-white px-2 py-1 h-fit  rounded-full   flex justify-center items-center leading-[14px] text-[10px]">
              {translation?.new}
            </div>
          )}
          {Number(data?.discount) > 0 && (
            <div className="bg-[#FF3C79] text-white px-2 py-1  h-fit rounded-full   flex justify-center items-center">
              <p className="text-[10px]  font-medium leading-[14px]">
                {data?.discount}% {translation?.discount}
              </p>
            </div>
          )}
        </div>

        <div
          className="w-full h-[100px] absolute bottom-0 left-0 hidden sm:flex justify-center items-center overflow-hidden"
          onMouseLeave={() => {
            setisMauseOn(false);
          }}
          onMouseEnter={() => {
            setisMauseOn(true);
          }}>
          {/* {variant === 1 && (
            <div
              onClick={() => {
                const userStr = localStorage.getItem('user-info');
                if (userStr) {
                  if (
                    data.filters.find(
                      (item) =>
                        item.filter_name === 'Size' ||
                        item.filter_name === 'Размер'
                    )
                  ) {
                    setvariant(3);
                  }
                } else {
                  navigate(
                    `/${lang}/${
                      ROUTES.login[lang as keyof typeof ROUTES.login]
                    }`
                  );
                }
              }}
              className={`flex max-sm:hidden justify-center items-center px-10 py-3 text-base font-medium text-white bg-blue-600 max-w-[301px] w-[80%] rounded-full duration-300 ${
                isMauseOn ? ' opacity-100' : ' opacity-0'
              }`}>
              <div className="flex gap-2 items-center justify-center">
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/ccd2f29609bd70219e8403081a0990ef297d5230b91e7fae2658815da1e44173?placeholderIfAbsent=true&apiKey=2d5d82cf417847beb8cd2fbbc5e3c099"
                  className="w-6 h-6"
                />
                <div className="text-[13px] truncate my-auto">
                  {translation?.add_to_cart}
                </div>
              </div>
            </div>
          )} */}
          {/* {variant === 2 && (
            <div className="flex overflow-hidden flex-col justify-center px-3.5 py-2 text-xs text-black whitespace-nowrap rounded-xl bg-white bg-opacity-80 max-w-[278px]">
              <div className="flex flex-col w-full">
                <div className="flex overflow-auto gap-2 w-full rounded">
                  <div
                    onClick={() => setvariant(3)}
                    className="px-2.5 py-3 text-center w-[36px] aspect-square rounded border border-solid border-neutral-400 hover:bg-[#8E98B8] hover:cursor-pointer hover:text-white">
                    XS
                  </div>
                  <div
                    onClick={() => setvariant(3)}
                    className="px-2.5 py-3 text-center w-[36px] aspect-square rounded border border-solid border-neutral-400 hover:bg-[#8E98B8] hover:cursor-pointer hover:text-white">
                    S
                  </div>
                  <div
                    onClick={() => setvariant(3)}
                    className="px-2.5 py-3 text-center w-[36px] aspect-square rounded border border-solid border-neutral-400 hover:bg-[#8E98B8] hover:cursor-pointer hover:text-white">
                    M
                  </div>
                  <div
                    onClick={() => setvariant(3)}
                    className="px-2.5 py-3 text-center w-[36px] aspect-square rounded border border-solid border-neutral-400 hover:bg-[#8E98B8] hover:cursor-pointer hover:text-white">
                    L
                  </div>
                  <div
                    onClick={() => setvariant(3)}
                    className="px-2.5 py-3 text-center w-[36px] aspect-square rounded border border-solid border-neutral-400 hover:bg-[#8E98B8] hover:cursor-pointer hover:text-white">
                    XL
                  </div>
                  <div
                    onClick={() => setvariant(3)}
                    className="px-2.5 py-3 text-center w-[36px] aspect-square rounded border border-solid border-neutral-400 hover:bg-[#8E98B8] hover:cursor-pointer hover:text-white">
                    2X
                  </div>
                </div>
              </div>
            </div>
          )} */}
          {/* {variant === 3 && (
            <div className="flex overflow-hidden min-h-[50px] flex-col justify-center px-10 py-[4%] items-center text-base font-medium bg-slate-300 w-[80%] max-w-[301px] rounded-[100px] text-slate-800">
              <div className="flex gap-2 items-center justify-center">
                {BtnLoadin ? (
                  <div className=" h-6 w-6">
                    <div className="w-6 h-6 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <>
                    <img
                      loading="lazy"
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/7aea5798032300cff0cb8633f827efc8d9c19b5e90bd7d2d3214a3fe5775d3b4?placeholderIfAbsent=true&apiKey=2d5d82cf417847beb8cd2fbbc5e3c099"
                      className="object-contain shrink-0 self-stretch my-auto w-6 aspect-square"
                    />

                    <div className="text-[13px] truncate my-auto">
                      {translation?.added_to_cart}
                    </div>
                  </>
                )}
              </div>
            </div>
          )} */}
        </div>
        {hasUserType === 'influencer' && isMouseOn && (
          <button
            type='button'
            className='hover-button-inf'
            onClick={() => {
              if (collections && collections?.length > 0 && data) {
                setAddProductCollection(true);
                setProductId(data?.id)
              } else {
                setCreateCollectionModal(true);
              }
            }}
          >
            <img src="/AddCircle2.svg" alt="AddCircle2" />
            <p>Kolleksiyaya əlavə et</p>
          </button>
        )}
      </div>
      <div className="flex flex-col mt-2 md:mt-5 w-full">
        <div
          onClick={handleNavigateToProduct}
          className="pr-2 md:text-base text-[14px] truncate">
          {data?.title}
        </div>
        <div className="flex flex-row gap-2">
          {hasDiscount ? (
            <>
              <div className="md:mt-3 font-semibold flex items-center text-[14px] line-through opacity-60">
                <span className="text-[14px]">{data?.price}</span>
                <FaRubleSign className="text-[12px] md:mt-2" />
              </div>
              <div
                className="md:mt-3 font-semibold flex items-center"
                style={issale ? { color: '#FC3976' } : {}}>
                <span className="text-[18px]">{data?.discounted_price}</span>
                <FaRubleSign className="text-[13px] mt-2" />
              </div>
            </>
          ) : (
            <div
              className="md:mt-3 font-semibold flex items-center"
              style={issale ? { color: '#FC3976' } : {}}>
              <span className="text-[18px]">{data?.price}</span>
              <FaRubleSign className="text-[13px] mt-2" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
