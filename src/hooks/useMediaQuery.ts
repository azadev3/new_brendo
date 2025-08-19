import { useEffect, useState } from 'react';

export const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);

    const updateMatched = () => {
      setMatches(media.matches);
    };

    updateMatched();

    media.addEventListener('change', updateMatched);

    return () => {
      media.removeEventListener('change', updateMatched);
    };
  }, [query]);
  return matches;
};
