import React, { createContext, useContext, useState } from "react";

const BlurContext = createContext(null);

export function BlurProvider({ children }) {
  const [isBlurred, setIsBlurred] = useState(false);

  return (
    <BlurContext.Provider value={{ isBlurred, setIsBlurred }}>
      {children}
    </BlurContext.Provider>
  );
}

export function useBlur() {
  const ctx = useContext(BlurContext);
  if (!ctx) {
    throw new Error("useBlur must be used within a BlurProvider");
  }
  return ctx;
}

export default BlurContext;
