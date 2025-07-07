    <template>
        <div class="view-container">
          <h1>Empresas</h1>
      
          <!-- Formulario Crear o Editar -->
          <form @submit.prevent="editando ? actualizarEmpresa() : crearEmpresa()">
            <input type="text" v-model="empresaForm.nombre" placeholder="Nombre de la empresa" required>
            <input type="text" v-model="empresaForm.descripcion" placeholder="Descripción">
            <input type="text" v-model="empresaForm.direccion" placeholder="Dirección">
            <input type="text" v-model="empresaForm.telefono" placeholder="Teléfono">
            <input type="email" v-model="empresaForm.correo" placeholder="Correo electrónico">
            <button type="submit">{{ editando ? 'Actualizar Empresa' : 'Crear Empresa' }}</button>
            <button v-if="editando" type="button" @click="cancelarEdicion" class="cancel-button">Cancelar</button>
          </form>
      
          <div v-if="empresas.length > 0" class="empresas-lista">
            <h2>Lista de Empresas:</h2>
            <ul>
              <li v-for="empresa in empresas" :key="empresa.empresa_id">
                {{ empresa.nombre }} - {{ empresa.descripcion }}
                <button @click="cargarEmpresa(empresa)" class="edit-button">Editar</button>
                <button @click="eliminarEmpresa(empresa.empresa_id)" class="delete-button">Eliminar</button>
              </li>
            </ul>
          </div>
          <div v-else>
            <p>No hay empresas registradas aún.</p>
          </div>
        </div>
      </template>
      
      <script>
      import apiClient from '@/services/apiClient';
      
        export default {
        name: 'EmpresasView',
        data() {
          return {
            empresas: [],
            empresaForm: {
              nombre: '',
              descripcion: '',
              direccion: '',
              telefono: '',
              correo: ''
            },
            editando: false,
            empresaIdEditar: null
          }
        },
        mounted() {
          const token = localStorage.getItem('token');
          console.log('Token actual en EmpresasView:', token);
          this.obtenerEmpresas();
        },
        methods: {
          async obtenerEmpresas() {
            try {
              const response = await apiClient.get('/empresas');
              this.empresas = response.data;
            } catch (error) {
              console.error('Error al obtener empresas:', error);
              alert('No se pudieron cargar las empresas');
            }
          },
          async crearEmpresa() {
            try {
              await apiClient.post('/empresas', this.empresaForm);
              alert('Empresa creada correctamente');
              this.resetFormulario();
              this.obtenerEmpresas();
            } catch (error) {
              console.error('Error al crear empresa:', error);
              alert('No se pudo crear la empresa');
            }
          },
          cargarEmpresa(empresa) {
            this.editando = true;
            this.empresaIdEditar = empresa.empresa_id;
            this.empresaForm = { ...empresa }; 
          },
          async actualizarEmpresa() {
            try {
              await apiClient.put(`/empresas/${this.empresaIdEditar}`, this.empresaForm);
              alert('Empresa actualizada correctamente');
              this.resetFormulario();
              this.obtenerEmpresas();
            } catch (error) {
              console.error('Error al actualizar empresa:', error);
              alert('No se pudo actualizar la empresa');
            }
          },
          cancelarEdicion() {
            this.resetFormulario();
          },
          async eliminarEmpresa(id) {
            if (!confirm('¿Estás seguro de eliminar esta empresa?')) {
              return;
            }
      
            try {
              await apiClient.delete(`/empresas/${id}`);
              alert('Empresa eliminada correctamente');
              this.obtenerEmpresas();
            } catch (error) {
              console.error('Error al eliminar empresa:', error);
              alert('No se pudo eliminar la empresa');
            }
          },
          resetFormulario() {
            this.empresaForm = {
              nombre: '',
              descripcion: '',
              direccion: '',
              telefono: '',
              correo: ''
            };
            this.editando = false;
            this.empresaIdEditar = null;
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
      .empresas-lista {
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
        margin-left: 0.5rem;
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
      