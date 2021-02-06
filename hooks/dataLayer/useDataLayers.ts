
import { useBookDataLayer } from "./layers/useBookDataLayer";
import { useProfileDataLayer } from "./layers/useProfileDataLayer";
import { useTestDataLayer } from "./layers/useTestDataLayer";

export const useDataLayers = () => ({
    books: useBookDataLayer,
    test: useTestDataLayer,
    profile: useProfileDataLayer
})