'use client';
import { createContext, useContext, useState } from 'react';

interface LoaderContextProps {
  loading: boolean;
  success: boolean;
  showLoader: () => void;
  hideLoader: (success?: boolean) => void;
}

const LoaderContext = createContext<LoaderContextProps | null>(null);

export function LoaderProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const showLoader = () => {
    setSuccess(false);
    setLoading(true);
  };

  const hideLoader = (successResult = false) => {
    if (successResult) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setLoading(false);
      }, 800);
    } else {
      setLoading(false);
    }
  };

  return (
    <LoaderContext.Provider value={{ loading, success, showLoader, hideLoader }}>
      {children}
    </LoaderContext.Provider>
  );
}

export const useLoader = () => {
  const ctx = useContext(LoaderContext);
  if (!ctx) throw new Error('useLoader must be used inside LoaderProvider');
  return ctx;
};
