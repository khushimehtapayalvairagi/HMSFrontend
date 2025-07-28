// AdmissionAdviceContext.js
import React, { createContext, useContext, useState } from 'react';

const AdmissionAdviceContext = createContext();

export const useAdmissionAdvice = () => useContext(AdmissionAdviceContext);

export const AdmissionAdviceProvider = ({ children }) => {
  const [adviceData, setAdviceData] = useState(null);

  return (
    <AdmissionAdviceContext.Provider value={{ adviceData, setAdviceData }}>
      {children}
    </AdmissionAdviceContext.Provider>
  );
};
