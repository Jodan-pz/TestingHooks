import React, { createContext, useReducer } from "react";
import { dataContextReducer, DataContextType } from "./dataContext";


export const ApplicationDataContext = createContext<DataContextType>({} as any)

export const ApplicationDataProvider = ({ children }: React.PropsWithChildren<any>) => {
    const [state, dispatch] = useReducer(dataContextReducer, {});
    return (
        <ApplicationDataContext.Provider value={{ contextState: state, contextStateDispatch: dispatch }}>
            {children}
        </ApplicationDataContext.Provider>
    )
}