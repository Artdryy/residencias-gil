<template>
  <div class="reports-header">
    <h1 class="reports-title">Usuarios</h1>

    <div class="reports-controls">
      <div class="right-actions">
        <div class="search-bar">
          <i class="fas fa-search"></i>
          <input
            type="text"
            placeholder="Buscar usuarios..."
            v-model="searchQuery"
            @input="filtrarUsuarios"
          />
        </div>
        <button @click="abrirModal" class="add-report-btn">
          <i class="fas fa-plus"></i>
        </button>
      </div>
    </div>
  </div>

  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th>Nombre de Usuario</th>
          <th>Correo</th>
          <th>Rol</th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="usuario in usuariosFiltrados" :key="usuario.usuario_id">
          <td>{{ usuario.user_name }}</td>
          <td>{{ usuario.email }}</td>
          <td>{{ usuario.nombre_rol }}</td>
          <td>
            <button class="icon-btn" @click="editarUsuario(usuario)">
              <i class="fas fa-pen"></i>
            </button>
            <button class="icon-btn trash-btn" @click="confirmarEliminar(usuario.usuario_id)">
              <i class="fas fa-trash"></i>
            </button>
            <label class="switch">
              <input type="checkbox" :checked="usuario.is_active" @change="cambiarEstadoUsuario(usuario)" />
              <span class="slider round"></span>
            </label>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div v-if="mostrarModal" class="modal-overlay">
    <div class="modal-content">
      <h2>{{ modoEdicion ? 'Editar Usuario' : 'Crear Nuevo Usuario' }}</h2>
      
      <form @submit.prevent="guardarUsuario">
        <input class="modal-input" type="text" v-model="nuevoUsuario.user_name" placeholder="Nombre de usuario" required />
        <input class="modal-input" type="email" v-model="nuevoUsuario.email" placeholder="Correo electrónico" required />
        <input v-if="!modoEdicion" class="modal-input" type="password" v-model="nuevoUsuario.password" placeholder="Contraseña" required />
        <select class="filter-select" v-model="nuevoUsuario.rol_id" required>
          <option disabled value="">Selecciona un rol</option>
          <option v-for="rol in roles" :key="rol.rol_id" :value="rol.rol_id">{{ rol.nombre_rol }}</option>
        </select>
        <div class="modal-buttons">
          <button type="submit" class="btn-primary">Guardar</button>
          <button type="button" class="btn-secondary" @click="cerrarModal">Cancelar</button>
        </div>
      </form>
    </div>
  </div>

  <div v-if="mostrarModalEliminar" class="modal-overlay">
    <div class="modal-content">
      <h2>¿Estás seguro que deseas eliminar este usuario?</h2>
      <div class="modal-buttons">
        <button class="btn-primary" @click="eliminarUsuarioConfirmado">Sí, eliminar</button>
        <button class="btn-secondary" @click="cancelarEliminar">Cancelar</button>
      </div>
    </div>
  </div>
</template>

<script>
import apiClient from '@/services/apiClient';

