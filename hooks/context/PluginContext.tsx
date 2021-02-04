import React, { createContext } from 'react';
import { PluginDataProvider } from './PluginDataProvider';

type PluginContextType<TConfig> = {
    config: TConfig
}

export const PluginContext = createContext<PluginContextType<any>>({} as any)

export function withPluginContext(Plugin: any, props: any) {
    const { config, ...others } = props;
    return (
        <PluginContext.Provider value={{ config }}>
            <PluginDataProvider>
                <Plugin {...others} />
            </PluginDataProvider>
        </PluginContext.Provider>
    )
}