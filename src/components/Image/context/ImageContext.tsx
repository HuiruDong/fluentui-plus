import React, { createContext, useContext, useMemo } from 'react';
import type { ImageContextValue } from '../types';

const ImageContext = createContext<ImageContextValue | undefined>(undefined);
export interface ImageProviderProps {
  /** 子元素 */
  children: React.ReactNode;
  /** 上下文值 */
  value: ImageContextValue;
}

export const ImageProvider: React.FC<ImageProviderProps> = ({ children, value }) => {
  const contextValue = useMemo(() => value, [value]);
  return <ImageContext.Provider value={contextValue}>{children}</ImageContext.Provider>;
};

export const useImageContext = (): ImageContextValue | undefined => {
  return useContext(ImageContext);
};

export default ImageContext;
