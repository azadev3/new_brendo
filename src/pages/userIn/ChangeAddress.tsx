import React, { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import GETRequest from "../../setting/Request";
import { TranslationsKeys } from "../../setting/Types";
import Header from "../../components/Header";
import UserAside from "../../components/userAside";
import axios from "axios";
import toast from "react-hot-toast";
import SearchableSelect from "../../components/Basked/SearchableSelect";
import SearchableSelectCity from "../../components/Basked/SearchableSelectCity";

type Region = { id: number; regionId: number; regionName: string };
type City   = { id: number; cityId: number; cityName: string };

const ChangeAddress: React.FC = () => {
  const { lang = "ru" } = useParams<{ lang: string }>();

  const { data: translation } = GETRequest<TranslationsKeys>(
    "/translates",
    "translates",
    [lang]
  );

  // localStorage yalnız ilk renderdə oxunur
  const [parsedInfo] = useState(() => {
    try {
      const raw = localStorage.getItem("user-info");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const token: string | null = parsedInfo?.token ?? null;
  const rawCustomer: any = parsedInfo?.customer ?? null;
  const userRegionId=rawCustomer.region_id
  const userCityId=rawCustomer.city_id


  const getAddressValue = (address: any) => {
    if (!address) return "";
    if (typeof address === "string") return address;
    if (typeof address === "object" && typeof address.address === "string") {
      return address.address;
    }
    return "";
  };

  // İlkin dəyərlər: varsa göstər, yoxdursa boş/none
  const [newAddress, setNewAddress] = useState<string>(() => getAddressValue(rawCustomer?.address));
  const [regionId, setRegionId] = useState<number | null>(userRegionId);
  const [selectedCity, setSelectedCity] = useState<number | null>(userCityId);

  const [regionData, setRegionData] = useState<Region[]>([]);
  const [cityData, setCityData] = useState<City[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // İlk yükləmədə yalnız bir dəfə auto-select etmək üçün bayraqlar
  const didInitRegionRef = useRef(false);
  const didInitCityRef = useRef(false);

  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

  const getRegions = async () => {
    try {
      const res = await axios.get("https://admin.brendoo.com/api/regions", {
        headers: { "Accept-Language": lang, ...authHeader },
      });
      if (res.data) {
        // Backend fərqli açarlarla gələ bilər, normallaşdıraq
        const normalized: Region[] = (res.data || []).map((r: any) => ({
          id: Number(r.id ?? r.regionId),
          regionId: Number(r.regionId ?? r.id),
          regionName: r.regionName ?? r.name ?? "",
        }));
        setRegionData(normalized);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getCities = async (rid: number) => {
    try {
      const res = await axios.get(`https://admin.brendoo.com/api/cities/${rid}`, {
        headers: { "Accept-Language": lang, ...authHeader },
      });
      if (res.data) {
        const normalized: City[] = (res.data || []).map((c: any) => ({
          id: Number(c.id ?? c.cityId),
          cityId: Number(c.cityId ?? c.id),
          cityName: c.cityName ?? c.name ?? "",
        }));
        setCityData(normalized);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 1) regionları yüklə
  useEffect(() => {
    getRegions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2) regionData gəldisə və customer.region_id varsa, BİR DƏFƏ set et
  useEffect(() => {
    if (didInitRegionRef.current) return;
    if (!regionData.length) return;

    const ridRaw = rawCustomer?.region_id;
    if (ridRaw === undefined || ridRaw === null || ridRaw === "") return;

    const rid = Number(ridRaw);
    const exists = regionData.some((r) => r.id === rid);
    if (exists) {
      setRegionId(rid);
    }
    didInitRegionRef.current = true;
  }, [regionData, rawCustomer?.region_id]);

  // 3) regionId dəyişəndə şəhərləri çək / sıfırla
  useEffect(() => {
    if (regionId !== null) {
      getCities(regionId);
    } else {
      setCityData([]);
      setSelectedCity(null);
      didInitCityRef.current = false; // region dəyişibsə, city auto-select yenidən mümkün olsun
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [regionId]);

  // 4) cityData gəldikdə customer.city_id varsa, BİR DƏFƏ set et
  useEffect(() => {
    if (didInitCityRef.current) return;
    if (!cityData.length) return;

    const cidRaw = rawCustomer?.city_id;
    if (cidRaw === undefined || cidRaw === null || cidRaw === "") return;

    const cid = Number(cidRaw);
    const exists = cityData.some((c) => c.id === cid);
    if (exists) {
      setSelectedCity(cid);
    }
    didInitCityRef.current = true;
  }, [cityData, rawCustomer?.city_id]);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const data: Record<string, any> = {};
      if (newAddress) data.address = newAddress;
      if (regionId !== null) data.region_id = regionId;
      if (selectedCity !== null) data.city_id = selectedCity;

      const res = await axios.post(
        "https://admin.brendoo.com/api/storeOrUpdate",
        data,
        { headers: { ...authHeader } }
      );

      if (res.data) {
        toast.success(translation?.updated || "Updated");

        const updatedCustomer = {
          ...rawCustomer,
          ...(newAddress && { address: newAddress }),
          ...(regionId !== null && { region_id: regionId }),
          ...(selectedCity !== null && { city_id: selectedCity }),
        };

        const updatedInfo = {
          ...parsedInfo,
          customer: updatedCustomer,
        };

        localStorage.setItem("user-info", JSON.stringify(updatedInfo));
      }
    } catch (error) {
      toast.error("Error");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <main className="flex flex-row max-sm:flex-col w-full gap-5 p-4">
        <UserAside active={10} />
        <div className="w-full rounded-[20px] bg-[#F8F8F8] lg:p-[40px] px-2 py-10">
          <div className="flex flex-row flex-wrap justify-between mb-6">
            <h1 className="text-[28px] font-semibold">
              {translation?.user_address || "Address"}
            </h1>
          </div>

          <form
            onSubmit={(e: FormEvent<HTMLFormElement>) => {
              e.preventDefault();
              handleUpdate();
            }}
            className="user-info-address"
          >
            {/* Region: varsa seçili göstər, yoxdursa boş */}
            <SearchableSelect
              regionData={regionData}
              value={regionId ?? undefined}
              onChange={(selectedRegionId: number | string) => {
                const rid = Number(selectedRegionId);
                setRegionId(Number.isFinite(rid) ? rid : null);
                setSelectedCity(null); // region dəyişəndə city sıfırlansın
              }}
            />

            {/* City: regionId dəyişəndə remount (key), varsa seçili göstər */}
            <SearchableSelectCity
              key={regionId ?? "no-region"}
              cityData={cityData}
              value={selectedCity ?? undefined}
              onChange={(selectedCityId: number | string) => {
                const cid = Number(selectedCityId);
                setSelectedCity(Number.isFinite(cid) ? cid : null);
              }}
            />

            {/* Address: varsa dəyər göstər, yoxdursa boş input */}
            <input
              name="address"
              required
              type="text"
              value={newAddress}
              className="mt-3"
              placeholder={translation?.user_address || ""}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setNewAddress(e.target.value)
              }
            />

            <button type="submit" disabled={loading}>
              {loading
                ? translation?.please_wait || "Please wait..."
                : translation?.update_address || "Update address"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ChangeAddress;
