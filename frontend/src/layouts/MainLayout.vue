<template>
  <div>
    <Navbar :sidebarActive="sidebarActive" />
    <Topbar @toggle-sidebar="toggleSidebar" />
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import Topbar from "@/components/Topbar.vue";

export default {
  name: "MainLayout",
  components: {
    Navbar,
    Topbar,
  },
  data() {
    return {
      sidebarActive: false,
    };
  },
  methods: {
    toggleSidebar() {
      this.sidebarActive = !this.sidebarActive;
    },
  },
};
</script>
