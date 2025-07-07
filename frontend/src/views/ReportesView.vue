<template>
  <div class="reports-header">
    <h1 class="reports-title">Reportes</h1>

    <div class="reports-controls">
      <div class="filter-controls">
        <select v-model="filtroSeleccionado" class="filter-select">
          <option value="todos">Todos los reportes</option>
          <option value="nombreAsc">Nombre A-Z</option>
          <option value="nombreDesc">Nombre Z-A</option>
          <option value="fechaEntrega">Fecha de entrega</option>
        </select>
        <input
          v-if="filtroSeleccionado === 'fechaEntrega'"
          type="date"
          class="filter-select"
          v-model="fechaSeleccionada"
        />
      </div>

      <div class="right-actions">
        <div class="search-bar">
          <i class="fas fa-search"></i>
          <input
            type="text"
            placeholder="Buscar reportes..."
            v-model="searchQuery"
            @input="filtrarReportes"
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
          <th>N° Control</th>
          <th @click="filtroSeleccionado = 'nombreAsc'; ordenar()">Nombre del Alumno</th>
          <th>Carrera</th>
          <th>Semestre</th>
          <th>Título</th>
          <th>Empresa</th>
          <th @click="filtroSeleccionado = 'fechaEntrega'; ordenar()">Fecha Subida</th>
          <th>Palabras Clave</th>
          <th>Reporte</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(reporte, index) in reportesPaginados" :key="index">
          <td>{{ reporte.nombre_alumno }}</td>
          <td>{{ reporte.numero_control }}</td>
          <td>{{ reporte.carrera }}</td>
          <td>{{ reporte.semestre }}</td>
          <td>{{ reporte.titulo_reporte }}</td>
          <td>{{ reporte.nombre_empresa }}</td>
          <td>{{ formatearFecha(reporte.fecha_entrega) }}</td>
          <td>
            <span v-for="(palabra, i) in reporte.palabras_clave || []" :key="i" class="tag-clave">
              {{ palabra }}
            </span>
          </td>
          <td>
            <button class="icon-btn" @click="verPdf(reporte.ruta_pdf)">
              <i class="fas fa-eye"></i>
            </button>
            <button class="icon-btn" @click="editarReporte(reporte)">
              <i class="fas fa-pen"></i>
            </button>
            <button class="icon-btn trash-btn" @click="eliminarReporte(reporte)">
              <i class="fas fa-trash"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="pagination">
    <button class="pagination-btn" @click="cambiarPagina('anterior')" :disabled="paginaActual === 1">
      <i class="fas fa-chevron-left"></i> Previous
    </button>
    <div class="page-numbers">
      <span
        v-for="pagina in paginasTotales"
        :key="pagina"
        :class="{ active: pagina === paginaActual }"
        @click="paginaActual = pagina"
      >
        {{ pagina }}
      </span>
    </div>
    <button class="pagination-btn" @click="cambiarPagina('siguiente')" :disabled="paginaActual === paginasTotales">
      Next <i class="fas fa-chevron-right"></i>
    </button>
  </div>

  <div v-if="mostrarModal" class="modal-overlay">
    <div class="modal-content">
      <h2>{{ modoEdicion ? 'Editar Reporte' : 'Crear Nuevo Reporte' }}</h2>
      <form @submit.prevent="guardarReporte">
        <input
          class="modal-input"
          type="text"
          v-model="nuevoReporte.nombre_alumno"
          placeholder="Nombre del Alumno"
          required
        />
        <input
          class="modal-input"
          type="text"
          v-model="nuevoReporte.numero_control"
          placeholder="Número de Control"
          required
        />
        <input class="modal-input" type="text" v-model="nuevoReporte.carrera" placeholder="Carrera" required />
        <select v-model="nuevoReporte.semestre_id" class="modal-input" required>
        <option disabled value="">Selecciona semestre</option>
        <option v-for="sem in semestresOrdenados" :key="sem.semestre_id" :value="sem.semestre_id">
          {{ sem.nombre }}
        </option>
      </select>


        <input
          class="modal-input"
          type="text"
          v-model="nuevoReporte.titulo_reporte"
          placeholder="Título del Reporte"
          required
        />
        <select v-model="nuevoReporte.empresa_id" class="filter-select" required>
          <option disabled value="">Selecciona una empresa</option>
          <option v-for="empresa in empresas" :key="empresa.empresa_id" :value="empresa.empresa_id">
            {{ empresa.nombre }}
          </option>
        </select>
        <div class="modal-input palabra-clave-section">
          <input
            type="text"
            v-model="nuevaPalabra"
            placeholder="Agregar palabra clave"
            @keydown.enter.prevent="agregarPalabra"
          />
          <button type="button" class="btn-agregar-palabra" @click="agregarPalabra">Agregar</button>
          <div class="etiquetas-palabras">
            <span v-for="(p, i) in nuevoReporte.palabras_clave" :key="i" class="tag-clave">
              {{ p }}
              <i class="fas fa-times" @click="quitarPalabra(i)" style="margin-left: 5px; cursor: pointer;"></i>
            </span>
          </div>
        </div>
        <label class="upload-label">
          <i class="fas fa-file-upload"></i> Seleccionar PDF
          <input type="file" accept="application/pdf" @change="handlePdfUpload" hidden />
        </label>
        <p v-if="nombreArchivo">Archivo seleccionado: {{ nombreArchivo }}</p>
        <div class="modal-buttons">
          <button type="submit" class="btn-primary">Guardar</button>
          <button type="button" class="btn-secondary" @click="cerrarModal">Cancelar</button>
        </div>
      </form>
    </div>
  </div>

  <div v-if="mostrarModalEliminar" class="modal-overlay">
    <div class="modal-content">
      <h2>¿Deseas borrar el reporte?</h2>
      <div class="modal-buttons">
        <button @click="confirmarEliminarReporte" class="btn-primary">Sí, eliminar</button>
        <button @click="cancelarEliminarReporte" class="btn-secondary">Cancelar</button>
      </div>
    </div>
  </div>
