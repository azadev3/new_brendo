import React, { ChangeEvent, FormEvent, useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import GETRequest from '../../setting/Request';
import { TranslationsKeys } from '../../setting/Types';
import ROUTES from '../../setting/routes';
import { baseUrlInf } from '../../InfluencerBaseURL';
// Validation Schema using Yup

const Register = () => {
  const { lang = 'ru' } = useParams<{ lang: string }>();

  const { data: tarnslation } = GETRequest<TranslationsKeys>(
    `/translates`,
    'translates',
    [lang],
  );

  const validationSchema = Yup.object({
    name: Yup.string().required('Please enter your name'),
    phone: Yup.string()
      .required(tarnslation?.is_r_5 ?? '')
      .matches(/^[0-9]{10}$/, tarnslation?.is_r_6 ?? ''),
    email: Yup.string()
      .email(tarnslation?.is_r_12 ?? '')
      .required(tarnslation?.Pls_r ?? ''),
    password: Yup.string()
      .min(8, tarnslation?.long ?? '')
      .required(tarnslation?.ps_w ?? ''),
    acceptTerms: Yup.boolean()
      .oneOf([true], tarnslation?.must_be_c ?? '')
      .required(tarnslation?.must_be_c ?? ''),
    gender: Yup.string()
      .oneOf(['man', 'woman'], tarnslation?.gn ?? '')
      .required(tarnslation?.gender_is_req ?? ' '),
    birthday: Yup.date().required(tarnslation?.birt ?? ''),
  });

  const [userType, setUserType] = useState<'user' | 'influencer'>('user');

  const [showPassword, setShowPassword] = useState(false);
  const [variant] = useState<1 | 2>(1);

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const navigate = useNavigate();

  async function handleRegister(values: {
    name: string;
    phone: string;
    email: string;
    password: string;
    gender: string;
    birthday: string;
  }) {
    try {
      const response = await axios.post('https://admin.brendoo.com/api/register', {
        name: values.name,
        phone: `${values.phone}`,
        email: values.email,
        password: values.password,
        gender: values.gender === '' ? 'man' : values.gender,
        birthday: values.birthday,
      });

      if (response.status === 200 || response.status === 201) {
        navigate(`/${lang}/${ROUTES.login[lang as keyof typeof ROUTES.login]}`);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.data?.error) {
          error.response.data.error.forEach((item: string) => {
            toast.error(item);
          });
        } else {
          toast.error('');
        }
      }
    }
  }

  const { data: registerImage } = GETRequest<{ image: string }>(
    `/registerImage`,
    'registerImage',
    [lang],
  );

  // const [otpValues, setOtpValues] = React.useState(Array(6).fill(""));
  // const [renderOtp, setRenderOtp] = React.useState<boolean>(false);
  // const RenderOtpComponent = () => {
  //   const inputsRef = React.useRef<HTMLInputElement[]>([]);

  //   const handleChange = (index: number, value: string) => {
  //     if (!/^[0-9]?$/.test(value)) return; // Sadece rakam
  //     const newOtp = [...otpValues];
  //     newOtp[index] = value;
  //     setOtpValues(newOtp);

  //     if (value && index < 5) {
  //       inputsRef.current[index + 1]?.focus();
  //     }
  //   };

  //   const handleSubmitCode = async () => {
  //     const otpCode = otpValues.join("");
  //     if (otpCode.length !== 6) {
  //       toast.error("Zəhmət olmasa 6 rəqəmli kodu tam doldurun");
  //       return;
  //     }

  //     try {
  //       const data = {
  //         verification_code: otpCode,
  //         verification_token: localStorage.getItem("efq") || "",
  //       };

  //       const res = await axios.post(
  //         "https://admin.brendoo.com/api/influencers/verifyEmail",
  //         data
  //       );
  //       if (res.data) {
  //         toast.success("Email təsdiqləndi!");
  //         navigate(
  //           `/${lang}/${ROUTES.login[lang as keyof typeof ROUTES.login]}`
  //         );
  //       } else {
  //         toast.error("Doğrulama kodu yanlışdır");
  //       }
  //     } catch (err) {
  //       toast.error("Bir xəta baş verdi");
  //       console.error(err);
  //     }
  //   };

  //   return (
  //     <div className="flex flex-col items-center gap-4 mt-6">
  //       <div className="flex gap-2">
  //         {otpValues.map((val, i) => (
  //           <input
  //             key={i}
  //             ref={(el) => (inputsRef.current[i] = el!)}
  //             type="text"
  //             maxLength={1}
  //             value={val}
  //             onChange={(e) => handleChange(i, e.target.value)}
  //             className="w-12 h-12 text-center border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-xl"
  //           />
  //         ))}
  //       </div>
  //       <button
  //         onClick={handleSubmitCode}
  //         className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
  //       >
  //         Təsdiqlə
  //       </button>
  //     </div>
  //   );
  // };

  const [name, setName] = React.useState<string>('');
  const [email, setEmail] = React.useState<string>('');
  const [telephone, setTelephone] = React.useState<string>('');
  const [socialProfile, setSocialProfile] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const handleSubmitInfluencer = async () => {
    try {
      const data = {
        name,
        email,
        phone: telephone,
        social_profile: socialProfile,
        password,
      };

      const res = await axios.post(`${baseUrlInf}/register`, data);

      if (res?.status === 200 || res?.status === 201) {
        toast.success('Uğurla qeydiyyatdan keçdiniz!');
        // OTP üçün tokeni saxlamaq YOXDUR artıq:
        // localStorage.setItem('efq', res.data?.data?.email_verification_token);

        const loginPath =
          ROUTES.login?.[lang as keyof typeof ROUTES.login] ?? ROUTES.login['ru'];
        navigate(`/${lang}/${loginPath}`);
      } else {
        toast.error('Qeydiyyat tamamlanmadı. Yenidən cəhd edin.');
      }
    } catch (error: any) {
      // İstəyə görə backend error mesajnı göstər
      const msg =
        error?.response?.data?.message ||
        (Array.isArray(error?.response?.data?.error) &&
          error.response.data.error.join(', ')) ||
        'Xəta baş verdi. Yenidən cəhd edin.';
      toast.error(msg);
      console.error(error);
    }
  };

  return (
    <div className="flex overflow-hidden flex-col bg-white">
      <div className="flex  relative flex-col w-full h-[93vh] max-md:max-w-full justify-center items-center px-[40px] max-sm:px-4">
        <img
          loading="lazy"
          src={registerImage?.image || ''}
          className="object-cover absolute inset-0 size-full"
        />
        <div
          onClick={() => navigate(-1)}
          className="rounded-full z-[50] bg-white lg:w-[56px] lg:h-[56px] w-[35px] h-[35px] bg-opacity-60 absolute top-5 left-5 cursor-pointer"
        >
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/d1d01662ce302f4f64e209cc8ecd0540b6f0e5fb3d4ccd79eead1b316a272d11?placeholderIfAbsent=true&apiKey=2d5d82cf417847beb8cd2fbbc5e3c099"
            className="object-contain w-14 aspect-square rounded-full"
          />
        </div>

        {variant === 1 && (
          <div className="flex z-[50] overflow-auto relative flex-col justify-start self-center lg:px-16  lg:py-6 p-[10px] mb-0 max-w-full rounded-3xl bg-white bg-opacity-20 w-[560px] ">
            <div className="flex flex-col max-md:max-w-full">
              <div className="flex flex-col items-center self-center text-center">
                <div className="text-3xl font-bold text-white">
                  {tarnslation?.register}
                </div>
                <div className="mt-3 text-base text-white text-opacity-80">
                  {tarnslation?.registerdesc}
                </div>
              </div>

              <div
                className="flex gap-4 justify-start mb-6 text-white z-[60]"
                style={{ marginTop: '48px' }}
              >
                <label className="flex items-center gap-2">
                  <input
                    style={{
                      minWidth: '21px',
                      width: '21px',
                      minHeight: '21px',
                      height: '21px',
                    }}
                    type="radio"
                    name="userType"
                    value="user"
                    checked={userType === 'user'}
                    onChange={() => setUserType('user')}
                  />
                  {tarnslation?.istifadeci_key}
                </label>
                <label className="flex items-center gap-2">
                  <input
                    style={{
                      minWidth: '21px',
                      width: '21px',
                      minHeight: '21px',
                      height: '21px',
                    }}
                    type="radio"
                    name="userType"
                    value="influencer"
                    checked={userType === 'influencer'}
                    onChange={() => setUserType('influencer')}
                  />
                  {tarnslation?.influencer_key ?? ''}
                </label>
              </div>

              {userType === 'user' ? (
                <>
                  <Formik
                    initialValues={{
                      name: '',
                      phone: '',
                      email: '',
                      password: '',
                      acceptTerms: false, // Ensure boolean default value
                      gender: '',
                    }}
                    validationSchema={validationSchema}
                    onSubmit={async (values: any) => {
                      handleRegister({
                        name: values.name,
                        password: values.password,
                        email: values.email,
                        phone: values.phone,
                        gender: values.gender,
                        birthday: values.birthday,
                      });
                    }}
                  >
                    {() => (
                      <Form className="flex flex-col items-center mt-4 w-full max-md:max-w-full">
                        {/* <div className="flex gap-3 items-center text-base font-semibold text-center text-white">
                      <GoogleLogin
                        onSuccess={handleSuccess}
                        onError={handleError}
                      />
                    </div> */}
                        <div className="flex lg:gap-10 gap-5 items-center mt-4 text-xs text-center text-white w-full mb-4">
                          <div className="shrink-0 self-stretch my-auto h-px border border-solid border-white border-opacity-20 w-[35%]" />
                          <div className="self-stretch my-auto text-nowrap">
                            {tarnslation?.or}
                          </div>
                          <div className="shrink-0 self-stretch my-auto h-px border border-solid border-white border-opacity-20 w-[35%]" />
                        </div>
                        <div className="flex flex-col w-full max-md:max-w-full">
                          <Field
                            name="name"
                            className="overflow-hidden px-5 py-5 w-full h-[56px] text-base whitespace-nowrap bg-white border border-solid border-black border-opacity-10 rounded-[100px] text-black text-opacity-60"
                            placeholder={tarnslation?.name}
                          />
                          <ErrorMessage
                            name="name"
                            component="div"
                            className="text-red-500 text-xs mt-1"
                          />

                          <div className="flex  overflow-hidden px-5  w-full h-[56px] text-base whitespace-nowrap bg-white border border-solid border-black border-opacity-10 rounded-[100px] text-black text-opacity-60 mt-3">
                            <span className="text-black text-opacity-60 flex justify-center items-center">
                              +7
                            </span>
                            <Field
                              name="phone"
                              type="number"
                              className="outline-none bg-transparent ml-1 w-full h-[56px]"
                              placeholder="XXXXXXX"
                            />
                          </div>
                          <ErrorMessage
                            name="phone"
                            component="div"
                            className="text-red-500 text-xs mt-1"
                          />

                          <Field
                            name="email"
                            className="overflow-hidden px-5 py-5 w-full h-[56px] text-base whitespace-nowrap bg-white border border-solid border-black border-opacity-10 rounded-[100px] text-black text-opacity-60 mt-3"
                            placeholder={tarnslation?.Email ?? ''}
                          />
                          <ErrorMessage
                            name="email"
                            component="div"
                            className="text-red-500 text-xs mt-1"
                          />

                          <div className="flex overflow-hidden gap-5 justify-between px-5  w-full h-[56px] text-base whitespace-nowrap bg-white border border-solid border-black border-opacity-10 rounded-[100px] text-black text-opacity-60 mt-3">
                            <Field
                              type={showPassword ? 'text' : 'password'}
                              name="password"
                              placeholder={tarnslation?.password}
                              className="outline-none bg-transparent w-full h-[56px]"
                            />
                            <img
                              loading="lazy"
                              onClick={togglePasswordVisibility}
                              src={
                                showPassword
                                  ? 'https://cdn.builder.io/api/v1/image/assets/TEMP/cc75299a447e1f2b81cfaeb2821950c885d45d255e50ae73ad2684fcd9aa2110?placeholderIfAbsent=true&apiKey=2d5d82cf417847beb8cd2fbbc5e3c099'
                                  : '/svg/closedaye.svg'
                              }
                              className="object-contain shrink-0 w-6 aspect-square cursor-pointer"
                              alt="Toggle Password Visibility"
                            />
                          </div>
                          <ErrorMessage
                            name="password"
                            component="div"
                            className="text-red-500 text-xs mt-1"
                          />

                          <Field
                            as="select"
                            name="gender"
                            className="overflow-hidden px-5 py-2 w-full h-[56px] text-base whitespace-nowrap bg-white border border-solid border-black border-opacity-10 rounded-[100px] text-black text-opacity-60 mt-3"
                          >
                            <option defaultChecked>{tarnslation?.gender}</option>
                            <option value="man">
                              {lang === 'en' ? 'Male' : 'мужчина'}
                            </option>
                            <option value="woman">
                              {lang === 'en' ? 'Female' : 'женщина'}
                            </option>
                          </Field>
                          <ErrorMessage
                            name="gender"
                            component="div"
                            className="text-red-500 text-xs mt-1"
                          />

                          <div className="flex items-center mt-4">
                            <Field
                              type="checkbox"
                              name="acceptTerms"
                              className="mr-2 w-[14px] h-[14px]"
                            />
                            <label className="text-sm font-semibold text-white ">
                              {tarnslation?.razıyam}
                            </label>
                          </div>
                          <ErrorMessage
                            name="acceptTerms"
                            component="div"
                            className="text-red-500 text-xs mt-1"
                          />

                          <Field
                            name="birthday"
                            type="date"
                            className="px-5 py-5 w-full h-[56px] text-base whitespace-nowrap bg-white border border-solid border-black border-opacity-10 rounded-[100px] text-black text-opacity-60 mt-3"
                            placeholder={tarnslation?.Birthday ?? ''}
                          />
                          <ErrorMessage
                            name="birthday"
                            component="div"
                            className="text-red-500 text-xs mt-1"
                          />

                          <div className="gap-2.5 self-stretch px-10 py-4 lg:mt-7 mt-4 w-full text-base font-medium text-black border border-solid bg-slate-300 border-slate-300 rounded-[100px] max-md:px-5 max-md:max-w-full">
                            <button type="submit" className="w-full cursor-pointer">
                              {tarnslation?.register}
                            </button>
                          </div>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </>
              ) : (
                userType === 'influencer' && (
                  <>
                    <form
                      style={{ marginTop: '40px' }}
                      onSubmit={(e: FormEvent<HTMLFormElement>) => {
                        e.preventDefault();
                        handleSubmitInfluencer();
                      }}
                      acceptCharset="UTF-8"
                      className="influencer-form"
                    >
                      <input
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setName(e.target.value)
                        }
                        value={name}
                        type="text"
                        name="name"
                        required
                        placeholder={tarnslation?.name_pl ?? ''}
                      />
                      <input
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setEmail(e.target.value)
                        }
                        value={email}
                        type="email"
                        name="email"
                        required
                        placeholder={tarnslation?.Email ?? ''}
                      />
                      <input
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setTelephone(e.target.value)
                        }
                        value={telephone}
                        type="tel"
                        name="phone"
                        required
                        placeholder={tarnslation?.phone_pl ?? ''}
                      />
                      <input
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setSocialProfile(e.target.value)
                        }
                        value={socialProfile}
                        type="text"
                        name="social_profile"
                        required
                        placeholder={tarnslation?.sc_tr ?? ''}
                      />
                      <input
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setPassword(e.target.value)
                        }
                        value={password}
                        type="password"
                        name="password"
                        required
                        placeholder={tarnslation?.password ?? ''}
                      />
                      <div className="gap-2.5 self-stretch px-10 py-4 lg:mt-7 mt-4 w-full text-base font-medium text-black border border-solid bg-slate-300 border-slate-300 rounded-[100px] max-md:px-5 max-md:max-w-full">
                        <button type="submit" className="w-full cursor-pointer">
                          {tarnslation?.register}
                        </button>
                      </div>
                    </form>
                  </>
                )
              )}
            </div>

            <div
              className="mt-4 cursor-pointer text-base font-semibold text-center text-white text-opacity-80 lg:mt-4  max-md:max-w-full"
              onClick={() => {
                navigate(`/${lang}/${ROUTES.login[lang as keyof typeof ROUTES.login]}`);
              }}
            >
              <span>{tarnslation?.Hesabınız_var}?</span> {tarnslation?.login}
            </div>
          </div>
        )}
      </div>
      <div className="absolute inset-0 bg-black opacity-50"></div>
    </div>
  );
};

export default Register;
