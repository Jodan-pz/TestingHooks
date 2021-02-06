import React, { createContext } from 'react';
import { PluginConfig } from '../../types';
import { PluginDataProvider } from './PluginDataProvider';

type PluginContextType<TConfig extends PluginConfig> = {
    name: string,
    config: TConfig
}

export const PluginContext = createContext<PluginContextType<PluginConfig>>({} as any)

export function withPluginContext(name: string, Plugin: any, props: any) {
    const { config, ...others } = props;
    return (
        <PluginContext.Provider value={{ name, config }}>
            <PluginDataProvider>
                <Plugin {...others} />
            </PluginDataProvider>
        </PluginContext.Provider>
    )
}