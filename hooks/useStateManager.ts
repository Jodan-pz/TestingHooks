import { useState, useContext } from "react";
import { ApplicationDataContext } from "./context/ApplicationDataProvider";
import { DataContextStateType, DataContextActionType, DataPolicy } from "./context/dataContext";
import { PluginDataContext } from "./context/PluginDataProvider";
import { useCheckedPromise } from "./useCheckedPromise";

type Arguments<T> = T extends (...args: infer A) => any ? A : never
type TPromise = (...args: any) => any
type PromiseResult<T> = T extends Promise<infer U> ? U : T

interface StateManagerFetch<T> {
    fetch(...args: Arguments<T>): void;
}

interface StateManager<TResult> {
    store: (toStore: TResult) => void;
    merge: (toStore: Partial<TResult>) => void;
    clear: () => void;
    retrieve: () => DataContextStateType<TResult>;
    start: () => void;
    error: (error: any) => void;
}

function promiseWithStateManager<T>(dataPolicy: DataPolicy, sm: StateManager<T>, promise: Promise<T>) {
    let _waiter: number | undefined = undefined

    if (dataPolicy.smartTracking === undefined ||
        (typeof dataPolicy.smartTracking === 'boolean' && dataPolicy.smartTracking)) {
        sm.start();
    } else {
        _waiter = setTimeout((_self: StateManager<T>) => {
            _self.start()
        }, dataPolicy.smartTracking, sm);
    }
    promise
        .then(sm.store)
        .catch((err: any) => {
            if (err instanceof Error) {
                sm.error({ ...err, name: err.name, message: err.message })
            } else
                sm.error(err)
        })
        .finally(() => { _waiter && clearTimeout(_waiter) })
}

export function useStateManager<T extends TPromise, TResult extends PromiseResult<ReturnType<T>>>(key: string, dataPolicy: DataPolicy, promise: T): StateManagerFetch<T> & StateManager<TResult> {
    const stateScope = dataPolicy.scope || 'component'
    const [data, setData] = useState<DataContextStateType<TResult>>({})
    const { contextState, contextStateDispatch } = stateScope === 'plugin' ? useContext(PluginDataContext) : stateScope === 'application' ? useContext(ApplicationDataContext) : {} as any
    const { checkedPromise } = useCheckedPromise()

    const dispatch = (dispatcher: (action: DataContextActionType) => void, preserveValue: boolean, key: string, toStore: any) => {
        if (preserveValue) {
            dispatcher({ key, data: toStore })
        }
        else {
            dispatcher({ key, data: { value: toStore, error: undefined, loading: false } })
        }
    }

    const clear = () => {
        switch (stateScope) {
            case "component":
                setData({})
                break;
            case "plugin":
            case "application":
                dispatch(contextStateDispatch, false, key, undefined)
                break;
        }
    }

    const merge = (toStore: Partial<TResult>) => {
        switch (stateScope) {
            case "component":
                setData(p => ({ ...p, value: { ...p.value, ...toStore } as TResult }))
                break;
            case "plugin":
            case "application":
                dispatch(contextState, false, key, { ...contextState[key]?.value, ...toStore })
                break;
        }
    }

    const store = (toStore: TResult | DataContextStateType<TResult>, preserveValue: boolean = false) => {
        switch (stateScope) {
            case "component":
                if (preserveValue) {
                    setData(p => ({ ...p, ...toStore }))
                } else {
                    setData({ value: toStore as TResult, error: undefined, loading: false })
                }
                break;
            case "plugin":
            case "application":
                dispatch(contextStateDispatch, preserveValue, key, toStore)
                break;
        }
    }

    const retrieve = () => {
        switch (stateScope) {
            case "component":
                return data;
            case "plugin":
            case "application":
                return contextState[key] || {};
        }
    }

    const start = () => store({ loading: true, error: undefined }, true)

    const error = (error: any) => store({ loading: false, error }, true)

    const sm = { store, merge, clear, retrieve, start, error }

    const fetch = (...args: Arguments<TPromise>) => {
        if (typeof promise === 'function')
            promiseWithStateManager(dataPolicy, sm, checkedPromise(promise(...args), false))
        else
            console.error('Bad fetch call, not a function!')
    }

    return { ...sm, fetch };
}