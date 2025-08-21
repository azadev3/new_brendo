import React, { useEffect, useRef, useState } from 'react';
import Header from '../../components/Header';
import UserAside from '../../components/userAside';
import GETRequest from '../../setting/Request';
import Loading from '../../components/Loading';
import { useNavigate, useParams } from 'react-router-dom';
import { Order, TranslationsKeys } from '../../setting/Types';
import { CheckCircle2, Package } from 'lucide-react';
import { IoClose } from 'react-icons/io5';
import RatingModal from '../../components/rating-modal/rating-modal';
import RestoreModal from './RestoreModal';

export interface NewOrd extends Order {
  statuses: [{ id: number; created_at: string; status: string }];
}

const OrderItemsDetail = () => {
  const navigate = useNavigate();
  const [, setProductCommit] = useState<number>(0);

  // Address change modal state
  const [changeAddress, setChangeAddress] = useState<boolean>(false);
  const [addressInput, setAddressInput] = useState<string>('');
  const [savingAddress, setSavingAddress] = useState<boolean>(false);
  const [addrError, setAddrError] = useState<string>('');

  const { lang, slug } = useParams<{
    lang: string;
    page: string;
    slug: string;
  }>();

  // auth check
  useEffect(() => {
    const userStr = localStorage.getItem('user-info');
    if (!userStr) {
      navigate(`/en/login`);
    }
  }, [navigate]);

  // data fetch (cache key & deps slug-lı)
  const {
    data: order,
    isLoading: OrderLoading,
    refetch,
  }: any = GETRequest<Order | any>(`/getOrderItem/${slug}`, `getOrderItem-${slug}`, [
    lang,
    slug,
  ]);

  // slug dəyişəndə yenidən çək + UI state reset
  useEffect(() => {
    refetch?.();
    setChangeAddress(false);
    setAddrError('');
    setAddressInput('');
  }, [slug, refetch]);

  const { data: tarnslation, isLoading: tarnslationLoading } =
    GETRequest<TranslationsKeys>(`/translates`, 'translates', [lang]);

  // currency
  const formatCurrency = (price: string | null) => {
    if (!price) return '0.00';
    const currencySymbol = price.replace(/[0-9.]/g, '').trim();
    return `${Number.parseFloat(price).toFixed(2)} ${currencySymbol || '₽'}`;
  };

  const scrollRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [order]);

  const [commentModal, setCommentModal] = React.useState<boolean>(false);
  const [restoreModal, setRestoreModal] = React.useState<boolean>(false);

  // ID helper (order_id və ya id-dən hansısı varsa götür)
  const getOrderId = (o: any) => o?.order_id ?? o?.id ?? null;

  // Modal aç: mövcud ünvanı input-a qoy
  const openAddressModal = () => {
    setAddrError('');
    setAddressInput(order?.address || '');
    setChangeAddress(true);
  };

  // Modal bağla
  const closeAddressModal = () => {
    if (savingAddress) return;
    setChangeAddress(false);
    setAddrError('');
  };

  // Ünvanı POST ilə backend-ə göndər (token + JSON body)
  const handleSaveAddress = async () => {
    setAddrError('');
    const trimmed = addressInput.trim();

    if (trimmed.length < 5) {
      setAddrError('Адрес должен содержать минимум 5 символов.');
      return;
    }
    const orderId = getOrderId(order);
    if (!orderId) {
      setAddrError('Заказ не найден (order_id).');
      return;
    }

    const userStr = localStorage.getItem('user-info');
    const parsedUser = userStr ? JSON.parse(userStr) : null;
    const token =
      parsedUser?.token ||
      parsedUser?.access_token ||
      parsedUser?.api_token ||
      parsedUser?.bearer ||
      parsedUser?.user?.token ||
      '';

    try {
      setSavingAddress(true);

      const res = await fetch('https://admin.brendoo.com/api/changeOrderAddress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          order_id: orderId,
          address: trimmed,
        }),
      });

      if (res.status === 401) {
        navigate(`/en/login`);
        return;
      }
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(text || `Не удалось обновить адрес. HTTP ${res.status}`);
      }

      // Serverdə yeniləndi -> yenidən çək və modalı bağla
      await refetch?.();
      setChangeAddress(false);
    } catch (e: any) {
      setAddrError(e.message || 'Произошла ошибка при обновлении адреса.');
      console.error('changeOrderAddress error:', e);
    } finally {
      setSavingAddress(false);
    }
  };

  // Loading
  if (OrderLoading || tarnslationLoading) {
    return (
      <div>
        <Header />
        <Loading />
      </div>
    );
  }

  return (
    <div>
      <Header />

      {order && (
        <>
          {/* Address Change Modal */}
          {changeAddress && (
            <div
              className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center"
              onClick={e => {
                if (e.target === e.currentTarget) closeAddressModal();
              }}
            >
              <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
                <button
                  className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
                  onClick={closeAddressModal}
                  aria-label="Close"
                >
                  <IoClose size={22} />
                </button>
                <h2 className="text-xl font-semibold mb-4">Изменить адрес</h2>

                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg p-3 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={tarnslation?.noviy_adress ?? ''}
                  value={addressInput}
                  onChange={e => setAddressInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleSaveAddress();
                    if (e.key === 'Escape') closeAddressModal();
                  }}
                  autoFocus
                />

                {addrError && <p className="text-sm text-red-600 mb-2">{addrError}</p>}

                <button
                  className="bg-blue-600 text-white w-full py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                  onClick={handleSaveAddress}
                  disabled={savingAddress}
                >
                  {savingAddress ? 'Сохранение...' : 'Изменить адрес'}
                </button>
              </div>
            </div>
          )}

          <main className="flex max-sm:flex-col flex-row w-full gap-5 p-4">
            <UserAside active={1} />
            <div className="py-2 space-y-6">
              {/* Order Header */}
              <div className="bg-white rounded-lg p-2 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-slate-100 p-4 rounded-lg">
                      <Package className="h-6 w-6 text-slate-600" />
                    </div>
                    <div>
                      <div className="text-sm text-slate-500">Номер заказа:</div>
                      <div className="font-semibold">{order.order_number}</div>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-slate-500">История заказов:</div>
                    <div className="font-semibold">
                      {new Date(order.order_date).toLocaleDateString()}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-slate-500">Номер продукта</div>
                    <div className="font-semibold">
                      {order.order_items_count} продукт
                    </div>
                  </div>

                  <button className="bg-blue-100 text-blue-700 px-6 py-3 rounded-lg font-medium hover:bg-blue-200 transition-colors">
                    Загрузить счет-фактуру
                  </button>
                </div>
              </div>

              {/* Order Items */}
              {order?.order_items?.map((item: any, idx: number) => (
                <div
                  key={item?.id ?? idx}
                  className="bg-white rounded-lg p-6 shadow-sm"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Product Image and Details */}
                    <div className="flex gap-4">
                      <div className="w-24 h-24 bg-slate-100 rounded-md overflow-hidden">
                        {item?.product ? (
                          <img
                            src={item.product.image || '/placeholder.svg'}
                            alt={item.product.title}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-slate-200">
                            <span className="text-slate-500 text-xs" />
                          </div>
                        )}
                      </div>

                      <div className="space-y-1">
                        <h3 className="font-semibold">
                          {item?.product ? item.product.title : 'Product not available'}
                        </h3>
                        <div className="text-sm text-slate-500">
                          {(item?.options || [])
                            .map((opt: any) => `${opt.filter}: ${opt.option}`)
                            .join(', ')}
                        </div>
                        <div className="font-bold">{formatCurrency(item?.price)}</div>
                        {item?.product && (
                          <button
                            className="text-blue-600 text-sm"
                            onClick={() => setProductCommit(item.id)}
                          >
                            Оцените продукт
                          </button>
                        )}
                      </div>
                    </div>

                    {order?.status?.length > 0 ? (
                      <div className="ml-auto flex items-start">
                        <div
                          className="bg-white-100 text-black-700 px-4 py-2 rounded-full flex items-center gap-1"
                          style={{
                            display: order?.isCancel ? 'none' : '',
                            border: '1px solid #cecece',
                          }}
                        >
                          <span>{order?.status ?? ''}</span>
                        </div>
                      </div>
                    ) : null}
                  </div>

                  {/* Order Progress */}
                  <div
                    ref={scrollRef}
                    className="mt-8 overflow-x-auto"
                    style={{ maxWidth: '1160px', width: '100%' }}
                  >
                    <div className="relative flex items-start min-w-max gap-10 px-4 pb-4">
                      {/* Progress line */}
                      <div
                        className="absolute top-3 left-4 right-4 h-1 bg-slate-200 z-0"
                        style={{ display: order?.isCancel ? 'none' : '' }}
                      >
                        <div
                          className="h-1 bg-green-500 transition-all duration-500"
                          style={{
                            // burada bütün statuslar done kimi göstərilir
                            width: '100%',
                          }}
                        />
                      </div>

                      {order?.isCancel ? (
                        <div className="text-red-600 font-semibold py-4 px-6 border rounded bg-red-100 text-center flex align-center justify-center gap-3">
                          <IoClose fontSize={24} />
                          <p>{order?.cancelTitle}</p>
                        </div>
                      ) : (
                        <div className="flex gap-4">
                          {(item?.statuses || []).map((s: any) => (
                            <div
                              key={s.id}
                              className="z-10 flex flex-col items-center text-center min-w-[80px]"
                            >
                              <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center">
                                <CheckCircle2 className="w-4 h-4" />
                              </div>
                              <p className="mt-2 text-xs font-medium capitalize">
                                {s.status}
                              </p>
                              <p className="text-[10px] text-slate-500 whitespace-nowrap">
                                {s.created_at}
                              </p>
                            </div>
                          ))}

                          {item?.statusDelivery && (
                            <div className="z-10 flex flex-col items-center text-center min-w-[80px]">
                              <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center">
                                <CheckCircle2 className="w-4 h-4" />
                              </div>
                              <p className="mt-2 text-xs font-medium capitalize">
                                {item.statusDelivery.status}
                              </p>
                              <p className="text-[10px] text-slate-500 whitespace-nowrap">
                                {item.statusDelivery.created_at}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-8 flex flex-col md:flex-row items-start gap-4">
                    {item?.returnable && (
                      <>
                        <button
                          className="border border-blue-600 text-blue-600 px-5 py-2 rounded-lg hover:bg-blue-50"
                          onClick={() => setRestoreModal(true)}
                        >
                          {tarnslation?.iade_et}
                        </button>
                        <button
                          onClick={() => setCommentModal(true)}
                          className="inline-flex items-center gap-2 px-5 py-2 rounded-lg border border-blue-500 text-blue-600 text-sm font-medium hover:bg-blue-100 transition-colors"
                        >
                          {tarnslation?.add_com}
                        </button>
                        {commentModal && (
                          <RatingModal
                            productId={item?.product?.id ? item?.product?.id : null}
                            onClose={() => setCommentModal(false)}
                          />
                        )}
                        {restoreModal && (
                          <RestoreModal
                            productd={item?.product}
                            order_item_id={item?.id}
                            onClose={() => setRestoreModal(false)}
                          />
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}

              {/* Delivery & Payment */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Delivery */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Информация о доставке:
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm text-slate-500">Адрес:</div>
                        <div className="font-medium">{order.address}</div>
                      </div>

                      {order.addressChangeAble && (
                        <button
                          className="text-blue-600 flex items-center gap-1 text-sm"
                          onClick={openAddressModal}
                        >
                          Изменить адресную информацию
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Payment */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Платежная информация:
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="text-slate-500">Количество продукта:</div>
                        <div className="font-medium">
                          {formatCurrency(order.total_price)}
                        </div>
                      </div>

                      {order.discount && Number.parseFloat(order.discount) > 0 && (
                        <div className="flex justify-between items-center">
                          <div className="text-slate-500">Скидка:</div>
                          <div className="font-medium text-red-500">
                            -{formatCurrency(order.discount)}
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between items-center">
                        <div className="text-slate-500">Сумма доставки:</div>
                        <div className="font-medium">
                          {order.delivered_price
                            ? formatCurrency(order.delivered_price)
                            : '0.00 ₽'}
                        </div>
                      </div>

                      <div className="border-t pt-4 flex justify-between items-center">
                        <div className="text-slate-500">:Сумма доставки</div>
                        <div className="font-bold text-green-600">
                          {formatCurrency(order.final_price)}
                        </div>
                      </div>

                      {order.payment_type === 'card' && (
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-8 h-5 bg-red-500 rounded" />
                          <div className="w-8 h-5 bg-yellow-500 rounded" />
                          <div className="text-sm">****0000</div>
                        </div>
                      )}

                      {order.payment_type === 'cash' && (
                        <div className="flex items-center justify-end gap-2">
                          <div className="text-sm">{tarnslation?.nagd_odenis}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {/* /Delivery & Payment */}
            </div>
          </main>
        </>
      )}
    </div>
  );
};

export default OrderItemsDetail;
