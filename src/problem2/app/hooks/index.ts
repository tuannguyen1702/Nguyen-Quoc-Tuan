import { useState, useEffect } from 'react';

/**
 * Custom hook to check if a media query matches.
 * @param {string} query - The media query string to match.
 * @returns {boolean} - Whether the media query matches or not.
 */
const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);

    const updateMatch = () => setMatches(mediaQueryList.matches);
    updateMatch(); // Set the initial state.

    mediaQueryList.addEventListener('change', updateMatch);

    return () => {
      mediaQueryList.removeEventListener('change', updateMatch);
    };
  }, [query]);

  return matches;
};

export default useMediaQuery;
