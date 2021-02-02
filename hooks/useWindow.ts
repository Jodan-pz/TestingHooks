import { ScaledSize, useWindowDimensions } from "react-native";

export type WindowProps = { size: ScaledSize, orientation: 'landscape' | 'portrait' }

export const useWindow = () => {
    const window = useWindowDimensions();
    const ret: WindowProps = { size: window, orientation: window.width > window.height ? 'landscape' : 'portrait' }
    return ret;
}