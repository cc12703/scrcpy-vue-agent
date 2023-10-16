


import { App } from 'vue'


import DeviceView from './index.vue'


DeviceView.install = (app: App) => {
  app.component(DeviceView.name, DeviceView)
  return app
}




export default DeviceView