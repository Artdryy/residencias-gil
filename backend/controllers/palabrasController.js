const db = require('../config/db');
const { get } = require('../config/email');

// Función: Insertar palabra clave (solo admin)
const insertarPalabraClave = async (req, res) => {
  try {
    const { palabra } = req.body;

    if (req.user.rol !== 'admin') {
      return res.status(403).json({ error: 'Solo el administrador puede agregar palabras clave' });
    }

    if (!palabra || typeof palabra !== 'string') {
      return res.status(400).json({ error: 'Palabra inválida' });
    }

    const palabraNormalizada = palabra.trim().toLowerCase();

    await db.execute(`CALL reposresidencia.insert_keyword(?)`, [palabraNormalizada]);

    res.status(201).json({ message: 'Palabra clave insertada correctamente' });
  } catch (error) {
    console.error('Error al insertar palabra clave:', error);
    res.status(500).json({ error: 'Error al insertar palabra clave' });
  }
};

// Función: Eliminar palabra clave (solo admin)
const eliminarPalabraClave = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.rol !== 'admin') {
      return res.status(403).json({ error: 'Solo el administrador puede eliminar palabras clave' });
    }

    await db.execute(`CALL reposresidencia.delete_keyword(?)`, [id]);

    res.json({ message: 'Palabra clave eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar palabra clave:', error);
    res.status(500).json({ error: 'Error al eliminar palabra clave' });
  }
};

const getKeywords = async (req, res) => {
  try {
    const { prefijo } = req.query; 
    const parametro = prefijo && prefijo.trim() !== '' ? prefijo.trim() : null;
    const [rows] = await db.execute('CALL reposresidencia.get_keywords(?)', [parametro]); 
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener keywords:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  insertarPalabraClave,
  eliminarPalabraClave,
  getKeywords
};
