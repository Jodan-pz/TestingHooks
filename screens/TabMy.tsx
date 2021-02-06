import * as React from 'react';

import { MyPlugin } from '../components/plugins/MyPlugin';
import { PluginDataProvider } from '../hooks/context/PluginDataProvider';

export default function TabMyScreen() {
  return (
    <PluginDataProvider>
      <MyPlugin />
    </PluginDataProvider>
  );
}