import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';

const STORAGE_KEY = 'search_history';
const MAX_HISTORY_ITEMS = 10;

export interface SearchHistoryItem {
  query: string;
  timestamp: number;
}

export const useSearchHistory = () => {
  const { data: session, status } = useSession();
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load search history from localStorage or API
  useEffect(() => {
    const loadHistory = async () => {
      setIsLoading(true);
      try {
        if (status === 'authenticated') {
          // Load from API for authenticated users
          const response = await fetch('/api/search-history');
          if (response.ok) {
            const data = await response.json();
            setHistory(data.history || []);
          } else {
            // Fallback to localStorage if API fails
            loadFromLocalStorage();
          }
        } else {
          // Load from localStorage for guests
          loadFromLocalStorage();
        }
      } catch (error) {
        console.error('Error loading search history:', error);
        loadFromLocalStorage();
      } finally {
        setIsLoading(false);
      }
    };

    if (status !== 'loading') {
      loadHistory();
    }
  }, [status]);

  const loadFromLocalStorage = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setHistory(parsed);
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
  };

  const saveToLocalStorage = (newHistory: SearchHistoryItem[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  const addSearch = useCallback(async (query: string) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    const newItem: SearchHistoryItem = {
      query: trimmedQuery,
      timestamp: Date.now(),
    };

    // Remove duplicate if exists and add new item at the beginning
    const filteredHistory = history.filter(
      (item) => item.query.toLowerCase() !== trimmedQuery.toLowerCase()
    );
    const newHistory = [newItem, ...filteredHistory].slice(0, MAX_HISTORY_ITEMS);

    setHistory(newHistory);
    saveToLocalStorage(newHistory);

    // Save to API if authenticated
    if (status === 'authenticated') {
      try {
        await fetch('/api/search-history', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: trimmedQuery }),
        });
      } catch (error) {
        console.error('Error saving search to API:', error);
      }
    }
  }, [history, status]);

  const removeSearch = useCallback(async (query: string) => {
    const newHistory = history.filter((item) => item.query !== query);
    setHistory(newHistory);
    saveToLocalStorage(newHistory);

    // Remove from API if authenticated
    if (status === 'authenticated') {
      try {
        await fetch('/api/search-history', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query }),
        });
      } catch (error) {
        console.error('Error removing search from API:', error);
      }
    }
  }, [history, status]);

  const clearHistory = useCallback(async () => {
    setHistory([]);
    saveToLocalStorage([]);

    // Clear from API if authenticated
    if (status === 'authenticated') {
      try {
        await fetch('/api/search-history', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ clearAll: true }),
        });
      } catch (error) {
        console.error('Error clearing search history from API:', error);
      }
    }
  }, [status]);

  return {
    history,
    isLoading,
    addSearch,
    removeSearch,
    clearHistory,
  };
};