</template>

<script>
import apiClient from '@/services/apiClient';
import vSelect from 'vue-select';
import "vue-select/dist/vue-select.css";

export default {
  name: "ReportesView",
  data() {
    return {
      filtroSeleccionado: "todos",
      fechaSeleccionada: "",
      searchQuery: "",
      reportes: [],
      reportesBase: [],
      paginaActual: 1,
      reportesPorPagina: 5,
      mostrarModal: false,
      modoEdicion: false,
      mostrarModalEliminar: false,
      reporteAEliminar: null,
      empresas: [],
      semestres: [],
      archivoPdf: null,
      nombreArchivo: "",
      nuevaPalabra: "",
      nuevoReporte: {
        nombre_alumno: "",
        numero_control: "",
        carrera: "",
        semestre_id: "",
        titulo_reporte: "",
        empresa_id: "",
        palabras_clave: [],
        sugerenciasKeywords: [], 
      },
    };
  },
  computed: {
    paginasTotales() {
      return Math.ceil(this.reportes.length / this.reportesPorPagina);
    },
    reportesPaginados() {
      const inicio = (this.paginaActual - 1) * this.reportesPorPagina;
      return this.reportes.slice(inicio, inicio + this.reportesPorPagina);
    },
  },
  methods: {
    agregarPalabra() {
      const palabra = this.nuevaPalabra.trim().toLowerCase();
      if (palabra && !this.nuevoReporte.palabras_clave.includes(palabra)) {
        this.nuevoReporte.palabras_clave.push(palabra);
      }
      this.nuevaPalabra = "";
    },
    quitarPalabra(index) {
      this.nuevoReporte.palabras_clave.splice(index, 1);
    },
    async guardarReporte() {
      try {
        if (!this.nuevoReporte.empresa_id) {
          alert("Por favor selecciona una empresa");
          return;
        }
        const formData = new FormData();
        formData.append("nombre_alumno", this.nuevoReporte.nombre_alumno);
        formData.append("numero_control", this.nuevoReporte.numero_control);
        formData.append("carrera", this.nuevoReporte.carrera);
        formData.append("semestre_id", this.nuevoReporte.semestre_id);
        formData.append("titulo_reporte", this.nuevoReporte.titulo_reporte);
        formData.append("empresa_id", this.nuevoReporte.empresa_id);
        formData.append(
          "palabras_clave",
          JSON.stringify(this.nuevoReporte.palabras_clave)
        );
        if (this.archivoPdf) {
          formData.append("pdf", this.archivoPdf);
        }
        if (this.modoEdicion) {
          await apiClient.put(
            `/reportes/${this.nuevoReporte.proyecto_id}`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
          );
          alert("Reporte actualizado correctamente");
        } else {
          await apiClient.post("/reportes", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          alert("Reporte creado correctamente");
        }
        this.cerrarModal();
        this.cargarReportes();
      } catch (error) {
        console.error("Error al guardar o actualizar reporte:", error);
        alert("Error al guardar o actualizar el reporte");
      }
    },
    editarReporte(reporte) {
      this.modoEdicion = true;
      this.mostrarModal = true;
      this.nuevoReporte = {
        proyecto_id: reporte.proyecto_id,
        nombre_alumno: reporte.nombre_alumno,
        numero_control: reporte.numero_control,
        carrera: reporte.carrera,
        semestre_id: reporte.semestre_id || "",
        titulo_reporte: reporte.titulo_reporte,
        empresa_id: reporte.empresa_id || "",
        ruta_pdf: reporte.ruta_pdf,
        palabras_clave: reporte.palabras_clave || [],
      };
      this.archivoPdf = null;
      this.nombreArchivo = reporte.ruta_pdf;
    },
    eliminarReporte(reporte) {
      this.reporteAEliminar = reporte;
      this.mostrarModalEliminar = true;
    },
    cancelarEliminarReporte() {
      this.mostrarModalEliminar = false;
      this.reporteAEliminar = null;
    },
    async confirmarEliminarReporte() {
      try {
        await apiClient.delete(`/reportes/${this.reporteAEliminar.proyecto_id}`);
        this.mostrarModalEliminar = false;
        this.reporteAEliminar = null;
        this.cargarReportes();
        alert("Reporte eliminado correctamente");
      } catch (error) {
        console.error("Error al eliminar reporte:", error);
        alert("Error al eliminar el reporte");
      }
    },
    async cargarReportes() {
      try {
        const { data } = await apiClient.get("/reportes");
        this.reportes = data;
        this.reportesBase = [...data];
      } catch (error) {
        console.error("Error al cargar reportes:", error);
      }
    },
    async cargarEmpresas() {
      try {
        const { data } = await apiClient.get("/empresas");
        this.empresas = data;
      } catch (error) {
        console.error("Error al cargar empresas:", error);
      }
    },
    async cargarSemestres() {
    try {
      const { data } = await apiClient.get("/semestres");

      this.semestres = data.sort((a, b) => {
        const [mesA, añoA] = a.nombre.split(" ");
        const [mesB, añoB] = b.nombre.split(" ");
        const prioridadMes = { "ENE-JUN": 2, "AGO-DIC": 1 };

        if (parseInt(añoA) !== parseInt(añoB)) {
          return parseInt(b.year) - parseInt(a.year);
        }
        return prioridadMes[mesB] - prioridadMes[mesA];
      });
    } catch (error) {
      console.error("Error al cargar semestres:", error);
    }
    },
    filtrarReportes() {
      const query = this.searchQuery.toLowerCase();
      this.reportes = this.reportesBase.filter(
        (r) =>
          r.nombre_alumno.toLowerCase().includes(query) ||
          r.numero_control.toLowerCase().includes(query) ||
          r.nombre_empresa.toLowerCase().includes(query) ||
          r.semestre.toString().includes(query)
      );
    },
    cambiarPagina(direccion) {
      if (direccion === "anterior" && this.paginaActual > 1) this.paginaActual--;
      if (direccion === "siguiente" && this.paginaActual < this.paginasTotales)
        this.paginaActual++;
    },
    ordenar() {
      const orden = this.filtroSeleccionado;
      let lista = [...this.reportesBase];
      if (orden === "nombreAsc") {
        lista.sort((a, b) => a.nombre_alumno.localeCompare(b.nombre_alumno));
      } else if (orden === "nombreDesc") {
        lista.sort((a, b) => b.nombre_alumno.localeCompare(a.nombre_alumno));
      } else if (orden === "fechaEntrega") {
        lista.sort((a, b) => new Date(b.fecha_entrega) - new Date(a.fecha_entrega));
      }
      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase();
        lista = lista.filter(
          (r) =>
            r.nombre_alumno.toLowerCase().includes(q) ||
            r.numero_control.toLowerCase().includes(q) ||
            r.titulo_reporte.toLowerCase().includes(q) ||
            r.carrera.toLowerCase().includes(q)
        );
      }
      this.reportes = lista;
    },
    formatearFecha(fecha) {
      if (!fecha) return "-";
      const date = new Date(fecha);
      return date.toLocaleDateString("es-MX");
    },
    abrirModal() {
      this.modoEdicion = false;
      this.mostrarModal = true;
      this.resetFormulario();
    },
    cerrarModal() {
      this.mostrarModal = false;
      this.resetFormulario();
    },
    resetFormulario() {
      this.nuevoReporte = {
        nombre_alumno: "",
        numero_control: "",
        carrera: "",
        semestre_id: "",
        titulo_reporte: "",
        empresa_id: "",
        palabras_clave: [],
      };
      this.archivoPdf = null;
      this.nombreArchivo = "";
      this.nuevaPalabra = "";
    },
    handlePdfUpload(e) {
      const file = e.target.files[0];
      if (file) {
        this.archivoPdf = file;
        this.nombreArchivo = file.name;
      }
    },
    verPdf(ruta) {
      if (ruta) {
        const file = ruta.replace(/^reportes[\\/]/, "");
        window.open(`http://localhost:3000/reportes/${file}`, "_blank");
      } else {
        alert("No se encontró el PDF.");
      }
    },
  },
  components: {
  vSelect
  },
  computed: {
  semestresOrdenados() {
    const prioridad = { "ENE-JUN": 2, "AGO-DIC": 1 };
    return [...this.semestres].sort((a, b) => {
      const [mesA, añoA] = a.nombre.split(" ");
      const [mesB, añoB] = b.nombre.split(" ");
      if (parseInt(añoA) !== parseInt(b.nombre.split(" ")[1])) {
        return parseInt(b.nombre.split(" ")[1]) - parseInt(a.nombre.split(" ")[1]);
      }
      return prioridad[mesB] - prioridad[mesA];
    });
  }
},
  mounted() {
    this.cargarSemestres();
    this.cargarReportes();
    this.cargarEmpresas();
  },
};

