import * as React from 'react';
import { StyleSheet } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { MyPlugin } from '../components/TestUseData/MyPlugin';
import { MyPluginContext } from '../components/TestUseData/MyPluginContext';
import { Text, View } from '../components/Themed';
import { PluginDataProvider } from '../hooks/context/PluginDataProvider';

export default function TabOneScreen() {
  return (
    <PluginDataProvider>
      <MyPlugin />
    </PluginDataProvider>
    // <View style={styles.container}>
    //   <Text style={styles.title}>Tab One</Text>
    //   <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
    //   <EditScreenInfo path="/screens/TabOneScreen.tsx" />
    // </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
