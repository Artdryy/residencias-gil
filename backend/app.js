// ===== app.js =====
const path = require('path');
const express = require('express');
const app = express();
const cors = require('cors');
const db = require('./config/db');

require('dotenv').config();

// Importar Rutas
const semestresRoutes = require('./routes/semestresRoutes');
const authRoutes = require('./routes/authRoutes');
const usuariosRoutes = require('./routes/usuariosRoutes');
const empresasRoutes = require('./routes/empresasRoutes');
const rolesRoutes = require('./routes/rolesRoutes');
const reportesRoutes = require('./routes/reportesRoutes');
const palabrasRoutes = require('./routes/palabrasRoutes');
const { authMiddleware } = require('./middlewares/authMiddleware');

// Middlewares generales
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/reportes', express.static(path.join(__dirname, 'reportes')));

// Rutas
app.use('/api', authRoutes);
app.use('/api/usuarios', authMiddleware, usuariosRoutes);
app.use('/api/empresas', authMiddleware, empresasRoutes);
app.use('/api/roles', authMiddleware, rolesRoutes);
app.use('/api/reportes', authMiddleware, reportesRoutes);
app.use('/api/semestres', authMiddleware, semestresRoutes); 
app.use('/api/palabras', authMiddleware, palabrasRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
console.log(`Servidor escuchando en el puerto ${PORT}`);
});

app.get('/api/test', (req, res) => {
res.send('Backend activo');
});