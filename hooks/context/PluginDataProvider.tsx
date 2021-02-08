import React, { createContext, useReducer } from "react";
import { createStateManagerContextReducer, StateManagerDataContextProviderProps, StateManagerContextType, stateManagerDataContextReducer } from "./stateManagerDataContext";

export const PluginDataContext = createContext<StateManagerContextType>({} as any)

export const PluginDataProvider = ({ children, reducer }: StateManagerDataContextProviderProps) => {
    const [state, dispatch] = useReducer(createStateManagerContextReducer(reducer), {});
    return (
        <PluginDataContext.Provider value={{ contextState: state, contextStateDispatch: dispatch }}>
            {children}
        </PluginDataContext.Provider>
    )
}