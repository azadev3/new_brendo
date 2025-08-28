import React from 'react';
import { axiosInstance } from './setting/Request';
import { TopLine } from './setting/Types';
import { useParams } from 'react-router-dom';
import { useLanguageStore } from './components/Header';
import Loading from './components/Loading';

const TopHeader: React.FC = () => {
  const { lang = 'ru' } = useParams<{ lang: string; page: string }>();
  const { selectedLang: newLang } = useLanguageStore();

  const [loading, setLoading] = React.useState<boolean>(false);
  const [top_line, setData] = React.useState<TopLine | null>(null);
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/top_line', {
        headers: {
          'Accept-Language': newLang || lang,
        },
      });

      if (res.data) {
        setData(res.data);
      }
    } catch (error) {
      console.error('Fetch Error:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, [lang, newLang]);

  const p = 'Original products. Free delivery to your address.';

  if (loading) return <Loading />;

  return (
    <div className="w-full bg-[#3873C3] h-[40px] text-center text-[14px] font-normal text-white flex items-center justify-center">
      {location.pathname.includes('en')
        ? p
        : top_line && top_line?.data && top_line?.data?.title
        ? top_line?.data?.title
        : ''}
    </div>
  );
};

export default TopHeader;
