import { useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import GETRequest from '../../setting/Request';
import { TranslationsKeys } from '../../setting/Types';
import ROUTES from '../../setting/routes';

export default function ResetPasswordConfrim() {
  const { lang, slug } = useParams<{
    lang: string;
    page: string;
    slug: string;
  }>();
  const { data: tarnslation } = GETRequest<TranslationsKeys>(
    `/translates`,
    'translates',
    [lang],
  );

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  // const [showPassword, setShowPassword] = useState(false);
  const [formStatus, setFormStatus] = useState<{
    message: string;
    success: boolean;
  } | null>(null);

  const initialValues = {
    password: '',
    password2: '',
  };

  const validationSchema = Yup.object({
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required(tarnslation?.is_r_14 ?? ''),
    password2: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required(tarnslation?.is_r_14 ?? ''),
  });

  const handleSubmit = async (values: { password: string; password2: string }) => {
    setLoading(true);
    setFormStatus(null); // Reset status message
    const Email = localStorage.getItem('EmailForReset');
    await axios
      .post('https://admin.brendoo.com/api/password-reset/reset', {
        email: Email,
        reset_token: slug,
        new_password: values.password,
        new_password_confirmation: values.password2,
      })
      .then(response => {
        localStorage.setItem('user-info', JSON.stringify(response));
        toast.success('Password sucsesfully reset ');
        //add token to local
        navigate(`/${lang}/${ROUTES.login[lang as keyof typeof ROUTES.login]}`);
      })
      .catch(error => {
        console.log(error);
        toast.error('Error while logging in');
      });
  };

  return (
    <div className="flex overflow-hidden flex-col bg-white">
      <div className="flex relative flex-col w-full h-[100vh] max-md:max-w-full justify-center items-center px-[40px] max-sm:px-4">
        <img
          loading="lazy"
          srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/9f57b393c120b19ab9db1e7a4aa3dc11e48fdaa0526b775a0fd5a02c9292e45c?placeholderIfAbsent=true&apiKey=2d5d82cf417847beb8cd2fbbc5e3c099"
          className="object-cover absolute inset-0 size-full"
        />
        <div
          onClick={() => navigate(-1)}
          className="rounded-full bg-white lg:w-[56px] lg:h-[56px] w-[35px] h-[35px] bg-opacity-60 z-50 absolute top-5 left-5 cursor-pointer"
        >
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/d1d01662ce302f4f64e209cc8ecd0540b6f0e5fb3d4ccd79eead1b316a272d11?placeholderIfAbsent=true&apiKey=2d5d82cf417847beb8cd2fbbc5e3c099"
            className="object-contain w-14 aspect-square rounded-full"
          />
        </div>

        <div className="flex overflow-hidden z-[50] relative flex-col justify-center self-center p-[60px]  max-w-full rounded-3xl bg-white bg-opacity-20 w-[560px] max-md:px-5  max-sm:py-[28px]">
          <div className="flex flex-col max-md:max-w-full">
            <div className="flex flex-col items-center self-center text-center">
              <div className="text-3xl font-bold text-white">Password recovery</div>
            </div>
            <div className="flex flex-col items-center lg:mt-10 mt-4 w-full max-md:max-w-full">
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {() => (
                  <Form className="flex flex-col self-stretch mt-7 w-full max-md:max-w-full">
                    <div className="flex flex-col w-full max-md:max-w-full">
                      <div className="overflow-hidden px-5  flex justify-center items-center w-full h-[56px] text-base bg-white border border-solid border-black border-opacity-10 rounded-full text-black text-opacity-60 max-md:max-w-full">
                        <Field
                          type="password"
                          name="password"
                          placeholder={tarnslation?.password ?? ''}
                          className="w-full bg-transparent outline-none"
                        />
                      </div>
                      <ErrorMessage
                        name="password"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                      <div className="flex flex-col mt-3 w-full max-md:max-w-full">
                        <div className="flex overflow-hidden gap-5 justify-between px-5  w-full h-[56px] text-base bg-white border border-solid border-black border-opacity-10 rounded-full text-black text-opacity-60 max-md:max-w-full">
                          <Field
                            type={'password'}
                            name="password2"
                            placeholder={'password confrim'}
                            className="w-full bg-transparent outline-none"
                          />
                          {/* <img
                                                        loading="lazy"
                                                        src={
                                                            !showPassword
                                                                ? 'https://cdn.builder.io/api/v1/image/assets/TEMP/cc75299a447e1f2b81cfaeb2821950c885d45d255e50ae73ad2684fcd9aa2110?placeholderIfAbsent=true&apiKey=2d5d82cf417847beb8cd2fbbc5e3c099'
                                                                : '/svg/closedaye.svg'
                                                        }
                                                        className="object-contain shrink-0 w-6 aspect-square cursor-pointer"
                                                        onClick={() =>
                                                            setShowPassword(
                                                                !showPassword
                                                            )
                                                        }
                                                    /> */}
                        </div>
                        <ErrorMessage
                          name="password2"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className={`gap-2.5 self-stretch px-10 py-4 mt-7 w-full text-base font-medium text-black border border-solid ${
                        loading ? 'bg-gray-400' : 'bg-slate-300'
                      } border-slate-300 rounded-full max-md:px-5 max-md:max-w-full`}
                    >
                      {loading
                        ? tarnslation?.loading_main_key
                        : tarnslation?.passwordReset}
                    </button>
                  </Form>
                )}
              </Formik>

              {formStatus && (
                <div
                  className={`mt-4 text-sm text-center ${
                    formStatus.success ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {formStatus.message}
                </div>
              )}
            </div>
          </div>
          {/* <div className="absolute inset-0 bg-black opacity-50 "></div> */}
        </div>
      </div>
    </div>
  );
}
