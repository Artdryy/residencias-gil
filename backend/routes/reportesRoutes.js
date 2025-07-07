const express = require('express');
const router = express.Router();
const {
  listarReportes,
  crearReporte,
  actualizarReporte,
  eliminarReporte
} = require('../controllers/reportesController');
const upload = require('../middlewares/uploadMiddleware');

router.get('/', listarReportes);
router.post('/', upload.single('pdf'), crearReporte);
router.put('/:id', upload.single('pdf'), actualizarReporte);
router.delete('/:id', eliminarReporte);

module.exports = router;