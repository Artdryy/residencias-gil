<template>
  <div class="sidebar" @mouseenter="expandirSidebar" @mouseleave="contraerSidebar" :class="{ expanded: sidebarExpandido }">
    <div class="sidebar-header logo-container">
      <img :src="logoActual" alt="Logo" class="sidebar-logo" />
    </div>
    <div class="sidebar-menu">
      <router-link to="/reportes" class="menu-item" :class="{ active: $route.name === 'Reportes' }">
        <i class="fas fa-file-alt"></i>
        <span>Reportes</span>
      </router-link>
      <router-link to="/usuarios" class="menu-item" :class="{ active: $route.name === 'Usuarios' }">
        <i class="fas fa-user-graduate"></i>
        <span>Usuarios</span>
      </router-link>
      <router-link to="/empresas" class="menu-item" :class="{ active: $route.name === 'Empresas' }">
        <i class="fas fa-building"></i>
        <span>Empresas</span>
      </router-link>
      <router-link to="/roles" class="menu-item" :class="{ active: $route.name === 'Roles' }">
        <i class="fas fa-user-shield"></i>
        <span>Roles</span>
      </router-link>
    </div>
  </div>
</template>

<script>
import logo from '@/assets/logo.png';
import logoExpanded from '@/assets/logo-expanded.png';

export default {
  name: "Navbar",
  data() {
    return {
      sidebarExpandido: false
    };
  },
  computed: {
    logoActual() {
      return this.sidebarExpandido ? logoExpanded : logo;
    }
  },
  methods: {
    expandirSidebar() {
      this.sidebarExpandido = true;
    },
    contraerSidebar() {
      this.sidebarExpandido = false;
    }
  }
};
</script>

<style scoped>
.sidebar-logo {
  width: 40px;
  height: 40px;
  object-fit: contain;
  display: block;
  margin: 0 auto;
  transition: all 0.3s ease;
}

.sidebar.expanded .sidebar-logo {
  width: 130px;
  height: 130px;
}

.logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.5rem;
}
</style>
