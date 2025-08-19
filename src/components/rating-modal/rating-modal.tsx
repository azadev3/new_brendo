import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Star } from 'lucide-react';
import { useState } from 'react';
import { TranslationsKeys } from '../../setting/Types';
import GETRequest from '../../setting/Request';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const validationSchema = Yup.object().shape({
  rating: Yup.number().required().min(1).max(5),
  review: Yup.string().max(100),
});

export default function RatingModal({
  productId,
  onClose,
}: {
  onClose: () => void;
  productId: number;
}) {
  const [hoveredStar, setHoveredStar] = useState<number>(0);
  const { lang } = useParams<{
    lang: string;
  }>();
  const { data: tarnslation } = GETRequest<TranslationsKeys>(`/translates`, 'translates', [
    lang,
  ]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[51]">
      <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
        {/* Close Button */}
        <button
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
          onClick={() => onClose()}
        >
          ✕
        </button>

        <h2 className="text-2xl font-semibold text-center mb-6">
          {tarnslation?.Məhsulu_dəyərləndir}
        </h2>

        <Formik
          initialValues={{ rating: 0, review: '' }}
          validationSchema={validationSchema}
          onSubmit={async values => {
            const userStr = localStorage.getItem('user-info');

            await axios
              .post(
                'https://admin.brendoo.com/api/comment',
                {
                  product_id: productId,
                  star: values.rating,
                  comment: values.review,
                },
                {
                  headers: {
                    'Content-Type': 'application/json',
                    'Accept-Language': lang,
                    Authorization: userStr ? `Bearer ${JSON.parse(userStr).token}` : '',
                  },
                },
              )
              .then(() => toast.success(tarnslation?.review_success_toast ?? ''))
              .catch(error => {
                console.log(error);
                toast.error(tarnslation?.error_msg ?? '');
              });
          }}
        >
          {({ values, setFieldValue }) => (
            <Form className="space-y-6">
              {/* Star Rating */}
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    onClick={() => setFieldValue('rating', star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= (hoveredStar || values.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>

              {/* Review Text Area */}
              <div className="relative">
                <Field
                  as="textarea"
                  name="review"
                  placeholder="review"
                  className="w-full p-3 border rounded-lg resize-none h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  maxLength={100}
                />
                <div className="absolute right-2 bottom-2 text-sm text-gray-500">
                  {tarnslation?.max_placeholder} {100 - (values.review?.length || 0)}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors"
              >
                {tarnslation?.göndər}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
