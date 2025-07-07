const express = require('express');
const router = express.Router();
const { insertarPalabraClave, eliminarPalabraClave, getKeywords } = require('../controllers/palabrasController');
const { authMiddleware, verificarAdmin } = require('../middlewares/authMiddleware'); 

router.post('/', authMiddleware, verificarAdmin, insertarPalabraClave);
router.delete('/:id', authMiddleware, verificarAdmin, eliminarPalabraClave);
router.get('/keywords', authMiddleware, getKeywords);


module.exports = router;
