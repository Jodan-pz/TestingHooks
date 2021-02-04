import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ApplicationDataProvider } from './hooks/context/ApplicationDataProvider';
import { PluginDataContext, PluginDataProvider } from './hooks/context/PluginDataProvider';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  console.log({colorScheme})

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
