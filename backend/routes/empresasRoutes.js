const express = require('express');
const router = express.Router();
const {
  crearEmpresa,
  listarEmpresas,
  actualizarEmpresa,
  eliminarEmpresa
} = require('../controllers/empresasController');

router.post('/', crearEmpresa);
router.get('/', listarEmpresas);
router.put('/:empresa_id', actualizarEmpresa);
router.delete('/:empresa_id', eliminarEmpresa);

module.exports = router;
