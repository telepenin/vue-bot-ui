import mitt from 'mitt';

import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)
app.config.globalProperties.$eventBus = mitt();
app.mount('#app')