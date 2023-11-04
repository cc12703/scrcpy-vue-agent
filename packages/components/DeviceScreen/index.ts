


import { App, Plugin } from 'vue'


import DeviceScreen from './Index.vue'




export const DeviceScreenPlugin: Plugin = {
  install(app: App) {
    app.component('device-screen', DeviceScreen);
  },
};

export { DeviceScreen };


