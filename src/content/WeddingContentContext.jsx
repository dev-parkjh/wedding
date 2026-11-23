import React, { createContext, useContext } from 'react';

const WeddingContext = createContext(null);

export function WeddingContentProvider({ wedding, children }) {
  return <WeddingContext.Provider value={wedding}>{children}</WeddingContext.Provider>;
}

export function useWedding() {
  return useContext(WeddingContext);
}
