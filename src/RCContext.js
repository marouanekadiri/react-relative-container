import { createContext, useContext } from "react";

const RCContext = createContext();

export const useRCContext = () => useContext(RCContext);

export const RCContextProvider = RCContext.Provider;
