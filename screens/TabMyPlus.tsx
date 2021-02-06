import * as React from 'react';

import { MyPluginContext } from '../components/plugins/MyPluginContext';
import { PluginDataProvider } from '../hooks/context/PluginDataProvider';

export default function TabMyScreen() {
  return (
    <PluginDataProvider>
      <MyPluginContext />
    </PluginDataProvider>
  );
}