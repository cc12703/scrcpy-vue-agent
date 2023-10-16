


import { App, Plugin } from 'vue'


import DeviceView from './index.vue'




export const DeviceViewPlugin: Plugin = {
  install(app: App) {
    app.component('device-view', DeviceView);
  },
};

export { DeviceView };


