import axios from 'axios';
import { baseUrlInf } from '../../../InfluencerBaseURL';
import toast from 'react-hot-toast';

export type RemoveCollectionBody = {
  product_id: number;
  collection_id: number;
};

export const removeFromCollection = async (
  data: RemoveCollectionBody,
  getInnerCollection: (param: number) => Promise<void>,
  msg: any
) => {
  const userStr = localStorage.getItem('user-info');
  const user = userStr ? JSON.parse(userStr) : '';
  const token = user?.token;

  try {
    const res = await axios.post(`${baseUrlInf}/collection/remove/product`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.data) {
      toast.success(msg);
      getInnerCollection(data?.collection_id);
    } else {
      console.log(res.status);
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error?.response?.data?.message) {
        toast.error(error?.response?.data?.message ?? '');
      }
    }
    console.log(error);
  }
};
