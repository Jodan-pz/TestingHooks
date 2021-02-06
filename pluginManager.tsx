import * as React from 'react';
import { View, Text } from 'react-native';
import { withPluginContext } from './hooks/context/PluginContext';
import { PluginConfig } from './types';

const MissingComponent = () => <View><Text>Missing Component</Text></View>;

var PluginManager = (() => {

  let plugins: { [name: string]: (props: any) => JSX.Element } = {};
  let pluginInstances: { [name: string]: any } = {}

  return ({

    init: () => pluginInstances = {},

    get: (config: PluginConfig | undefined) => (props: any) => {
      if (!config) {
        return <MissingComponent />;
      }
      const pluginName = config.pluginName.toLowerCase();
      const Plugin = plugins[pluginName];
      if (!Plugin) {
        console.log(plugins)
        return <MissingComponent />
      }
      if (pluginInstances[pluginName] === undefined) {
        pluginInstances[pluginName] = withPluginContext(pluginName, Plugin, { config, ...props })
      }
      return pluginInstances[pluginName]
    },

    register: (name: string, component: any) => {
      const pluginName = name.toLowerCase()
      plugins[pluginName] = component
    },

  })

})()

export default PluginManager;