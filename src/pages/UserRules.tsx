import Header from '../components/Header';
import { Footer } from '../components/Footer';
import GETRequest from '../setting/Request';
import { Link, useParams } from 'react-router-dom';
import { RulesType, TranslationsKeys } from '../setting/Types';
import Loading from '../components/Loading';
import ROUTES from '../setting/routes';

export default function UserRules() {
    const { lang } = useParams<{ lang: string }>();
    const { data: rule, isLoading: ruleLoading } = GETRequest<RulesType>(
        `/rule`,
        'rule',
        [lang]
    );
    const { data: tarnslation, isLoading: tarnslationLoading } =
        GETRequest<TranslationsKeys>(`/translates`, 'translates', [lang]);
    if (ruleLoading || tarnslationLoading) return <Loading />;
    return (
        <div className="">
            <Header />
            <main className=" lg:mt-[40px]  px-[40px] max-sm:px-4 mb-[100px]  mt-6">
                <div className="">
                    <div className="flex items-center gap-2">
                        <Link
                            to={`/${lang}/${
                                ROUTES.home[lang as keyof typeof ROUTES.product]
                            }`}
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
                        <h6 className="text-nowrap self-stretch my-auto">
                            {rule?.title}{' '}
                        </h6>
                    </div>{' '}
                    <h3 className="text-[40px] font-semibold   max-sm:text-[32px] mt-[28px] mb-[40px]">
                        {rule?.title}{' '}
                    </h3>{' '}
                </div>

                <section
                    className="px-[28px] w-full bg-[#F8F8F8] py-[40px] rounded-[20px]  max-sm:px-4 max-sm:py-5"
                    dangerouslySetInnerHTML={{
                        __html: rule?.description ? rule?.description : '',
                    }}
                ></section>
            </main>
            <Footer />
        </div>
    );
}
