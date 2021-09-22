import { createApp } from 'vue'
import vuetify from './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'

const app = createApp(App).use(store).use(router)
app.use(vuetify)

app.mount('#app')
