//#region State Manager context type & options
export interface StateManagerContextType {
    contextStateDispatch: (action: StateManagerContextActionType) => void
    contextState: StateManagerDataContextState
}

export type StateManagerDataOptions = {
    scope?: 'component' | 'plugin' | 'application',
    smartTracking?: boolean | number,
    debug?: boolean
}

export const StateManagerDefaultDataOptions: StateManagerDataOptions = {
    scope: 'component'
}

//#endregion

//#region State Manager context reducer
export type ReducerType = (state: StateManagerDataContextState, action: any) => any
export type StateManagerDataContextProviderProps = React.PropsWithChildren<{ reducer?: ReducerType }>

export const createStateManagerContextReducer = (customReducer?: (ReducerType | undefined)) => {
    if (!customReducer) return stateManagerDataContextReducer;
    return (state: any, action: any) => {
        let newState = state;
        newState = customReducer(state, action)
        return stateManagerDataContextReducer(newState, action)
    }
}
//#endregion

//#region State Manager context action
const STATE_MANAGER_ACTION_TYPE = '!___STATE_MGR_ACT___!'
export const isStateManagerAction = (action: any): action is StateManagerContextActionType => action.type === STATE_MANAGER_ACTION_TYPE
export interface StateManagerContextActionType {
    type: string,
    payload: {
        key: string,
        data: StateManagerDataContextStateType<any>
    }
}
export const createStateManagerContextAction = (key: string, data: any): StateManagerContextActionType => ({
    type: STATE_MANAGER_ACTION_TYPE,
    payload: {
        key,
        data
    }
})
//#endregion

export interface StateManagerDataContextState {
    [key: string]: StateManagerDataContextStateType<any>
}

export interface StateManagerDataContextStateType<T> {
    value?: T,
    loading?: boolean,
    error?: any
}

export const stateManagerDataContextReducer = (state: StateManagerDataContextState, action: any) => {
    if (isStateManagerAction(action)) {
        const { key, data } = action.payload
        return ({ ...state, [key]: { ...state[key], ...data } })
    }
    return state
}