</script>


  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
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
  
  .modal-content h2 {
    margin-bottom: 1rem;
    font-family: var(--font-title);
  }
  
  .modal-content form input {
    width: 100%;
    margin-bottom: 1rem;
    padding: 0.7rem;
    border: 0px solid var(--gray-1);
    border-radius: 8px;
  }
  
  .modal-content select {
    margin-bottom: 1rem;
    width: 100%;
  }
  
  
  .upload-label {
    display: block;         
    width: 100%;             
    text-align: center;      
    background: var(--bg-card);
    padding: 0.7rem 1rem;
    border-radius: 8px;
    cursor: pointer;
    color: var(--gray-2);
    box-shadow: var(--shadow-raise);
    margin-bottom: 1rem;
  }
  
  
  .upload-label:hover {
    background: #f8fafd;
  }
  
  .modal-buttons {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
  }
  
  .btn-primary, .btn-secondary {
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
  
  
   /* Botón para crear reporte */
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
      margin-top: 0px;
      margin-left: auto; 
      display: block;
      }
  
    
    .add-report-btn:hover {
      background-color: #F8FAFD;
      box-shadow: var(--shadow-press);
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
      font-size: 0.9rem;
      color: var(--text-dark);
      transition: 0.3s ease;
    }

  
  
  .modal-input:focus {
    outline: none;
    background: #ffffff;
    box-shadow: var(--shadow-press);
  }
  
  .icon-btn {
    background: transparent;
    border: none;
    cursor: pointer;
    font-size: 1.2rem;
    color: var(--text-dark);
    padding: 0.3rem;
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

  .btn-agregar-palabra {
  background: #2a3646;
  color: #fff;
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 0.5rem;
}
.btn-agregar-palabra:hover {
  background-color: #1f2b38;
}
.filter-select {
  max-height: 9.5rem; 
  overflow-y: auto;
}

    </style>