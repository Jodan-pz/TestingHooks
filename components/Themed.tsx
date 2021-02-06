import * as React from 'react';
import { Text as DefaultText, View as DefaultView } from 'react-native';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import { useData } from '../hooks/useData';
import { useStyle } from '../hooks/useStyles';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme();
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText['props'];
export type ViewProps = ThemeProps & DefaultView['props'];

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const {style: textStyle} = useStyle( opts=> ({ color: opts.colors.text}) )

  // const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return <DefaultText style={[textStyle, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  // const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const {style: viewStyle} = useStyle( opts=> ({ backgroundColor: opts.colors.background}) )

  return <DefaultView style={[viewStyle, style]} {...otherProps} />;
}
