

import { App, Plugin } from 'vue';

import { DeviceScreenPlugin } from './components/DeviceScreen';

const ScrcpyPlugin: Plugin = {
  install(app: App) {
    DeviceScreenPlugin.install?.(app);
  },
};

export default ScrcpyPlugin;

export * from './components/DeviceScreen';