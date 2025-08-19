import axios from "axios";
import { useState } from "react";
import { baseUrlInf } from "../../../InfluencerBaseURL";

export interface GetPromocodesData {
    id: number,
    title: string,
    is_active: boolean,
    usage_count: number,
    total_earnings: number,
    from_date: string,
    to_date: string,
    status: string,
    is_expired:boolean
}

export const useGetPromocodes = () => {
    const [loadingPromocodes, setLoadingPromocodes] = useState(false);
    const [promocodes, setPromocodes] = useState<GetPromocodesData[]>([]);

    const getPromocodes = async (params?: { type?: string; search?: string }) => {
        const userStr = localStorage.getItem('user-info');
        const user = userStr ? JSON.parse(userStr) : "";
        const token = user?.token;
        setLoadingPromocodes(true);

        try {
            const query = new URLSearchParams();

            if (params?.type) query.append("type", params.type);
            if (params?.search) query.append("search", params.search);

            const res = await axios.get(`${baseUrlInf}/promocodes?${query.toString()}`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            });
            setPromocodes(res.data.data);
        } catch (err) {
            console.error("Promokodlar alınamadı", err);
        } finally {
            setLoadingPromocodes(false);
        }
    };

    return { getPromocodes, loadingPromocodes, promocodes };
};
