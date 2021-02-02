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
    store: (toStore: any) => void;
    retrieve: () => DataContextStateType<TResult>;
    start: () => void;
    error: (error: any) => void;
}

function promiseWithStateManager<T>(sm: StateManager<T>, promise: Promise<T>) {
    sm.start();
    promise
        .then(sm.store)
        .catch((err: any) => {
            if (err instanceof Error) {
                sm.error({ ...err, name: err.name, message: err.message })
            } else
                sm.error(err)
        })
}

export function useStateManager<T extends TPromise>(key: string, dataPolicy: DataPolicy, promise: T): StateManagerFetch<T> & StateManager<PromiseResult<ReturnType<T>>> {
    const [data, setData] = useState<DataContextStateType<any>>({})
    const { contextState: pluginState, contextStateDispatch: pluginStateDispatch } = useContext(PluginDataContext)
    const { contextState: applicationState, contextStateDispatch: applicationStateDispatch } = useContext(ApplicationDataContext)
    const { checkedPromise } = useCheckedPromise()

    const store = (toStore: DataContextStateType<any>, preserveValue: boolean = false) => {
        const dispatch = (dispatcher: (action: DataContextActionType) => void, preserveValue: boolean, key: string, toStore: any) => {
            if (preserveValue) {
                dispatcher({ key, data: toStore })
            }
            else {
                dispatcher({ key, data: { value: toStore, error: undefined, loading: false } })
            }
        }
        switch (dataPolicy.scope) {
            case "component":
                if (preserveValue) {
                    setData(p => ({ ...p, ...toStore }))
                } else {
                    setData({ value: toStore, error: undefined, loading: false })
                }
                break;
            case "plugin":
                dispatch(pluginStateDispatch, preserveValue, key, toStore)
                break;
            case "application":
                dispatch(applicationStateDispatch, preserveValue, key, toStore)
                break;
        }
    }

    const retrieve = () => {
        switch (dataPolicy.scope) {
            case "component":
                return data;
            case "plugin":
                return pluginState[key];
            case "application":
                return applicationState[key];
        }
    }

    const start = () => store({ loading: true, error: undefined }, true)

    const error = (error: any) => store({ loading: false, error }, true)

    const sm = { store, retrieve, start, error }

    const fetch = (...args: Arguments<TPromise>) => {
        if (typeof promise === 'function')
            promiseWithStateManager(sm, checkedPromise(promise(...args), false))
        else
            console.error('Bad fetch call, not a function!')
    }
    return { ...sm, fetch };
}