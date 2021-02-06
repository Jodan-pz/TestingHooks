export type RootStackParamList = {
  Root: undefined;
  NotFound: undefined;
};

export type BottomTabParamList = {
  TabMy:undefined;
  TabMyPlus: undefined;

  TabOne: undefined;
  TabTwo: undefined;
};

export type TabOneParamList = {
  TabOneScreen: undefined;
};

export type TabTwoParamList = {
  TabTwoScreen: undefined;
};

export interface PluginConfig {
  key: string,
  pluginName: string,
  title?: string,
  settings?: any,
  default?: boolean,
  children?: PluginConfig[]
}