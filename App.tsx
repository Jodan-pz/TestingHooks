import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MyPlugin } from './components/TestUseData/MyPlugin';
import { MyPluginContext } from './components/TestUseData/MyPluginContext';
import { ApplicationDataProvider } from './hooks/context/ApplicationDataProvider';
import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import PluginManager from './pluginManager';

PluginManager.register('MyPlugin', MyPlugin)
PluginManager.register('MyPluginContext', MyPluginContext)

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <ApplicationDataProvider>
          <Navigation colorScheme={colorScheme} />
          <StatusBar />
        </ApplicationDataProvider>
      </SafeAreaProvider>
    );
  }
}
