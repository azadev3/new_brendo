// import { useQuery } from 'react-query';
// import { axiosInstance } from '../setting/Request';

// const useGetHeader = () => {
//     return useQuery({
//         queryFn: () => getHeader(),
//         queryKey: ['categories'],
//         staleTime: 1000 * 60 * 60,
//     });
// };

// const getHeader = async () => {
//     const res = await axiosInstance.get<any>('/categories', {
//         headers: {
//             'Accept-Language': 'en',
//         },
//     });
//     console.log(res);
//     return res.data;
// };
