    const express = require('express');
    const router = express.Router();
    const { crearUsuario, listarUsuarios, eliminarUsuario, actualizarUsuario, actualizarEstadoUsuario, actualizarPasswordUsuario, solicitarCodigoRecuperacion, resetPassword } = require('../controllers/usuariosController');

    router.post('/', crearUsuario);
    router.get('/', listarUsuarios);
    router.delete('/:usuario_id', eliminarUsuario);
    router.put('/:usuario_id', actualizarUsuario);
    router.put('/:usuario_id/status', actualizarEstadoUsuario);
    router.put('/:usuario_id/password', actualizarPasswordUsuario);
    router.post('/:usuario_id/solicitar-codigo', solicitarCodigoRecuperacion); 
    router.post('/:usuario_id/reset-password', resetPassword);

    module.exports = router;
