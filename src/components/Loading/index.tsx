import { useParams } from 'react-router-dom';
import axios from 'axios';
import React, { useState, useEffect, useMemo } from 'react';

// Simple in-memory cache
let simpleCache: Record<string, Record<string, string>> = {};

// Ultra fast hook - minimum logic
export const useQuickTranslations = (lang: string = 'ru') => {
  const [translations, setTranslations] = useState<Record<string, string>>(() => {
    return simpleCache[lang] || {};
  });

  useEffect(() => {
    if (simpleCache[lang]) {
      setTranslations(simpleCache[lang]);
      return;
    }

    const loadTranslations = async () => {
      try {
        const response = await axios.get('https://admin.brendoo.com/api/translates', {
          headers: { 'Accept-Language': lang },
          timeout: 3000,
        });

        if (response.data) {
          simpleCache[lang] = response.data;
          setTranslations(response.data);
        }
      } catch (error) {
        console.warn(`Translation load failed for ${lang}`);
      }
    };

    loadTranslations();
  }, [lang]);

  return translations;
};

// Ultra fast loading component
const Loading: React.FC = () => {
  const { lang = 'ru' } = useParams<{ lang: string }>();
  const translations = useQuickTranslations(lang);

  const loadingText = useMemo(() => {
    return translations['loading_main_key'] || 'Yüklənir...';
  }, [translations]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100 z-50">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
        <div className="text-lg font-medium text-gray-700">{loadingText}</div>
      </div>
    </div>
  );
};

// Inline loading - page içinde
export const LoadingNoFix: React.FC = () => {
  return (
    <section className="dots-container-mmm">
      <div className="dot-mmm-key-vl"></div>
      <div className="dot-mmm-key-vl"></div>
      <div className="dot-mmm-key-vl"></div>
      <div className="dot-mmm-key-vl"></div>
      <div className="dot-mmm-key-vl"></div>
    </section>
  );
};

// Instant loading - hiç API beklemez
export const InstantLoading: React.FC<{ lang?: string }> = ({ lang = 'ru' }) => {
  const translations = useQuickTranslations(lang);
  const loadingText = translations['loading_main_key'] || 'Yüklənir...';

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-50 z-50">
      <div className="flex flex-col items-center space-y-3">
        <div className="w-14 h-14 border-3 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        <div className="text-lg font-medium text-gray-600">{loadingText}</div>
      </div>
    </div>
  );
};

// Micro loading - küçük spinner
export const MicroLoading: React.FC = () => (
  <div className="flex items-center justify-center p-4">
    <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
  </div>
);

// Button loading
export const ButtonLoading: React.FC<{ text?: string }> = ({ text }) => {
  const { lang = 'ru' } = useParams<{ lang: string }>();
  const translations = useQuickTranslations(lang);
  const loadingText = text || translations['loading_main_key'] || 'Yüklənir...';

  return (
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      <span>{loadingText}</span>
    </div>
  );
};

// Skeleton box
export const SkeletonBox: React.FC<{
  width?: string;
  height?: string;
  className?: string;
}> = ({ width = 'w-full', height = 'h-4', className = '' }) => (
  <div className={`bg-gray-200 rounded animate-pulse ${width} ${height} ${className}`} />
);

// Preload popular languages in background
const preloadPopularLanguages = () => {
  const popularLangs = ['ru', 'az', 'en'];

  popularLangs.forEach(async lang => {
    if (simpleCache[lang]) return;

    try {
      const response = await axios.get('https://admin.brendoo.com/api/translates', {
        headers: { 'Accept-Language': lang },
        timeout: 5000,
      });

      if (response.data) simpleCache[lang] = response.data;
    } catch {
      console.warn(`Preload failed for ${lang}`);
    }
  });
};

if (typeof window !== 'undefined') {
  setTimeout(preloadPopularLanguages, 1000);
}

// Component display names
Loading.displayName = 'Loading';
LoadingNoFix.displayName = 'LoadingNoFix';
InstantLoading.displayName = 'InstantLoading';
MicroLoading.displayName = 'MicroLoading';
ButtonLoading.displayName = 'ButtonLoading';

export default Loading;
