export type DataPolicy = {
    scope: 'application' | 'component' | 'plugin'
}

export const DefaultDataPolicy: DataPolicy = {
    scope: 'component'
}

export interface DataContextActionType {
    key: string,
    data: DataContextStateType<any>
}

export interface DataContextState {
    [key: string]: DataContextStateType<any>
}

export interface DataContextType {
    contextStateDispatch: (action: DataContextActionType) => void
    contextState: DataContextState
}

export interface DataContextStateType<T> {
    value?: T,
    loading?: boolean,
    error?: any
}

export const dataContextReducer = (state: DataContextState, { key, data }: DataContextActionType) => {
    return ({ ...state, [key]: { ...state[key], ...data } })
}
