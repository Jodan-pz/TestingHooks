import { Ionicons } from '@expo/vector-icons';
import { BottomTabBarOptions, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { MyPlugin } from '../components/TestUseData/MyPlugin';
import { MyPluginContext } from '../components/TestUseData/MyPluginContext';

import Colors from '../constants/Colors';
import { withPluginContext } from '../hooks/context/PluginContext';
import { PluginDataProvider } from '../hooks/context/PluginDataProvider';
import useColorScheme from '../hooks/useColorScheme';
import { createObjectStyleBuilder, createStyleBuilder, useStyles } from '../hooks/useStyles';
import TabOneScreen from '../screens/TabOneScreen';
import TabTwoScreen from '../screens/TabTwoScreen';
import { BottomTabParamList, TabOneParamList, TabTwoParamList } from '../types';


const getPlugin = (props: any) => {

  return withPluginContext(MyPlugin, {})
}
const getPluginX = (num: number) => (props: any) => {
  console.log('creating plugin number #' + num)
  return withPluginContext(MyPlugin, {})
}

const getPlugin2 = (props: any) => {

  return withPluginContext(MyPluginContext, {})
}

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

const tabStyleBuilder = createObjectStyleBuilder<BottomTabBarOptions>(opts => ({
  activeTintColor: opts.colors.light.tint
}))
export default function BottomTabNavigator() {
  const colorScheme = useColorScheme();
  const { style } = useStyles(tabStyleBuilder)

  return (
    <BottomTab.Navigator
      initialRouteName="TabOne"
      tabBarOptions={style}>
      <BottomTab.Screen
        name="TabOne"
        // component={getPlugin}
        // children={(p) => getPluginX(1)(p)}
        component={TabOneScreen}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="ios-code" color={color} />,
        }}
      />
      {/* <BottomTab.Screen
        name="TabTwo"
        component={getPlugin}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="ios-code" color={color} />,
        }}
      /> */}
    </BottomTab.Navigator>
  );
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon(props: { name: React.ComponentProps<typeof Ionicons>['name']; color: string }) {
  return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const TabOneStack = createStackNavigator<TabOneParamList>();


function TabOneNavigator() {
  return (
    <TabOneStack.Navigator>

      <TabOneStack.Screen
        name="TabOneScreen"
        component={getPlugin}
        options={{ headerTitle: 'Tab One Title' }}
      />

    </TabOneStack.Navigator>
  );
}

const TabTwoStack = createStackNavigator<TabTwoParamList>();

function TabTwoNavigator() {
  return (
    <TabTwoStack.Navigator>
      <TabTwoStack.Screen
        name="TabTwoScreen"
        component={TabTwoScreen}
        options={{ headerTitle: 'Tab Two Title' }}
      />
    </TabTwoStack.Navigator>
  );
}
