import { useCallback } from "react"
import { StateManagerDataOptions, StateManagerDefaultDataOptions } from "./context/stateManagerDataContext"
import { useDataLayers } from "./dataLayer/useDataLayers"

function memoizeFunctions<T>(obj: T): T {
    return Object.keys(obj).reduce((acc: any, name) => {
        var dest = (obj as any)[name]
        if (typeof dest === 'function') {
            acc[name] = useCallback(dest, [])
        } else {
            acc[name] = dest
        }
        return acc
    }, {})
}

export const useData = <K extends keyof ReturnType<typeof useDataLayers>>(name: K, dataPolicy?: StateManagerDataOptions) => {
    const dataLayers = useDataLayers()
    const dataLayer = dataLayers[name];
    return memoizeFunctions(dataLayer(dataPolicy || StateManagerDefaultDataOptions)) as ReturnType<typeof dataLayer>
}