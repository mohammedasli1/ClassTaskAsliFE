import { createRouter, createWebHistory } from 'vue-router';
import employeeRoutes from './modules/employee';

const routes = [
  {
    path: '/',
    redirect: '/admin/employee/dashboard'
  },
  {
    path: '/admin',
    name: 'AdminLayout',
    component: () => import('../layouts/default.vue'),
    children: [
      ...employeeRoutes
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
