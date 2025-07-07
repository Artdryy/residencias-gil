<template>
    <div class="topbar">
      <!-- Botón de perfil -->
      <div class="profile-btn" @click="abrirPerfil">
        <i class="fas fa-user-circle"></i> <!-- Icono de perfil -->
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Topbar',
    methods: {
      abrirPerfil() {
        console.log('Abrir perfil');
      },
    },
  };
  </script>
  
  <style scoped>
  .topbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    width:100;
    height: var(--topbar-height);
    background: linear-gradient(to right, #eff2f9, #f8fafc);
    backdrop-filter: blur(8px);
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 0 2rem;
    z-index: 99;
    box-shadow: 0 2px 15px rgba(16, 27, 29, 0.08);
  }
  
  .profile-btn {
    cursor: pointer;
    font-size: 2rem;
    color: #6e7f8d;
    transition: color 0.3s ease;
  }
  
  .profile-btn:hover {
    color: #2a3646;
  }
  </style>
  