export default {
  name: 'UsuariosView',
  data() {
    return {
      usuarios: [],
      roles: [],
      searchQuery: '',
      mostrarModal: false,
      modoEdicion: false,
      mostrarModalEliminar: false,
      idAEliminar: null,
      nuevoUsuario: {
        user_name: '',
        email: '',
        password: '',
        rol_id: ''
      }
    };
  },
  computed: {
    usuariosFiltrados() {
      const query = this.searchQuery.toLowerCase();
      return this.usuarios.filter(u =>
        u.user_name.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query)
      );
    },
  },
  methods: {
    async cargarUsuarios() {
      try {
        const { data } = await apiClient.get('/usuarios');
        console.log('Usuarios cargados:', data);
        this.usuarios = data;
      } catch (error) {
        console.error('Error al cargar usuarios:', error);
      }
    },
    async cargarRoles() {
      try {
        const { data } = await apiClient.get('/roles');
        this.roles = data;
      } catch (error) {
        console.error('Error al cargar roles:', error);
      }
    },
    confirmarEliminar(id) {
      this.idAEliminar = id;
      this.mostrarModalEliminar = true;
    },
    cancelarEliminar() {
      this.mostrarModalEliminar = false;
      this.idAEliminar = null;
    },
    async eliminarUsuarioConfirmado() {
      try {
        await apiClient.delete(`/usuarios/${this.idAEliminar}`);
        alert('Usuario eliminado correctamente');
        this.mostrarModalEliminar = false;
        this.cargarUsuarios();
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
      }
    },
    async cambiarEstadoUsuario(usuario) {
      try {
        await apiClient.put(`/usuarios/${usuario.usuario_id}/status`, {
          is_active: !usuario.is_active,
        });
        usuario.is_active = !usuario.is_active;
      } catch (error) {
        console.error('Error al cambiar estado del usuario:', error);
      }
    },
    abrirModal() {
      this.resetFormulario();
      this.modoEdicion = false;
      this.mostrarModal = true;
    },
    editarUsuario(usuario) {
      console.log(usuario);
      this.nuevoUsuario = {
        user_name: usuario.user_name,
        email: usuario.email,
        password: '',
        rol_id: usuario.rol_id,
        usuario_id: usuario.usuario_id
      };
      this.modoEdicion = true;
      this.mostrarModal = true;
    },
    cerrarModal() {
      this.mostrarModal = false;
      this.resetFormulario();
    },
    resetFormulario() {
      this.nuevoUsuario = {
        user_name: '',
        email: '',
        password: '',
        rol_id: ''
      };
    },
    async guardarUsuario() {
      try {
        if (this.modoEdicion) {
          await apiClient.put(`/usuarios/${this.nuevoUsuario.usuario_id}`, {
            user_name: this.nuevoUsuario.user_name,
            email: this.nuevoUsuario.email,
            rol_id: this.nuevoUsuario.rol_id
          });
          alert('Usuario actualizado correctamente');
        } else {
          await apiClient.post('/usuarios', this.nuevoUsuario);
          alert('Usuario creado correctamente');
        }
        this.cerrarModal();
        this.cargarUsuarios();
      } catch (error) {
        console.error('Error al guardar usuario:', error);
        alert('Error al guardar usuario');
      }
    }
  },
  mounted() {
    this.cargarUsuarios();
    this.cargarRoles();
  },
};
</script>

<style scoped>
.switch {
  margin-top: 0px;
  position: fixed;
  display: inline-block;
  width: 42px;
  height: 24px;
}


.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #4CAF50;
}

input:checked + .slider:before {
  transform: translateX(18px);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.modal-content {
  background: #fff;
  padding: 2rem;
  border-radius: 10px;
  width: 400px;
  box-shadow: var(--shadow-raise);
  position: relative;
}

.modal-buttons {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1rem;
}

.btn-primary,
.btn-secondary {
  flex: 1;
  padding: 0.8rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}

.btn-primary {
  background: #2a3646;
  color: #fff;
}

.btn-secondary {
  background: #e4ebf1;
  color: var(--text-dark);
}

.modal-input {
  width: 100%;
  margin-bottom: 1rem;
  padding: 0.8rem;
  border: none;
  border-radius: 12px;
  background: #f1f7fd;
  box-shadow: var(--shadow-raise);
  font-family: var(--font-body);
  font-size: 0.85rem;
  color: var(--text-dark);
  transition: 0.3s ease;
}

.modal-input:focus {
  outline: none;
  box-shadow: var(--shadow-press);
  background: #fff;
}

.filter-select {
  width: 100%;
  margin-bottom: 1rem;
  padding: 0.8rem;
  border: none;
  border-radius: 12px;
  background: #f1f7fd;
  box-shadow: var(--shadow-raise);
  font-family: var(--font-body);
  font-size: 0.85rem;
  color: var(--text-dark);
  transition: 0.3s ease;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236E7F8D' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.8rem center;
  background-size: 1rem;
  padding-right: 2.5rem;
}

.icon-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  color: var(--text-dark);
  padding: 0.1rem;
  margin: 0 0.2rem;
}

.icon-btn:hover {
  color: #2a3646;
}

.trash-btn {
  color: #e74c3c;
}

.trash-btn:hover {
  color: #c0392b;
}

.add-report-btn {
  background-color: #EFF2F9;
  border: none;
  border-radius: 40%;
  padding: 0.70rem;
  box-shadow: var(--shadow-raise);
  font-size: 1rem;
  color: var(--text-dark);
  cursor: pointer;
  transition: 0.3s ease;
}

.add-report-btn:hover {
  background-color: #F8FAFD;
  box-shadow: var(--shadow-press);
}

</style>
  