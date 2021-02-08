import { useState, useContext } from "react";
import { ApplicationDataContext } from "./context/ApplicationDataProvider";
import { PluginDataContext } from "./context/PluginDataProvider";
import { createStateManagerContextAction, StateManagerContextActionType, StateManagerDataContextStateType, StateManagerDataOptions } from "./context/stateManagerDataContext";
import { PromiseCanceledError, useCheckedPromise } from "./useCheckedPromise";

type Arguments<T> = T extends (...args: infer A) => any ? A : never
type TPromise = (...args: any) => any
type PromiseResult<T> = T extends Promise<infer U> ? U : T

interface StateManagerFetch<T> {
    fetch(...args: Arguments<T>): void;
}

interface StateManager<TResult> {
    key: string;
    store: (toStore: TResult) => void;
    merge: (toStore: Partial<TResult>) => void;
    clear: () => void;
    retrieve: () => StateManagerDataContextStateType<TResult>;
    start: () => void;
    error: (error: any) => void;
}

function promiseWithStateManager<T>(dataPolicy: StateManagerDataOptions, sm: StateManager<T>, promise: Promise<T>) {
    let _waiter: number | undefined = undefined
    const st = dataPolicy.smartTracking === undefined ? true : dataPolicy.smartTracking;
    const _debug = dataPolicy.debug

    if (typeof st === 'boolean') {
        if (st) {
            try {
                sm.start();
            } catch (err: any) {
                if (!PromiseCanceledError.isError(err)) throw err
            }
        }
    } else {
        _waiter = setTimeout((_self: StateManager<T>) => {
            try {
                _self.start()
            } catch (err: any) {
                if (!PromiseCanceledError.isError(err)) throw err
            }
        }, st, sm);
    }

    if (_debug) console.log('=== USE DATA DEBUG: ' + sm.key, 'start')

    promise
        .then(sm.store)
        .catch((err: any) => {
            if (_debug) console.log('=== USE DATA DEBUG: ' + sm.key, 'error: ' + JSON.stringify(err, null, 2))
            if (err instanceof Error) {
                if (!PromiseCanceledError.isError(err))
                    sm.error({ ...err, name: err.name, message: err.message })
            } else
                sm.error(err)
        })
        .finally(() => {
            _waiter && clearTimeout(_waiter)
            if (_debug) console.log('=== USE DATA DEBUG: ' + sm.key, 'end')
        })
}

export function useStateManager<T extends TPromise, TResult extends PromiseResult<ReturnType<T>>>(key: string, dataPolicy: StateManagerDataOptions, promise: T): StateManagerFetch<T> & StateManager<TResult> {
    const [data, setData] = useState<StateManagerDataContextStateType<TResult>>({})
    const { checkedPromise } = useCheckedPromise()
    const { contextState: pluginContextState, contextStateDispatch: pluginContextStateDispatch } = useContext(PluginDataContext)
    const { contextState: appContextState, contextStateDispatch: appContextStateDispatch } = useContext(ApplicationDataContext)
    const stateScope = dataPolicy.scope || 'component'
    const contextStateDispatch = stateScope === 'plugin' ? pluginContextStateDispatch : stateScope === 'application' ? appContextStateDispatch : undefined;
    const contextState = stateScope === 'plugin' ? pluginContextState : stateScope === 'application' ? appContextState : undefined;

    const dispatch = (dispatcher: (action: StateManagerContextActionType) => void, preserveValue: boolean, key: string, toStore: any) => {
        if (preserveValue) {
            dispatcher(createStateManagerContextAction(key, toStore))
        }
        else {
            dispatcher(createStateManagerContextAction(key, { value: toStore, error: undefined, loading: false }))
        }
    }

    const clear = () => {
        switch (stateScope) {
            case "component":
                setData({})
                break;
            case "plugin":
            case "application":
                if (contextStateDispatch) {
                    dispatch(contextStateDispatch, false, key, undefined)
                }
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
                if (contextStateDispatch) {
                    if (contextState)
                        dispatch(contextStateDispatch, false, key, { ...contextState[key]?.value, ...toStore })
                    else
                        dispatch(contextStateDispatch, false, key, { ...toStore })
                }
                break;
        }
    }

    const store = (toStore: TResult | StateManagerDataContextStateType<TResult>, preserveValue: boolean = false) => {
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
                if (contextStateDispatch) {
                    dispatch(contextStateDispatch, preserveValue, key, toStore)
                }
                break;
        }
    }

    const retrieve = () => {
        switch (stateScope) {
            case "component":
                return data;
            case "plugin":
            case "application":
                return contextState ? contextState[key] || {} : {}
        }
    }

    const start = () => store({ loading: true, error: undefined }, true)

    const error = (error: any) => store({ loading: false, error }, true)

    const sm = { key, store, merge, clear, retrieve, start, error }

    const fetch = (...args: Arguments<TPromise>) => {
        if (typeof promise === 'function')
            promiseWithStateManager(dataPolicy, sm, checkedPromise(promise(...args), false))
        else
            console.error('Bad fetch call, not a function!')
    }

    return { ...sm, fetch };
}