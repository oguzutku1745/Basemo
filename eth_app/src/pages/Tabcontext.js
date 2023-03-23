import { createContext, useContext, useState } from "react";

const TabContext = createContext();

export function useTabContext() {
  return useContext(TabContext);
}

export function TabProvider({ children }) {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <TabContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabContext.Provider>
  );
}