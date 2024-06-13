import { createRouter, createWebHistory } from 'vue-router';
import TodoView from '../views/TodoView.vue';
import LoginView from '../views/LoginView.vue';
import LogoutView from '../views/LogoutView.vue';
import RegisterView from '../views/RegisterView.vue';

const routes = [
  {
    path: '/todo',
    name: 'todo',
    component: TodoView
  },
  {
    path: '/',
    name: 'LoginView',
    component: LoginView
  },
  {
    path: '/logout',
    name: 'LogoutView',
    component: LogoutView
  },
  {
    path: '/register',
    name: 'RegisterView',
    component: RegisterView
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
