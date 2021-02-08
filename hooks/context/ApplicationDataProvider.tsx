import React, { createContext, useReducer } from "react";
import { createStateManagerContextReducer, StateManagerDataContextProviderProps, StateManagerContextType } from "./stateManagerDataContext";

export const ApplicationDataContext = createContext<StateManagerContextType>({} as any)

export const ApplicationDataProvider = ({ children, reducer }: StateManagerDataContextProviderProps) => {
    const [state, dispatch] = useReducer(createStateManagerContextReducer(reducer), {});

    return (
        <ApplicationDataContext.Provider value={{ contextState: state, contextStateDispatch: dispatch }}>
            {children}
        </ApplicationDataContext.Provider>
    )
}