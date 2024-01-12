import React, { createContext, useContext, useState } from 'react';

const GlobalStateContext = createContext();

export const GlobalStateProvider = ({ children }) => {
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);
  const [selectedLockedToken, setSelectedLockedToken] = useState(null);

  return (
    <GlobalStateContext.Provider
      value={{
        isHeaderVisible, setIsHeaderVisible,
        selectedLockedToken, setSelectedLockedToken
      }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (!context) {
    throw new Error('useGlobalState must be used within a GlobalStateProvider');
  }
  return context;
};