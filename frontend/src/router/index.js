import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '@/views/LoginView.vue';
import DashboardView from '@/views/DashboardView.vue';
import EmpresasView from '@/views/EmpresasView.vue';
import UsuariosView from '@/views/UsuariosView.vue';
import RolesView from '@/views/RolesView.vue';
import ReportesView from '@/views/ReportesView.vue';
import MainLayout from '@/layouts/MainLayout.vue';
import apiClient from '@/services/apiClient';

const routes = [
  {
    path: '/',
    name: 'Login',
    component: LoginView
  },
  { 
    path: '/',
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [
      { path: 'dashboard', name: 'Dashboard', component: DashboardView },
      { path: 'empresas', name: 'Empresas', component: EmpresasView },
      { path: 'usuarios', name: 'Usuarios', component: UsuariosView },
      { path: 'roles', name: 'Roles', component: RolesView },
      { path: 'reportes', name: 'Reportes', component: ReportesView }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem('token');

  if (to.meta.requiresAuth) {
    if (!token) {
      next('/');
      return;
    }

    try {
      await apiClient.get('/verify-token'); 
      next();  
    } catch (error) {
      console.error('Token inválido:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('logueado');
      next('/'); 
    }
  } else {
    next();
  }
});

export default router;
