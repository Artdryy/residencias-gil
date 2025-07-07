const express = require('express');
const router = express.Router();
const { listarSemestres } = require('../controllers/semestresController'); 

router.get('/', listarSemestres);

module.exports = router;
