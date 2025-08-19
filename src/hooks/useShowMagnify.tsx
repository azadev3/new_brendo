import { createContext, useContext, useState, ReactNode } from 'react';

interface MagnifierContextType {
  x: number;
  y: number;
  setXY: (xy: [number, number]) => void;
  showMagnifier: boolean;
  setShowMagnifier: (show: boolean) => void;
  Img_url: string;
  setImg_url: (show: string) => void;
}

const MagnifierContext = createContext<MagnifierContextType | undefined>(
  undefined
);

export const MagnifierProvider = ({ children }: { children: ReactNode }) => {
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [Img_url, setImg_url] = useState('');
  const [[x, y], setXY] = useState([0, 0]);

  return (
    <MagnifierContext.Provider
      value={{
        x,
        y,
        setXY,
        showMagnifier,
        setShowMagnifier,
        Img_url,
        setImg_url,
      }}>
      {children}
    </MagnifierContext.Provider>
  );
};

export const useShowMagnify = (): MagnifierContextType => {
  const context = useContext(MagnifierContext);
  if (context === undefined) {
    throw new Error('useShowMagnify must be used within a MagnifierProvider');
  }
  return context;
};
