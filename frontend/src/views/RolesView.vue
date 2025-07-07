<template>
    <div class="view-container">
      <h1>Roles</h1>
  
      <!-- Formulario Crear o Editar -->
      <form @submit.prevent="editando ? actualizarRol() : crearRol()">
        <input type="text" v-model="rolForm.nombre_rol" placeholder="Nombre del rol" required>
        <input type="text" v-model="rolForm.descripcion" placeholder="Descripción del rol">
        <button type="submit">{{ editando ? 'Actualizar Rol' : 'Crear Rol' }}</button>
        <button v-if="editando" type="button" @click="cancelarEdicion" class="cancel-button">Cancelar</button>
      </form>
  
      <div v-if="roles.length > 0" class="roles-lista">
        <h2>Lista de Roles:</h2>
        <ul>
          <li v-for="rol in roles" :key="rol.rol_id">
            {{ rol.nombre_rol }} - {{ rol.descripcion }}
            <button @click="cargarRol(rol)" class="edit-button">Editar</button>
            <button @click="eliminarRol(rol.rol_id)" class="delete-button">Eliminar</button>
          </li>
        </ul>
      </div>
      <div v-else>
        <p>No hay roles registrados aún.</p>
      </div>
    </div>
  </template>
  
  <script>
  import apiClient from '@/services/apiClient';
  
  export default {
    name: 'RolesView',
    data() {
      return {
        roles: [],
        rolForm: {
          nombre_rol: '',
          descripcion: ''
        },
        editando: false,
        rolIdEditar: null
      }
    },
    created() {
      this.obtenerRoles();
    },
    methods: {
      async obtenerRoles() {
        try {
          const response = await apiClient.get('/roles');
          this.roles = response.data;
        } catch (error) {
          console.error('Error al obtener roles:', error);
          alert('No se pudieron cargar los roles');
        }
      },
      async crearRol() {
        try {
          await apiClient.post('/roles', this.rolForm);
          alert('Rol creado correctamente');
          this.resetFormulario();
          this.obtenerRoles();
        } catch (error) {
          console.error('Error al crear rol:', error);
          alert('No se pudo crear el rol');
        }
      },
      cargarRol(rol) {
        this.editando = true;
        this.rolIdEditar = rol.rol_id;
        this.rolForm = {
          nombre_rol: rol.nombre_rol,
          descripcion: rol.descripcion
        };
      },
      async actualizarRol() {
        try {
          await apiClient.put(`/roles/${this.rolIdEditar}`, this.rolForm);
          alert('Rol actualizado correctamente');
          this.resetFormulario();
          this.obtenerRoles();
        } catch (error) {
          console.error('Error al actualizar rol:', error);
          alert('No se pudo actualizar el rol');
        }
      },
      cancelarEdicion() {
        this.resetFormulario();
      },
      async eliminarRol(id) {
        if (!confirm('¿Estás seguro de eliminar este rol?')) {
          return;
        }
  
        try {
          await apiClient.delete(`/roles/${id}`);
          alert('Rol eliminado correctamente');
          this.obtenerRoles();
        } catch (error) {
          console.error('Error al eliminar rol:', error);
          alert('No se pudo eliminar el rol');
        }
      },
      resetFormulario() {
        this.rolForm = {
          nombre_rol: '',
          descripcion: ''
        };
        this.editando = false;
        this.rolIdEditar = null;
      }
    }
  }
  </script>
  
  <style scoped>
  .view-container {
    padding: 2rem;
  }
  input {
    display: block;
    margin-bottom: 1rem;
    width: 100%;
    max-width: 400px;
  }
  button {
    margin-right: 0.5rem;
    margin-bottom: 1rem;
  }
  .roles-lista {
    margin-top: 2rem;
  }
  .edit-button {
    background-color: #3498db;
    color: white;
    border: none;
    padding: 0.3rem 0.6rem;
    cursor: pointer;
  }
  .edit-button:hover {
    background-color: #2980b9;
  }
  .delete-button {
    background-color: #e74c3c;
    color: white;
    border: none;
    padding: 0.3rem 0.6rem;
    cursor: pointer;
  }
  .delete-button:hover {
    background-color: #c0392b;
  }
  .cancel-button {
    background-color: #7f8c8d;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    cursor: pointer;
  }
  .cancel-button:hover {
    background-color: #626567;
  }
  </style>
  