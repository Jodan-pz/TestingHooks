import { useEffect, useRef } from "react";

interface CheckedPromise<T> {
    promise: Promise<T>;
    cancel: () => void;
}

function makeCheckedPromise<T>(promise: Promise<T>, safe?: boolean): CheckedPromise<T> {
    let isCanceled = false;
    const wrappedPromise = new Promise<T>((resolve, reject) => {
        promise
            .then(
                (val: T) => (isCanceled
                    ? safe ? undefined : reject(new Error('promise cancelled!'))
                    : resolve(val))
            )
            .catch(
                error => (isCanceled
                    ? safe ? undefined : reject(new Error('promise cancelled!'))
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