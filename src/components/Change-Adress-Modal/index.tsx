import { X } from 'lucide-react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import GETRequest, { axiosInstance } from '../../setting/Request';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { TranslationsKeys } from '../../setting/Types';

interface ModalFormProps {
  isOpen: boolean;
  onClose: () => void;
  id: number;
}

interface FormValues {
  address: string;
  additionalInfo: string;
}

const validationSchema = Yup.object({
  address: Yup.string().required(''),
  additionalInfo: Yup.string(),
});

export default function ChageAdressModal({
  isOpen,
  onClose,
  id,
}: ModalFormProps) {
  if (!isOpen) return null;
  const { lang } = useParams<{
    lang: string;
    page: string;
    slug: string;
  }>();
  const { data: tarnslation } = GETRequest<TranslationsKeys>(
    `/translates`,
    'translates',
    [lang]
  );
  const initialValues: FormValues = {
    address: '',
    additionalInfo: '',
  };
  const queryClient = useQueryClient();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-50 w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700">
          <X className="h-5 w-5" />
        </button>

        {/* Title */}
        <h2 className="mb-6 text-xl font-semibold">
          {tarnslation?.Çatdırılma_məlumatları}
        </h2>

        {/* Form */}
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            // onSubmit(values);
            const userStr = localStorage.getItem('user-info');
            if (userStr) {
              const User = JSON.parse(userStr);
              await axiosInstance
                .post(
                  '/changeOrderAddress',
                  {
                    order_id: id,
                    address: values.address,
                    additional_info: values.additionalInfo,
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${User.token}`,
                      Accept: 'application/json',
                    },
                  }
                )
                .then(() => {
                  toast.success('adress sucsesfully updated');
                  onClose();
                  queryClient.invalidateQueries({
                    queryKey: ['getOrderItem'],
                  });
                })
                .catch((error) => {
                  console.log(error);
                  toast.error(tarnslation?.error_msg ?? "");
                  onClose();
                });
            }
            setSubmitting(false);
          }}>
          {({ isSubmitting, errors, touched }) => (
            <Form className="space-y-4">
              <div>
                <label
                  htmlFor="address"
                  className="mb-1 block text-sm font-medium text-gray-700">
                  {tarnslation?.addres_text_t}
                </label>
                <Field
                  id="address"
                  name="address"
                  type="text"
                  className={`w-full rounded-md border px-3 py-2 ${
                    errors.address && touched.address
                      ? 'border-red-500'
                      : 'border-gray-300'
                  }`}
                />
                {errors.address && touched.address && (
                  <div className="mt-1 text-sm text-red-500">
                    {errors.address}
                  </div>
                )}
              </div>

              <div>
                <label
                  htmlFor="additionalInfo"
                  className="mb-1 block text-sm font-medium text-gray-700">
                  {tarnslation?.Additional_information}
                </label>
                <Field
                  id="additionalInfo"
                  name="additionalInfo"
                  as="textarea"
                  rows={3}
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-md bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600 disabled:bg-blue-300">
                {tarnslation?.Confirm_text}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
