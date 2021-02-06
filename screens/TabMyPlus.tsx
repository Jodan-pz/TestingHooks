import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { Appearance, StyleSheet, useColorScheme } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { MyPlugin } from '../components/TestUseData/MyPlugin';
import { MyPluginContext } from '../components/TestUseData/MyPluginContext';
import { Text, View } from '../components/Themed';
import { PluginDataProvider } from '../hooks/context/PluginDataProvider';

export default function TabMyScreen() {
  return (
    <PluginDataProvider>
      <MyPluginContext />
    </PluginDataProvider>
  );
}