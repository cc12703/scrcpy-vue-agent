

import { App, Plugin } from 'vue';

import { DeviceViewPlugin } from './components/DeviceView';

const ScrcpyPlugin: Plugin = {
  install(app: App) {
    DeviceViewPlugin.install?.(app);
  },
};

export default ScrcpyPlugin;

export * from './components/DeviceView';