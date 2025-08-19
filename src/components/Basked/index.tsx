import { useEffect, useState } from 'react';
import { Formik, Form, Field } from 'formik';
import { useParams } from 'react-router-dom';
import GETRequest from '../../setting/Request';
import { TranslationsKeys } from '../../setting/Types';
import * as Yup from 'yup';
import axios from 'axios';
import SearchableSelect from './SearchableSelect';
import SearchableSelectCity from './SearchableSelectCity';

const validationSchema = Yup.object().shape({
  address: Yup.string()
    .min(5, 'Адрес должен содержать минимум 5 символов')
    .required('Введите адрес'), // artıq "Введите адрес правильно" gəlməyəcək
  additionalInfo: Yup.string().optional(),
});

export default function BaskedForum({
  Name,
  Email,
  Number,
  onSubmit,
}: {
  Name: string;
  Email: string;
  Number: string;
  onSubmit: (values: any) => void;
}) {
  const { lang = 'ru' } = useParams<{ lang: string }>();

  const { data: translation } = GETRequest<TranslationsKeys>(`/translates`, 'translates', [
    lang,
  ]);
  // const { data: shops } = GETRequest<Store[]>(`/shops`, 'shops', [lang]);

  // Bölge ve şehir dataları
  const [regionData, setRegionData] = useState<
    { id: number; regionId: number; regionName: string }[]
  >([]);
  const [cityData, setCityData] = useState<{ id: number; cityId: number; cityName: string }[]>(
    [],
  );

  // Seçili bölge ve şehir state'leri
  const [regionId, setRegionId] = useState<number | ''>('');
  const [cityId, setCityId] = useState<number | ''>('');

  // Kullanıcı bilgileri localStorage'dan
  const userStr = localStorage.getItem('user-info');
  const parsedUser = userStr ? JSON.parse(userStr) : null;

  // Kullanıcı adresi ve ek bilgi
  // const userAddress = parsedUser?.customer?.address || '';
  const userAdditionalInfo = ''; // Ekstra info varsa buradan çekebilirsin

  // Token (API çağrılarında)
  const token = parsedUser?.token || '';

  // API'den bölgeleri çek
  const getRegions = async () => {
    try {
      const res = await axios.get('https://admin.brendoo.com/api/regions', {
        headers: { 'Accept-Language': lang, Authorization: `Bearer ${token}` },
      });
      if (res.data) setRegionData(res.data);
    } catch (e) {
      console.error('Regions fetch error:', e);
    }
  };

  // Seçilen bölgeye göre şehirleri çek
  const getCities = async (regionId: number) => {
    try {
      const res = await axios.get(`https://admin.brendoo.com/api/cities/${regionId}`, {
        headers: { 'Accept-Language': lang, Authorization: `Bearer ${token}` },
      });
      if (res.data) setCityData(res.data);
    } catch (e) {
      console.error('Cities fetch error:', e);
    }
  };

  // Başlangıçta bölgeleri çek
  useEffect(() => {
    getRegions();
  }, []);

  // regionId değişince şehirleri çek
  useEffect(() => {
    if (regionId) {
      getCities(regionId);
    } else {
      setCityData([]);
      setCityId('');
    }
  }, [regionId]);

  // Eğer localStorage'dan bölge ve şehir var ise set et
  useEffect(() => {
    if (parsedUser?.customer?.region_id) setRegionId(parsedUser.customer.region_id);
    if (parsedUser?.customer?.city_id) setCityId(parsedUser.customer.city_id);
  }, [parsedUser]);

  return (
    <div className="flex overflow-hidden flex-col justify-center p-10 rounded-3xl bg-stone-50 lg:w-[70%] w-full max-md:px-5 max-sm:px-2">
      <div className="flex flex-col max-md:max-w-full">
        <div className="text-sm text-black text-opacity-60 max-md:max-w-full">
          {translation?.Şəxsi_məlumatlarım || 'Şəxsi məlumatlarım'}
        </div>

        <div className="flex flex-col mt-5 w-full text-base text-black max-md:max-w-full">
          <div className="overflow-hidden px-5 py-5 w-full bg-white border border-solid border-black border-opacity-10 rounded-[100px]">
            {Name}
          </div>
          <div className="flex lg:flex-row flex-col gap-5 items-center mt-5 max-md:max-w-full">
            <div className="overflow-hidden self-stretch px-5 py-5 my-auto bg-white border border-solid border-black border-opacity-10 min-w-[240px] rounded-[100px] lg:w-1/2 w-full">
              {Email}
            </div>
            <div className="overflow-hidden self-stretch px-5 py-5 my-auto bg-white border border-solid border-black border-opacity-10 min-w-[240px] rounded-[100px] lg:w-1/2 w-full">
              +7 {Number}
            </div>
          </div>
        </div>

        <div className="mt-7 w-full min-h-0 border border-solid border-black border-opacity-10 max-md:max-w-full" />

        {/* Formik Form */}
        <Formik
          enableReinitialize
          initialValues={{
            address: parsedUser?.customer?.address?.address || '',
            additionalInfo: userAdditionalInfo,
            regionId: regionId || '',
            cityId: cityId || '',
            deliveryType: true,
            paymentType: true,
            settlement: '',
          }}
          validationSchema={validationSchema}
          onSubmit={values => {
            onSubmit(values);

            if (parsedUser) {
              const updatedUser = { ...parsedUser };
              updatedUser.customer.address = {
                ...parsedUser.customer.address,
                address: values.address, // yalnız string-i update et
              };
              updatedUser.customer.region_id = values.regionId;
              updatedUser.customer.city_id = values.cityId;
              localStorage.setItem('user-info', JSON.stringify(updatedUser));
            }
          }}
        >
          {({ values, errors, touched }: any) => (
            <Form
              className="flex flex-col mt-7 w-full max-md:max-w-full"
              onChange={() => {
                // Form her değiştiğinde onSubmit çağrılabilir
                if (Object.keys(errors).length === 0) {
                  onSubmit(values);
                }
              }}
            >
              {/* Adres inputu */}
              <div className="flex flex-col mt-3">
                <label className="mb-1">{translation?.Ünvan || 'Ünvan'}</label>
                <Field
                  name="address"
                  placeholder={translation?.Ünvan || 'Ünvan'}
                  className="overflow-hidden px-5 py-5 w-full bg-white border border-solid border-black border-opacity-10 rounded-[200px]"
                />
                {errors.address && touched.address && (
                  <div className="text-red-500 text-sm">{errors?.address}</div>
                )}
              </div>

              {/* Bölge seçimi */}
              <div className="flex flex-col mt-5">
                <Field name="regionId">
                  {({ form }: any) => (
                    <SearchableSelect
                      regionData={regionData}
                      value={form.values.regionId}
                      onChange={(selectedRegionId: number) => {
                        form.setFieldValue('regionId', selectedRegionId);
                        setRegionId(selectedRegionId);
                        // Bölge değişince şehir temizlenir
                        form.setFieldValue('cityId', '');
                        setCityId('');
                      }}
                    />
                  )}
                </Field>
                {errors.regionId && touched.regionId && (
                  <div className="text-red-500 text-sm">{errors.regionId}</div>
                )}
              </div>

              {/* Şehir seçimi */}
              <div className="flex flex-col mt-5">
                <Field name="cityId">
                  {({ form }: any) => (
                    <SearchableSelectCity
                      cityData={cityData}
                      value={form.values.cityId}
                      onChange={(selectedCityId: number) => {
                        form.setFieldValue('cityId', selectedCityId);
                        setCityId(selectedCityId);
                      }}
                      // @ts-ignore dsb
                      disabled={!values.regionId}
                    />
                  )}
                </Field>
                {errors.cityId && touched.cityId && (
                  <div className="text-red-500 text-sm">{errors.cityId}</div>
                )}
              </div>

              {/* Ek bilgi inputu */}
              {/* <div className="flex flex-col mt-5">
                <label className="mb-1">{translation?.Əlavə_məlumat || 'Əlavə məlumat'}</label>
                <Field
                  name="additionalInfo"
                  placeholder={translation?.Əlavə_məlumat || 'Əlavə məlumat'}
                  className="overflow-hidden px-5 py-5 w-full bg-white border border-solid border-black border-opacity-10 rounded-[200px]"
                />
                {errors.additionalInfo && touched.additionalInfo && (
                  <div className="text-red-500 text-sm">{errors.additionalInfo}</div>
                )}
              </div> */}

              {/* Teslimat tipi ve ödeme tipi checkboxları */}
              {/* <div className="flex flex-row gap-5 mt-7">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Field type="checkbox" name="deliveryType" />
                  <span>{translation?.Çatdırılma_növü || 'Çatdırılma növü'}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Field type="checkbox" name="paymentType" />
                  <span>{translation?.Ödəniş_növü || 'Ödəniş növü'}</span>
                </label>
              </div> */}

              <button
                type="submit"
                className="invisible gap-2.5 self-start px-10 leading-[19px] py-4 mt-7 lg:w-fit w-full text-base font-medium text-white bg-blue-600 rounded-[100px] max-md:px-5"
              >
                {translation?.Yadda_saxla || 'Yadda saxla'}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
