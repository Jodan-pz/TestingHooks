import React, { createContext, useReducer } from "react";
import { dataContextReducer, DataContextType } from "./dataContext";

export const PluginDataContext = createContext<DataContextType>({} as any)

export const PluginDataProvider = ({ children }: React.PropsWithChildren<any>) => {
    const [state, dispatch] = useReducer(dataContextReducer, {});
    return (
        <PluginDataContext.Provider value={{ contextState: state, contextStateDispatch: dispatch }}>
            {children}
        </PluginDataContext.Provider>
    )
}