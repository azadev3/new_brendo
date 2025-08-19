import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { Footer } from '../components/Footer';

const FailPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Header />

      <section className="py-[50px]">
        <div className="w-full min-h-[50vh] flex items-center justify-center bg-white p-4">
          <div className="max-w-md w-full mx-auto text-center space-y-6">
            <div className="flex items-center justify-center w-full aspect-square max-w-[200px] mx-auto">
              {/* Reduced the size of the SVG to make it smaller */}
              <svg
                width="160" // Decreased size
                height="160" // Decreased size
                viewBox="0 0 180 180"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <rect
                  x="0.5"
                  y="0.5"
                  width="179"
                  height="179"
                  rx="89.5"
                  stroke="#FB6D6D"
                />
                <path
                  d="M105 75L75 105"
                  stroke="#FB6D6D"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M75 75L105 105"
                  stroke="#FB6D6D"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="flex items-center justify-center flex-col space-y-5">
              <h1 className="text-2xl font-bold text-black">
                Платеж не прошёл!
              </h1>
              <button
                className="gap-2 border px-[40px] rounded-full text-[#3873C3] border-[#3873C3] py-[16px] flex items-center justify-center"
                onClick={() => navigate('/')}>
                Вернуться на домашнюю страницу
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default FailPage;
