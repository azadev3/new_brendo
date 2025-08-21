import Header from '../components/Header';
import { Footer } from '../components/Footer';

import FAQSection from '../components/Faq';
import { ConmtactItem, SocialMediaLink, TranslationsKeys } from '../setting/Types';
import GETRequest from '../setting/Request';
import Loading from '../components/Loading';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import axios from 'axios';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import ROUTES from '../setting/routes';

export default function Contact() {
  const { lang = 'ru' } = useParams<{
    lang: string;
  }>();

  const { data: tarnslation, isLoading: tarnslationLoading } =
    GETRequest<TranslationsKeys>(`/translates`, 'translates', [lang]);

  const validationSchema = Yup.object().shape({
    firstName: Yup.string()
      .required(tarnslation?.is_r_1 ?? '')
      .min(2, tarnslation?.is_r_2 ?? ''),
    lastName: Yup.string()
      .required(tarnslation?.is_r_3 ?? ' =')
      .min(2, tarnslation?.is_r_4 ?? ''),
    phone: Yup.string()
      .required(tarnslation?.is_r_5 ?? '')
      .matches(/^[0-9]{10}$/, tarnslation?.is_r_6 ?? ''),
    email: Yup.string()
      .required(tarnslation?.is_r_7 ?? '')
      .email(tarnslation?.is_r_8 ?? ''),
    category: Yup.string().required(tarnslation?.is_r_9 ?? ''),
    note: Yup.string()
      .required(tarnslation?.is_r_10 ?? '')
      .max(500, tarnslation?.is_r_11 ?? ''),
  });

  const { data: ContactInfo, isLoading: ContactInfoLoading } = GETRequest<
    ConmtactItem[]
  >(`/contact_items`, 'contact_items', [lang]);
  const { data: socials } = GETRequest<SocialMediaLink[]>(`/socials`, 'socials', []);
  if (tarnslationLoading || ContactInfoLoading) {
    return <Loading />;
  }
  return (
    <div className="">
      <Header />
      <main className=" lg:mt-[0px] mt-0 max-sm:mt-3">
        <section
          className="px-[40px] max-sm:px-4 max-sm:py-5 h-[260px] py-[40px]"
          style={{
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundImage: 'url("/images/contact.jpg")',
          }}
        >
          <div className="flex items-center gap-2">
            <Link
              reloadDocument
              to={`/${lang}/${ROUTES.home[lang as keyof typeof ROUTES.home]}`}
            >
              <h6 className="text-nowrap self-stretch my-auto text-black hover:text-blue-600">
                {tarnslation?.home}{' '}
              </h6>
            </Link>
            {/* <img
                            loading="lazy"
                            src="https://cdn.builder.io/api/v1/image/assets/TEMP/64bb3b3dae771cd265db1accd95aa96f30bd9da3da88a57867743da53bebc0eb?placeholderIfAbsent=true&apiKey=2d5d82cf417847beb8cd2fbbc5e3c099"
                            className="object-contain shrink-0 self-stretch my-auto w-6 aspect-square"
                        />

                        <Link
                            to={`/${lang}/${
                                ROUTES.product[
                                    lang as keyof typeof ROUTES.product
                                ]
                            }`}
                        >
                            <h6 className="text-nowrap self-stretch my-auto hover:text-blue-600">
                                {tarnslation?.Məhsullar}{' '}
                            </h6>
                        </Link> */}
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/64bb3b3dae771cd265db1accd95aa96f30bd9da3da88a57867743da53bebc0eb?placeholderIfAbsent=true&apiKey=2d5d82cf417847beb8cd2fbbc5e3c099"
              className="object-contain shrink-0 self-stretch my-auto w-6 aspect-square"
            />
            <h6 className="text-nowrap self-stretch my-auto">{tarnslation?.Əlaqə} </h6>
          </div>
        </section>

        <section className="rounded-3xl px-[40px] max-sm:px-4 my-[20px]">
          <div className="flex gap-5 lg:flex-row flex-col ">
            <div className="flex flex-col lg:w-[41%] w-full max-md:ml-0 max-md:w-full">
              <div className="flex overflow-hidden flex-col grow items-start pt-10 pr-20 pb-52 pl-10 w-full rounded-3xl bg-[#8E98B8] max-md:px-5 max-md:pb-24 max-md:mt-5 max-md:max-w-full">
                <div className="flex flex-col max-w-full text-white w-[391px]">
                  <div className="text-xl font-semibold">
                    {tarnslation?.Əlaqə_məlumatları}
                  </div>
                  <div className="flex flex-col mt-7 w-full text-base">
                    {ContactInfo?.map(item => (
                      <div className="flex overflow-hidden flex-col justify-center items-start p-2 w-full bg-white bg-opacity-10 rounded-[100px] max-md:pr-5">
                        <div className="flex gap-3 items-center">
                          <img
                            loading="lazy"
                            src={item.icon}
                            className="object-contain shrink-0 self-stretch my-auto w-10 aspect-square"
                          />
                          <div className="self-stretch my-auto">{item.value} </div>
                        </div>
                      </div>
                    ))}

                    {/* <div className="flex overflow-hidden flex-col justify-center items-start p-2 mt-3 w-full whitespace-nowrap bg-white bg-opacity-10 rounded-[100px] max-md:pr-5">
                                            <div className="flex gap-3 items-center">
                                                <img
                                                    loading="lazy"
                                                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/d9dbd77cdecb8f977587a57edbab8040fd81da59f44ce5ce9520a647134d299a?placeholderIfAbsent=true&apiKey=2d5d82cf417847beb8cd2fbbc5e3c099"
                                                    className="object-contain shrink-0 self-stretch my-auto w-10 aspect-square"
                                                />
                                                <div className="self-stretch my-auto">
                                                    nümunə@gmail.com
                                                </div>
                                            </div>
                                        </div> */}
                  </div>
                </div>
                <div className="flex flex-col mt-10 w-52 max-w-full">
                  <div className="text-sm text-white">{tarnslation?.Sosial_media} </div>
                  <div className="flex gap-4 items-center mt-3 w-full">
                    {socials?.map((item: SocialMediaLink) => (
                      <Link reloadDocument to={item.url}>
                        <img
                          loading="lazy"
                          alt={item.title}
                          src={item.icon}
                          className="object-contain cursor-pointer shrink-0 self-stretch my-auto w-10 aspect-square rounded-[100px]"
                        />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col  lg:w-[59%] w-full max-md:ml-0 max-md:w-full">
              <Formik
                initialValues={{
                  firstName: '',
                  lastName: '',
                  phone: '',
                  email: '',
                  category: '',
                  note: '',
                }}
                validationSchema={validationSchema}
                onSubmit={async (values, { setSubmitting }) => {
                  try {
                    const res = await axios.post(
                      'https://admin.brendoo.com/api/contact',
                      {
                        name: values.firstName,
                        surname: values.lastName,
                        phone: values.phone,
                        message: values.note,
                        category: values.category,
                        email: values.email,
                      },
                    );
                    if (res.status === 200 || res.status === 201) {
                      toast.success(tarnslation?.msg_send ?? '');
                    }
                  } catch (error) {
                    console.error(error);
                    toast.error(tarnslation?.error_msg ?? '');
                  } finally {
                    setSubmitting(false);
                  }
                }}
              >
                {({ isSubmitting }) => (
                  <Form className="flex flex-col px-10 py-11 w-full rounded-3xl bg-[#8E98B8]">
                    <h2 className="self-center text-xl font-semibold text-center text-white">
                      {tarnslation?.Fill_the_Form}
                    </h2>

                    {/* Name and Surname */}
                    <div className="flex lg:flex-row flex-col gap-3 mt-8 w-full">
                      <div className="w-full">
                        <Field
                          type="text"
                          name="firstName"
                          placeholder={tarnslation?.First_Name}
                          className="w-full px-5 py-5 bg-white bg-opacity-10 rounded-[100px] placeholder-white text-white"
                        />
                        <ErrorMessage
                          name="firstName"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>
                      <div className="w-full">
                        <Field
                          type="text"
                          name="lastName"
                          placeholder={tarnslation?.Last_Name}
                          className="w-full px-5 py-5 text-white bg-white bg-opacity-10 rounded-[100px] placeholder-white"
                        />
                        <ErrorMessage
                          name="lastName"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>
                    </div>

                    {/* Phone and Email */}
                    <div className="flex lg:flex-row flex-col gap-3 mt-3 w-full">
                      <div className="w-full">
                        <div className="w-full text-white px-5  bg-white bg-opacity-10 rounded-[100px] placeholder-white flex flex-row justify-center items-center gap-2">
                          +7
                          <Field
                            className="w-full h-full py-5  bg-white bg-opacity-0  focus:outline-none"
                            type="number"
                            name="phone"
                            placeholder="+7 00 000 00 00"
                          />
                        </div>
                        <ErrorMessage
                          name="phone"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>
                      <div className="w-full">
                        <Field
                          type="email"
                          name="email"
                          placeholder={tarnslation?.Email ?? ''}
                          className="w-full text-white px-5 py-5 bg-white bg-opacity-10 rounded-[100px] placeholder-white"
                        />
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>
                    </div>

                    {/* Category */}
                    <div className="mt-3 w-full">
                      <Field
                        type="text"
                        name="category"
                        placeholder={tarnslation?.Category}
                        className="w-full px-5 py-5 bg-white bg-opacity-10 rounded-[100px] placeholder-white text-white"
                      />
                      <ErrorMessage
                        name="category"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                    {/* Note */}
                    <div className="mt-3 w-full">
                      <Field
                        as="textarea"
                        name="note"
                        placeholder={tarnslation?.Note}
                        className="w-full px-5 py-5 bg-white bg-opacity-10 rounded-[20px] placeholder-white min-h-[110px] text-white"
                      />
                      <ErrorMessage
                        name="note"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="mt-3 w-full">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full px-5 py-5 bg-white text-black rounded-[100px] disabled:opacity-50"
                      >
                        {tarnslation?.Submit}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </section>
        <FAQSection Title={tarnslation?.Tez_tez_verilən_suallar} isContact={true} />
      </main>
      <Footer />
    </div>
  );
}
