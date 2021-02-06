import { StyleSheet } from "react-native"
import * as React from 'react';
import useColorScheme from "./useColorScheme";
import Colors from "../constants/Colors";
import { useData } from "./useData";

export type StyleOptions = {
    theme: "light" | "dark",
    colors: typeof Colors['light'],
}

type StyleBuilderType<TStyle> = (options: StyleOptions) => StyleSheet.NamedStyles<TStyle>;
type StyleObjctBuilderType<TStyle> = (options: StyleOptions) => TStyle;

type GetStyleByName = {
    getStyleByName: (text: string) => any
}

type UseStylesResultType<TStyle, TObjectStyle> = {
    styles: Array<{ style: ReturnType<StyleBuilderType<TStyle>> } & GetStyleByName>,
    objectStyles: Array<{ style: ReturnType<StyleObjctBuilderType<TObjectStyle>> } & GetStyleByName>
}

export const createStyleBuilder = <TStyle>(cb: StyleBuilderType<TStyle>) => cb;
export const createObjectStyleBuilder = <TStyle>(cb: StyleObjctBuilderType<TStyle>) => cb;

export function useStyle<TStyle>(styleBuilder: StyleObjctBuilderType<TStyle>): { style: TStyle } & GetStyleByName;
export function useStyle<TStyle>(styleBuilder: StyleBuilderType<TStyle>): { style: StyleSheet.NamedStyles<TStyle> } & GetStyleByName;
export function useStyle(styleBuilder: (options: StyleOptions) => any) {
    const { profile } = useData('profile')
    const theme = useColorScheme();

    const profileColors = profile.value
        ? theme === 'dark'
            ? profile.value.colors.dark
            : profile.value.colors.light
        : Colors.light

    const styleOptions: any = {
        theme: theme,
        colors: profileColors
    }

    const style = React.useMemo(() => styleBuilder(styleOptions), [window.orientation, profile.value, theme]);
    return ({
        style,
        getStyleByName: (text: string) => style && style[text]
    })
}

export function useStyles<TStyle, TObjectStyle>(
    styles?: Array<StyleBuilderType<TStyle>>,
    objectStyles?: Array<StyleObjctBuilderType<TObjectStyle>>) {

    const { profile } = useData('profile')
    const theme = useColorScheme();

    const profileColors = profile.value && theme === 'dark' ? profile.value.colors.dark
        : profile.value && theme === 'light' ? profile.value.colors.light
            : Colors;

    const styleOptions: any = {
        theme: theme,
        colors: profileColors
    }

    const ret = React.useMemo(() => {
        let obj: UseStylesResultType<TStyle, TObjectStyle> = { styles: [], objectStyles: [] }
        if (styles) {
            for (let index = 0; index < styles.length; index++) {
                const style = styles[index](styleOptions)
                obj.styles.push(({ style, getStyleByName: (text: string): any => style && (<any>style)[text] }))
            }
        }
        if (objectStyles) {
            for (let index = 0; index < objectStyles.length; index++) {
                const objectStyle = objectStyles[index](styleOptions)
                obj.objectStyles.push(({ style: objectStyle, getStyleByName: (text: string): any => objectStyle && (<any>objectStyle)[text] }))
            }
        }
        return obj
    }, [window.orientation, profile.value, theme])

    return ret
}
