import { useCallback } from "react"
import { DataPolicy, DefaultDataPolicy } from "./context/dataContext"
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

export const useData = <K extends keyof ReturnType<typeof useDataLayers>>(name: K, dataPolicy?: DataPolicy) => {
    const dataLayers = useDataLayers()
    const dataLayer = dataLayers[name];
    return memoizeFunctions(dataLayer(dataPolicy || DefaultDataPolicy)) as ReturnType<typeof dataLayer>
}