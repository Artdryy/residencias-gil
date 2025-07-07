const express = require('express');
const router = express.Router();
const {
  crearRol,
  listarRoles,
  actualizarRol,
  eliminarRol
} = require('../controllers/rolesController');

router.post('/', crearRol);
router.get('/', listarRoles);
router.put('/:rol_id', actualizarRol);
router.delete('/:rol_id', eliminarRol);

module.exports = router;
