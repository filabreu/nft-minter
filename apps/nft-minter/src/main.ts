import './styles.css';

import { createApp } from 'vue';
import { createMemoryHistory, createRouter } from 'vue-router'

import App from './app/App.vue';

import Collection from './app/Collection.vue';
import MintForm from './app/MintForm.vue';

const routes = [
  { path: '/', component: Collection },
  { path: '/mint', component: MintForm },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

const app = createApp(App);

app.use(router);
app.mount('#root');
