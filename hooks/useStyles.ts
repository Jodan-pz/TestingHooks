import { StyleSheet, ScaledSize, Dimensions } from "react-native"
import * as React from 'react';
import useColorScheme from "./useColorScheme";
import Colors from "../constants/Colors";
import { useWindow } from "./useWindow";
import { ApplicationDataContext } from "./context/ApplicationDataProvider";
import { PluginDataContext } from "./context/PluginDataProvider";

export type StyleOptions = {
    size: ScaledSize,
    theme: "light" | "dark",
    colors: typeof Colors,
    orientation: 'landscape' | 'portrait'
}

export function useStyles<TStyle>(styleBuilder: (options: StyleOptions) => TStyle): { style: TStyle, getStyleByName: ((text: string) => string) };
export function useStyles<TStyle>(styleBuilder: (options: StyleOptions) => StyleSheet.NamedStyles<TStyle>) {
    const window = useWindow();
    const appContext = React.useContext(PluginDataContext)
    const theme = useColorScheme();

    const profileColors = {} as typeof Colors;

    const styleOptions: StyleOptions = {
        ...window,
        theme: theme,
        colors: profileColors
    }
    const style = React.useMemo(() => styleBuilder(styleOptions), [window.orientation, theme]);
    return ({
        style,
        getStyleByName: (text: string): any => style && (<any>style)[text]
    })
}

export const createStyleBuilder = <TStyle>(cb: (op: StyleOptions) => StyleSheet.NamedStyles<TStyle>) => cb
export const createObjectStyleBuilder = <TStyle>(cb: (op: StyleOptions) => TStyle) => cb;
