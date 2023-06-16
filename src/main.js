import './assets/main.css'

/*import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#combosWrapper')*/

import { createApp } from 'vue'
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'

const app = createApp(App)
app.use(VueAxios, axios)
app.provide('axios', app.config.globalProperties.axios)  // provide 'axios'
app.mount('#combosWrapper')