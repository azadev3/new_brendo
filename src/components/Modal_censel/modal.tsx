'use client';

import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { ChevronDown, X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import GETRequest, { axiosInstance } from '../../setting/Request';
import { Reasons, TranslationsKeys } from '../../setting/Types';
import toast from 'react-hot-toast';
import ROUTES from '../../setting/routes';
import { useQueryClient } from '@tanstack/react-query';

const validationSchema = Yup.object().shape({
    reason: Yup.string().required('Səbəb seçilməlidir'),
    comment: Yup.string().when('reason', {
        is: 'other',
        then: (schema) =>
            schema
                .required('Qeyd əlavə edilməlidir')
                .max(100, 'Maksimum 100 simvol'),
        otherwise: (schema) => schema.optional(),
    }),
});

// const reasons = [
//     { value: '', label: 'Ləğv etmə səbəbin seç' },
//     { value: 'wrong_order', label: 'Səhv sifariş' },
//     { value: 'long_waiting', label: 'Uzun gözləmə müddəti' },
//     { value: 'changed_mind', label: 'Fikrimi dəyişdim' },
//     { value: 'other', label: 'Digər' },
// ];

interface CancelModalProps {
    onClose: () => void;
}

export default function CancelModal({ onClose }: CancelModalProps) {
    const { lang, slug } = useParams<{
        lang: string;
        page: string;
        slug: string;
    }>();
    const { data: tarnslation } = GETRequest<TranslationsKeys>(
        `/translates`,
        'translates',
        [lang]
    );
    const { data: reasons } = GETRequest<Reasons[]>(`/reasons`, 'reasons', [
        lang,
    ]);
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[51]">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
                >
                    <X className="h-5 w-5" />
                </button>

                <h2 className="text-xl font-semibold text-center mb-2">
                    {tarnslation?.Sifarişin_ləğvi}
                </h2>
                <p className="text-center text-gray-600 text-sm mb-6">
                    {tarnslation?.Sifarişin_ləğvi_desc}
                </p>

                <Formik
                    initialValues={{ reason: '', comment: '' }}
                    validationSchema={validationSchema}
                    onSubmit={async (values) => {
                        const userStr = localStorage.getItem('user-info');
                        if (userStr) {
                            const User = JSON.parse(userStr);

                            axiosInstance
                                .post(
                                    '/cancelOrder',
                                    {
                                        order_id: slug,
                                        cancel_reason: values.reason,
                                        cancel_note: values.comment,
                                    },
                                    {
                                        headers: {
                                            Authorization: `Bearer ${User.token}`,
                                            Accept: 'application/json',
                                        },
                                    }
                                )
                                .then(() => {
                                    toast.success(tarnslation?.success_cancel_toast ?? "");
                                    queryClient.invalidateQueries({
                                        queryKey: ['getOrders'],
                                    });
                                    navigate(
                                        `/${lang}/${
                                            ROUTES.orders[
                                                lang as keyof typeof ROUTES.orders
                                            ]
                                        }`
                                    );
                                })
                                .catch((error) => {
                                    toast.error(tarnslation?.error_msg ?? "");
                                    console.log('error', error);
                                });
                        }

                    }}
                >
                    {({ values, errors, touched }) => (
                        <Form className="space-y-4">
                            <div className="relative">
                                <Field
                                    as="select"
                                    name="reason"
                                    className="w-full p-3 pr-10 border rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#FF3C56]"
                                >
                                    {reasons?.map((reason) => (
                                        <option
                                            key={reason.id}
                                            value={reason.title}
                                        >
                                            {reason.title}
                                        </option>
                                    ))}
                                    <option value={'other'}>
                                        
                                        {tarnslation?.Other}
                                    </option>
                                </Field>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                                {errors.reason && touched.reason && (
                                    <div className="text-red-500 text-sm mt-1">
                                        {errors.reason}
                                    </div>
                                )}
                            </div>

                            {values.reason === 'other' && (
                                <div className="relative">
                                    <Field
                                        as="textarea"
                                        name="comment"
                                        placeholder="Qeydiniz"
                                        className="w-full p-3 border rounded-lg resize-none h-32 focus:outline-none focus:ring-2 focus:ring-[#FF3C56]"
                                        maxLength={100}
                                    />
                                    <div className="absolute right-2 bottom-2 text-sm text-gray-500">
                                        {tarnslation?.max_placeholder}
                                        {100 - (values.comment?.length || 0)}
                                    </div>
                                    {errors.comment && touched.comment && (
                                        <div className="text-red-500 text-sm mt-1">
                                            {errors.comment}
                                        </div>
                                    )}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="w-full bg-[#FF3C56] text-white py-3 rounded-lg hover:bg-[#FF3C56]transition-colors"
                            >
                                {tarnslation?.Sifarişin_ləğvi}
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}
