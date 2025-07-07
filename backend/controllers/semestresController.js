const db = require('../config/db');

const listarSemestres = async (req, res) => {
  try {
    const [rows] = await db.execute('CALL reposresidencia.get_semestres()');
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al listar semestres:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { listarSemestres };
