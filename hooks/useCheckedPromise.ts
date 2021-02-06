import { useEffect, useRef } from "react";

interface CheckedPromise<T> {
    promise: Promise<T>;
    cancel: () => void;
}

export class PromiseCanceledError extends Error {
    protected isPromiseCanceledError = true;
    constructor(message?: string) {
        super(message)
    }
    static isError(obj: any): obj is PromiseCanceledError {
        return (obj as PromiseCanceledError).isPromiseCanceledError;
    }
}

function makeCheckedPromise<T>(promise: Promise<T>, safe?: boolean): CheckedPromise<T> {
    let isCanceled = false;
    const wrappedPromise = new Promise<T>((resolve, reject) => {
        promise
            .then(
                (val: T) => (isCanceled
                    ? safe ? undefined : reject(new PromiseCanceledError('Promise cancelled!'))
                    : resolve(val))
            )
            .catch(
                error => (isCanceled
                    ? safe ? undefined : reject(new PromiseCanceledError(error))
                    : safe ? undefined : reject(error))
            );
    });
    return {
        promise: wrappedPromise,
        cancel() {
            isCanceled = true;
        },
    };
}

export const useCheckedPromise = () => {
    const promises = useRef<CheckedPromise<any>[]>([]);
    useEffect(() => {
        promises.current = promises.current || [];
        return () => {
            promises.current.forEach(p => p.cancel());
            promises.current = [];
        };
    }, []);

    function checkedPromise(p: Promise<any>, safe: boolean = true) {
        const cPromise = makeCheckedPromise(p, safe);
        promises.current.push(cPromise);
        return cPromise.promise;
    }

    return { checkedPromise };
}