


import { App } from 'vue'

export * from './component'
import components from './component'



const install = function (app: App) {
  components.forEach((component: any) => {
    app.use(component as unknown as { install: () => any })
  })
}




export default {
    install
}