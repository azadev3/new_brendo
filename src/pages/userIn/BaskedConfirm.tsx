import Header from '../../components/Header';
import { Footer } from '../../components/Footer';
import BaskedForum from '../../components/Basked';
import { Link, useParams } from 'react-router-dom';
import { Basket, TranslationsKeys } from '../../setting/Types';
import GETRequest, { axiosInstance } from '../../setting/Request';
import ROUTES from '../../setting/routes';
import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import Loading from '../../components/Loading';

// type AdditionalInfo = {
//   additionalInfo: string;
//   address: string;
//   deliveryType: boolean;
//   paymentType: boolean;
// };

export default function BaskedConfirm() {
  const queryClient = useQueryClient();

  const { lang = 'ru' } = useParams<{ lang: string }>();
  const [Body, setBody] = useState<any>(null);
  const [FINAL_price, setFINAL_price] = useState(0);
  const user = localStorage.getItem("user-info");
  const parsed = user ? JSON.parse(user) : null;
  const token = parsed?.token;

  const { data: tarnslation, isLoading: tarnslationLoading } = GETRequest<TranslationsKeys>(`/translates`, 'translates', [lang]);
  const { data: basked, isLoading: baskedLoading } = GETRequest<Basket>(`/basket_items`, 'basket_items', [lang]);


  const [loadingorder, setLoadingOrder] = React.useState<boolean>(false);
  const handleOrder = async () => {
    // Trigger form validation first
    const formSubmitTrigger = document.getElementById('formSubmitTrigger') as HTMLButtonElement;
    if (formSubmitTrigger) {
      formSubmitTrigger.click();
    }

    if (!Body?.address) {
      toast.error('Введите адрес правильно');
      return;
    }

    if (basked && basked?.basket_items?.length < 1) {
      toast.error('Корзина пуста');
      return;
    }

    setLoadingOrder(true);

    try {
      // Step 1: Submit the order data
      const response = await axios.post(
        'https://admin.brendoo.com/api/storeOrder',
        {
          is_deliver: Body?.deliveryType,
          shop: Body?.address,
          payment_type: 'cash',
          total_price: basked?.total_price,
          discount: basked?.discount,
          delivered_price: basked?.delivered_price,
          final_price: FINAL_price === 0 ? basked?.final_price : FINAL_price,
          address: Body?.address,
          additional_info: Body?.additionalInfo,
          cityId: Number(Body?.cityId),
          regionId: Number(Body.regionId),
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      localStorage.setItem('order_ID', response.data.order.id);

      // Step 2: Create payment link
      const paymentResponse = await axios.post(
        'https://admin.brendoo.com/api/create-payment',
        {
          final_price: FINAL_price === 0 ? basked?.final_price : FINAL_price,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const paymentLink = paymentResponse.data.payment_link;

      const operationId = paymentResponse.data.operation_id;

      localStorage.setItem('operation_id', operationId);

      if (paymentLink) {
        window.location.href = paymentLink;
      } else {
        toast.error('Не удалось создать ссылку на оплату');
      }

      toast.success('Заказ успешно оформлен');

      queryClient.invalidateQueries({
        queryKey: ['basket_items'],
      });
    } catch (error: any) {
      toast.error(error?.response?.data?.error[0] || 'Что-то пошло не так');
    } finally {
      setLoadingOrder(false);
    }
  };

  if (baskedLoading || tarnslationLoading) {
    return <Loading />;
  }
  return (
    <div>
      <Header />
      <main className="mt-0">
        <div className="px-[40px] max-sm:px-4 pt-[40px] mb-[28px]">
          <div className="flex items-center gap-2">
            <Link reloadDocument to={`${lang}`}>
              <h6 className="text-nowrap self-stretch my-auto text-black hover:text-blue-600">{tarnslation?.home} </h6>
            </Link>
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/64bb3b3dae771cd265db1accd95aa96f30bd9da3da88a57867743da53bebc0eb?placeholderIfAbsent=true&apiKey=2d5d82cf417847beb8cd2fbbc5e3c099"
              className="object-contain shrink-0 self-stretch my-auto w-6 aspect-square"
            />

            <Link reloadDocument to={`/${lang}/${ROUTES.order[lang as keyof typeof ROUTES.order]}`}>
              <h6 className="text-nowrap self-stretch my-auto hover:text-blue-600">{tarnslation?.basked} </h6>
            </Link>
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/64bb3b3dae771cd265db1accd95aa96f30bd9da3da88a57867743da53bebc0eb?placeholderIfAbsent=true&apiKey=2d5d82cf417847beb8cd2fbbc5e3c099"
              className="object-contain shrink-0 self-stretch my-auto w-6 aspect-square"
            />
            <h6 className="text-nowrap self-stretch my-auto">{tarnslation?.basked} </h6>
          </div>{' '}
        </div>
        <section className="lg:px-[40px] px-4">
          <h3 className="text-[40px] font-semibold  max-sm:text-[32px] mt-[28px] mb-[40px]">{tarnslation?.Sifariş_et} </h3>{' '}
        </section>
        <section className="flex max-sm:px-4 lg:flex-row flex-col  h-fit px-[40px] justify-between mb-[100px] max-sm:gap-10 gap-[65px]">
          <BaskedForum
            onSubmit={(values) => setBody(values)}
            Name={parsed?.customer?.name || 'user name'}
            Number={parsed?.customer?.phone || 'user phone'}
            Email={parsed?.customer?.email || 'user email'}
          />
          <div className="w-[2px] h-[500px] bg-black lg:block hidden  opacity-10" />
          <div className="flex flex-col max-sm:flex-col-reverse gap-4 rounded-3xl min-w-[306px]">
            <div className="flex overflow-hidden flex-col justify-center p-7 w-full rounded-3xl bg-stone-50">
              <div className="flex flex-col">
                <div className="text-base font-semibold text-black">{tarnslation?.Ümumi_sifariş}</div>
                <div className="flex flex-col mt-6 w-full">
                  <div className="flex flex-col w-full">
                    <div className="flex flex-col w-full text-sm">
                      <div className="flex gap-10 justify-between items-center w-full">
                        <div className="self-stretch my-auto text-black text-opacity-60">{tarnslation?.Məbləğ}:</div>
                        <div className="self-stretch my-auto text-right text-black">{basked?.total_price}₽</div>
                      </div>

                      <div className="flex gap-10 justify-between items-center mt-4 w-full text-rose-500">
                        <div className="self-stretch my-auto">{tarnslation?.Endirim}:</div>
                        <div className="self-stretch my-auto text-right">{basked?.discount}₽</div>
                      </div>
                    </div>
                    <div className="mt-3 w-full border border-solid border-zinc-300 min-h-[1px]" />
                    <div className="flex gap-10 justify-between items-center mt-3">
                      <div className="self-stretch my-auto text-sm text-black text-opacity-80">{tarnslation?.Cəmi_məbləğ}:</div>
                      <div className="self-stretch my-auto text-base font-semibold text-blue-600">
                        {FINAL_price === 0 ? basked?.final_price : FINAL_price}₽
                      </div>
                    </div>
                  </div>

                  <button
                    disabled={loadingorder}
                    className="flex overflow-hidden h-[48px] flex-col justify-center items-center px-16 py-3.5 mt-6 w-full text-base font-medium text-white bg-[#3873C3] rounded-[100px]"
                    onClick={handleOrder}>
                    {loadingorder ? (
                      <div className="gap-2 self-stretch">{tarnslation?.is_loading}</div>
                    ) : (
                      <div className="gap-2 self-stretch">{tarnslation?.sifarish_et}:</div>
                    )}
                  </button>

                  {/* </Link> */}
                </div>
              </div>
            </div>
            <div className="flex overflow-hidden flex-col justify-center p-7 mt-5 w-full rounded-3xl bg-stone-50">
              <div className="flex flex-col">
                <div className="text-base font-medium text-black">{tarnslation?.coupon_add}</div>
                <div className="flex flex-col mt-5 w-full text-sm">
                  <input
                    type="text"
                    placeholder={tarnslation?.Kupon}
                    className="overflow-hidden px-4 py-3.5 w-full whitespace-nowrap bg-white rounded-[100px] text-black text-opacity-60"
                    id="couponInput"
                  />
                  <button
                    className="gap-2.5 self-stretch px-10 py-4 mt-3 w-full font-medium text-black border border-solid bg-[#B1C7E4] border-[#B1C7E4] rounded-[100px]"
                    onClick={async () => {
                      const couponValue = (document.getElementById('couponInput') as HTMLInputElement).value;
                      const userStr = localStorage.getItem('user-info');
                      const parsed = userStr ? JSON.parse(userStr) : null;
                      if (parsed) {
                        await axiosInstance
                          .post(
                            'applyCoupon',
                            {
                              coupon_code: couponValue,
                              total_price: basked?.final_price,
                            },
                            {
                              headers: {
                                Authorization: `Bearer ${token}`,
                                Accept: 'application/json',
                              },
                            },
                          )
                          .then((res) => {
                            setFINAL_price(res.data.discounted_total_price);
                            toast.success('kupon sucsesfully acsepted');
                          })
                          .catch((error) => {
                            console.log(error);

                            toast.error(error.response.data.error);
                          });
                      }
                    }}>
                    {tarnslation?.Confirm}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
