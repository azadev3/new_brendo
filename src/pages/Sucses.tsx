import Header from '../components/Header';
import { Footer } from '../components/Footer';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { TranslationsKeys } from '../setting/Types';
import GETRequest from '../setting/Request';
import ROUTES from '../setting/routes';
import Loading from '../components/Loading';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

export default function Sucses() {
  const navigate = useNavigate();
  const { lang = 'ru' } = useParams<{ lang: string }>();

  const userInfo = localStorage.getItem('user-info');
  const parsedInfo = userInfo ? JSON.parse(userInfo) : null;
  const token = parsedInfo?.token;

  const [orderId, setOrderId] = useState<string | null>(null);
  const [operationId, setOperationId] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const onceRef = useRef(false);

  const { data: tarnslation, isLoading: tarnslationLoading } =
    GETRequest<TranslationsKeys>(`/translates`, 'translates', [lang]);

  useEffect(() => {
    setOrderId(localStorage.getItem('order_ID'));
    setOperationId(localStorage.getItem('operation_id'));
  }, []);

  const postOrder = async () => {
    if (onceRef.current) return;
    onceRef.current = true;

    try {
      if (!token || !orderId || !operationId) return;

      await axios.post(
        'https://admin.brendoo.com/api/check-payment',
        { order_id: orderId, operation_id: operationId },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // başarılıysa localStorage temizle ama YÖNLENDİRME YAPMA
      localStorage.removeItem('order_ID');
      localStorage.removeItem('operation_id');
      window.scrollTo(0, 0);
    } catch (error) {
      console.error('Ödeme kontrol hatası:', error);
      // başarısızsa da yönlendirme yok; mesaj gösterilebilir
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    if (userInfo && orderId && operationId) {
      postOrder();
    } else {
      setChecking(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo, orderId, operationId]);

  if (tarnslationLoading || checking) {
    return <Loading />;
  }

  return (
    <div>
      <Header /* eğer Header içinde otomatik redirect varsa burada prop ile kapat */ />
      <main>
        <div className="px-[40px] max-sm:px-4 pt-[40px] mb-[28px] ">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Breadcrumb'larda reloadDocument KULLANMA */}
            <Link to={`/${lang}`}>
              <h6 className="text-nowrap self-stretch my-auto text-black hover:text-blue-600">
                {tarnslation?.home}
              </h6>
            </Link>
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/64bb3b3dae771cd265db1accd95aa96f30bd9da3da88a57867743da53bebc0eb?placeholderIfAbsent=true&apiKey=2d5d82cf417847beb8cd2fbbc5e3c099"
              className="object-contain shrink-0 self-stretch my-auto w-6 aspect-square"
            />
            <Link to={`/${lang}/${ROUTES.order[lang as keyof typeof ROUTES.order]}`}>
              <h6 className="text-nowrap self-stretch my-auto hover:text-blue-600">
                {tarnslation?.basked}
              </h6>
            </Link>
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/64bb3b3dae771cd265db1accd95aa96f30bd9da3da88a57867743da53bebc0eb?placeholderIfAbsent=true&apiKey=2d5d82cf417847beb8cd2fbbc5e3c099"
              className="object-contain shrink-0 self-stretch my-auto w-6 aspect-square"
            />
            <h6 className="text-nowrap self-stretch my-auto">{tarnslation?.sucses}</h6>
          </div>
        </div>

        <section className="flex justify-center items-center pb-[120px] px-7">
          <div className="max-w-[440px] flex flex-col justify-center items-center">
            {/* SVG ... */}
            <h1 className="text-[20px] font-semibold text-center text-[#132A1B]">
              {tarnslation?.uğurlu_sifariş}
            </h1>
            <p className="text-[14px] max-w-[440px] font-normal text-center opacity-80 mb-[24px]">
              {tarnslation?.uğurlu_sifariş_desc}
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                className="px-[24px] py-[12px] rounded-[100px] border border-[#3873C3] border-opacity-25 text-[16px] font-medium text-[#3873C3]"
                onClick={() =>
                  navigate(`/${lang}/${ROUTES.home[lang as keyof typeof ROUTES.home]}`)
                }
              >
                {tarnslation?.uğurlu_sifariş_btn /* “Ana sayfaya dön” gibi */}
              </button>

              <button
                type="button"
                className="px-[24px] py-[12px] rounded-[100px] border border-[#3873C3] border-opacity-25 text-[16px] font-medium text-[#3873C3]"
                onClick={() =>
                  navigate(
                    `/${lang}/${ROUTES.order[lang as keyof typeof ROUTES.order]}`,
                  )
                }
              >
                {tarnslation?.sifarislerim || 'Siparişlerim'}
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
