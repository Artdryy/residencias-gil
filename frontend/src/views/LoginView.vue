<template>
  <div class="login-container">
    <h1>Iniciar Sesión</h1>

    <form @submit.prevent="modoRecuperacion ? recuperarPassword() : login()">

      <div v-if="!modoRecuperacion">
        <input type="text" v-model="user_name" placeholder="Usuario" required>
        <input type="password" v-model="password" placeholder="Contraseña" required>
        <button type="submit">Ingresar</button>
      </div>

      <div v-else>
        <input type="text" v-model="codigo_recuperacion" placeholder="Código de recuperación" required>
        <input type="password" v-model="nuevo_password" placeholder="Nueva contraseña" required>
        <input type="password" v-model="confirmar_password" placeholder="Confirmar contraseña" required>
        <button type="submit">Restablecer contraseña</button>
      </div>

    </form>

    <p @click="modoRecuperacion = !modoRecuperacion" style="cursor: pointer; color: blue; margin-top: 1rem;">
      {{ modoRecuperacion ? '¿Recordaste tu contraseña? Volver al login' : '¿Olvidaste tu contraseña?' }}
    </p>

  </div>
</template>

<script>
import axios from 'axios';
import apiClient from '@/services/apiClient';
export default {
  data() {
    return {
      modoRecuperacion: false,
      user_name: '',
      password: '',
      codigo_recuperacion: '',
      nuevo_password: '',
      confirmar_password: ''
    }
  },
  created() {
    this.verificarSesion();
  },
  methods: {
    verificarSesion() {
      const token = localStorage.getItem('token');
      if (token) {
        this.$router.push('/reportes');
      }
    },
    async login() {
      try {
        const response = await apiClient.post('/login', {
          user_name: this.user_name,
          password: this.password
        });

        console.log('Respuesta login:', response.data);

        if (response.data && response.data.token) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('logueado', 'true');
          alert('Login exitoso');
          this.$router.push('/reportes');
        } else {
          alert('Login incorrecto: no se recibió token.');
        }
      } catch (error) {
        // Extrae el mensaje específico que envía tu API
        const apiError = error.response?.data?.error || 'desconocido';
        console.error('Error en login:', apiError);
        alert('Error en el login: ' + apiError);
      }
    },
    async recuperarPassword() {
      if (this.nuevo_password !== this.confirmar_password) {
        alert('Las contraseñas no coinciden');
        return;
      }

      try {
        const userResponse = await axios.get(`http://localhost:3000/api/usuarios`);
        const usuario = userResponse.data.find(u => u.user_name === this.user_name);

        if (!usuario) {
          alert('Usuario no encontrado');
          return;
        }

        await axios.post(`http://localhost:3000/api/usuarios/${usuario.usuario_id}/reset-password`, {
          codigo_recuperacion: this.codigo_recuperacion,
          nuevo_password: this.nuevo_password
        });

        alert('Contraseña restablecida correctamente');
        this.modoRecuperacion = false;

      } catch (error) {
        console.error(error);
        alert('Error al restablecer contraseña');
      }
    }
  }
}
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: auto;
  padding: 2rem;
}
input {
  display: block;
  width: 100%;
  margin-bottom: 1rem;
}
button {
  width: 100%;
}
</style>
