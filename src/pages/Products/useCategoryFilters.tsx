// src/hooks/useCategoryFilters.ts
'use client';
import { useEffect, useRef, useState } from 'react';
import axios, { AxiosError } from 'axios';

export interface SubCategoriesThirdCategories {
  id: number;
  title: string | null;
}
export interface SubCategories {
  id: number;
  title: string | null;
  third_categories: SubCategoriesThirdCategories[];
}
export interface NewFilterOptions {
  id: number;
  title: string | null;
  color_code: string | null;
}
export interface NewFilters {
  id: number;
  title: string | null;
  options: NewFilterOptions[];
}
export interface NewFiltersInterface {
  id: number;
  title: string;
  image: string;
  filters: NewFilters[];
  subCategories: SubCategories[];
}

type State = {
  data: NewFiltersInterface | null;
  loading: boolean;
  error: string | null;
};

// Basit in-memory cache (kategori-id -> data)
const cache = new Map<string, NewFiltersInterface>();

export function useCategoryFilters(params: {
  category: string | null;
  lang: string;
  token?: string;
}) {
  const { category, lang, token } = params;
  const [state, setState] = useState<State>({ data: null, loading: false, error: null });
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // category yoksa hiç çağrı yapma; state’i sıfırla
    if (!category) {
      setState({ data: null, loading: false, error: null });
      return;
    }

    // Cache varsa direkt göster ve arka planda tazele (isteğe bağlı)
    const cacheKey = `${lang}:${category}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      setState({ data: cached, loading: false, error: null });
    } else {
      setState(prev => ({ ...prev, loading: true, error: null }));
    }

    // Mevcut isteği iptal et
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    (async () => {
      try {
        const res = await axios.get<NewFiltersInterface>(
          `https://admin.brendoo.com/api/category/${category}/get-filters`,
          {
            headers: {
              'Accept-Language': lang,
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            signal: controller.signal,
          },
        );
        cache.set(cacheKey, res.data);
        setState({ data: res.data, loading: false, error: null });
      } catch (err) {
        if (axios.isCancel(err)) return;
        const e = err as AxiosError;
        setState({
          data: cached ?? null,
          loading: false,
          error: e.message || 'Filtreler yüklenemedi.',
        });
      }
    })();

    return () => {
      controller.abort();
    };
  }, [category, lang, token]);

  return state; // { data, loading, error }
}
