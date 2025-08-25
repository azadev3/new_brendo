import { useNavigate, useParams } from 'react-router-dom';
import { Order, TranslationsKeys, User } from '../../../setting/Types';
import GETRequest from '../../../setting/Request';
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import ROUTES from '../../../setting/routes';
import DelayedModal from '../../../utils/DelayedModal';
import axios from 'axios';
import toast from 'react-hot-toast';

const OrderMainItem = ({ order, cancellationReasons }: { order: Order | any, cancellationReasons: any[] }) => {
  const { lang = 'ru' } = useParams<{ lang: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<null | User>(null);

  const { data: translation } =
    GETRequest<TranslationsKeys>(`/translates`, 'translates', [lang]);

  // const statusIndicator = (status: string) => {
  //   switch (status) {
  //     case 'ordered':
  //       return translation?.ordered || 'Заказано'; // sifariş alındı
  //     case 'prepared':
  //       return translation?.prepared || 'Подготовлено'; // hazırlanır
  //     case 'boxed':
  //       return translation?.boxed || 'Пакетировано'; // paketləndi
  //     case 'cargo_depot':
  //       return translation?.cargo_depot || 'Карго депо'; // karqo deposu
  //     case 'delivered':
  //       return translation?.delivered || 'Доставлено'; // təslim edildi
  //     case 'returned':
  //       return translation?.returned || 'Возвращено'; // iadə verildi
  //     case 'courier':
  //       return translation?.courier || 'Курьеру'; // kuryerə verildi
  //     case 'refund_checking':
  //       return translation?.refund_checking || 'Проверка возврата'; // iadə yoxlanılır
  //     case 'return_accepted':
  //       return translation?.return_accepted || 'Возврат принят'; // iadə qəbul edildi
  //     case 'cancelled':
  //       return translation?.cancelled || 'Отменено'; // ləğv edildi
  //     case 'out_of_stock':
  //       return translation?.out_of_stock || 'Распродана'; // stokda yoxdur
  //     default:
  //       return translation?.unknown || 'Неизвестно';
  //   }
  // };

  useEffect(() => {
    const userStr = localStorage.getItem('user-info');
    if (userStr) {
      const user = JSON.parse(userStr);
      setUser(user.data);
    } else {
      navigate(`/en/login`);
    }
  }, []);

  const getOrderDetail = () => {
    navigate(
      `/${lang}/${ROUTES.orderdetail[lang as keyof typeof ROUTES.orderdetail]
      }/${order.id}`
    );
  };

  const getLocalizedDate = (dateString: string) => {
    try {
      // "2025-06-21 12:36:13" → "2025-06-21T12:36:13"
      const isoDateString = dateString.replace(" ", "T");
      const date = new Date(isoDateString);

      return date.toLocaleString(undefined, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
    } catch (error) {
      console.log(error);
      return dateString;
    }
  };

  const [openCancelModal, setOpenCancelModal] = React.useState<number | null>(null);
  const [openRateModal, setOpenRateModal] = React.useState<number | null>(null);
  const handleOpenCancelModal = (id: number | null) => {
    setOpenCancelModal(id);
  }
  const handleOpenRateModal = (id: number | null) => {
    setOpenRateModal(id);
  }


  // AZADEV
  const userInfoRaw = localStorage.getItem("user-info");
  const userInfo = userInfoRaw ? JSON.parse(userInfoRaw) : null;
  const token = userInfo?.token;

  // post reasons
  const [loading, setLoading] = React.useState<boolean>(false);
  const [isOther, setOther] = React.useState<boolean>(false);
  const [selectedReason, setSelectedReason] = React.useState<string>("");
  const [text, setText] = React.useState<string>("");

  const handleSubmitReason = async () => {
    setLoading(true);
    try {
      if (isOther && !text.trim()) {
        alert(translation?.legvetmesebebiniqeydedin ?? "");
        return;
      }

      if (!isOther && !selectedReason) {
        alert(translation?.legvetmesebebiniqeydedin ?? "");
        return;
      }

      const data: Record<string, string> = {};

      if (isOther) {
        data.cancel_text = text.trim();
      } else {
        data.cancel_id = selectedReason;
      }

      const res = await axios.post(`https://admin.brendoo.com/api/cancelOrder/${order?.id}`, data, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept-Language": lang,
        },
      });

      if (res.data) {
        setSelectedReason("");
        setText("");
        setOther(false);
        setOpenCancelModal(null);
        toast.success(translation?.sifarisinizlegvedilir ?? "", {
          position: "top-center",
        });
        window.location.reload();
      } else {
        console.log(res.status);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (selectedReason === 'is_other') {
      setOther(true);
    } else {
      setOther(false);
    }
  }, [selectedReason]);


  return (
    <div
      className="rounded-2xl border border-gray-200 p-4 bg-white space-y-4">
      {openCancelModal === order.id && (
        <div className='cancel-modal-overlay'>
          <form
            className="cancel-modal-content"
            acceptCharset='UTF-8'
            onSubmit={(e: FormEvent<HTMLFormElement>) => {
              e.preventDefault();
              handleSubmitReason();
            }}
          >
            <img className='close-modal' onClick={() => setOpenCancelModal(null)} src="/cixis.png" alt="çıxış" />
            <div className="text-content">
              <h3>{translation?.sifarisin_legvi}</h3>
              <p>{translation?.legv_sebebi}</p>
            </div>
            <div className="reason-cancel">
              <select
                required
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedReason(e.target.value)}
              >
                <option value="" defaultChecked>{translation?.legv_sebebi}</option>

                {cancellationReasons && cancellationReasons?.length > 0 ? (
                  cancellationReasons?.map((r) => (
                    <option value={r?.id} key={r?.id}>{r?.title ?? ""}</option>
                  ))
                ) : null}
                <option value="is_other">{translation?.diger_text}</option>
              </select>
              {isOther && (
                <textarea
                  style={{ width: "100%", padding: "8px 16px", borderRadius: "12px", height: "100px", border: "2px solid #cecece", resize: "none" }}
                  name='cancel_note'
                  required
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)}
                  value={text}
                  placeholder={translation?.legv_sebebi ?? ""}
                ></textarea>
              )}
              <button className='close-o' type='submit'>
                {loading ? "..." : translation?.sifarisin_legvi}
              </button>
            </div>
          </form>
        </div>
      )}
      {openRateModal === order.id && (
        <div className="cancel-modal-overlay">
          <DelayedModal setOpenRateModal={setOpenRateModal} />
        </div>
      )}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-3 gap-4">
        <div className="w-full overflow-x-auto no-scrollbar">
          <div className="min-w-[600px] grid grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-gray-500">{translation?.sifaris_date}:</div>
              <div className="font-semibold">{getLocalizedDate(order?.order_date)}</div>
            </div>
            <div>
              <div className="text-gray-500">{translation?.sifaris_detail}:</div>
              <div className="font-semibold">
                {order.order_items_count} {translation?.mehsul_title}
              </div>
            </div>
            <div>
              <div className="text-gray-500">{translation?.priced}:</div>
              <div className="font-semibold">{order.total_price} RUB</div>
            </div>
            <div>
              <div className="text-gray-500">{translation?.given_key}:</div>
              <div className="font-semibold">{user?.customer.name}</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1 md:flex-nowrap items-center justify-between mt-3">
          <button type='button'
            onClick={getOrderDetail}
            className="whitespace-nowrap rounded-[100px] duration-300 bg-[#3873C3] text-white px-[28px] py-[14px] border border-black border-opacity-10 text-[13px] self-end md:self-auto">
            {translation?.order_detail_title_key}
          </button>

          {/* Cancel Button - only show if not already cancelled / delivered */}
          {order?.cancelable ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleOpenCancelModal(order?.id);
              }}
              className="rounded-[100px] bg-red-500 hover:bg-red-600 text-white px-[24px] py-[10px] text-[13px]">
              {translation?.cancel_order || "Sifarişi ləğv et"}
            </button>
          ) : null}
        </div>

      </div>

      {/* Order Items */}
      <div className="space-y-4">
        {order.order_items.map((item: any) => (
          <div
            key={item.id}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex gap-3 items-start">
              <img
                src={item?.product?.image || '/placeholder.svg'}
                className="w-[100px] h-[90px] object-contain rounded-md"
              />
              <div>
                <div className="font-medium text-black">
                  {item?.product?.title}
                </div>
                <div className="text-sm text-gray-600">
                  {item?.quantity} {translation?.mehsul_title}
                </div>
              </div>
            </div>

            <p style={{ fontSize: "14px", textWrap: "nowrap" }}>{item?.status ?? ""}</p>

            <div className="flex flex-col gap-2">
              {/* ⭐ Rate Button */}
              {order.status === 'delivered' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenRateModal(order?.id);
                  }}
                  className="rounded-[100px] bg-blue-500 hover:bg-blue-800 text-white px-[24px] py-[10px] text-[13px]">
                  {translation?.mehsulu_deyerlendir || "Məhsulu dəyərləndir"}
                </button>
              )}

              {/* 🔁 Return Button */}
              {item.status === 'delivered' && !['returned', 'refund_checking', 'return_accepted'].includes(item.status) && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="rounded-[100px] bg-yellow-500 hover:bg-yellow-600 text-white px-[24px] py-[10px] text-[13px]">
                  {translation?.mehsulu_iade_et || "Məhsulu geri qaytar"}
                </button>
              )}
            </div>
          </div>
        ))}

      </div>
    </div>
  );
};

export default OrderMainItem;
