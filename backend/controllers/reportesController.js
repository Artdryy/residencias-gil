const db = require('../config/db');
const path = require('path');
const fs = require('fs');

const crearReporte = async (req, res) => {
  try {
    console.log('Multer file info:', req.file);
    console.log('Body recibido:', req.body);

    if (!req.file) {
      return res.status(400).json({ error: 'No se subió ningún archivo PDF' });
    }

    const {
      nombre_alumno = null,
      numero_control = null,
      carrera = null,
      semestre_id = null,
      titulo_reporte = null,
      empresa_id = null,
      palabras_clave = []
    } = req.body || {};

    if (!nombre_alumno || !numero_control || !empresa_id || !semestre_id) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    const ruta_pdf = `reportes/${req.file.filename}`;

    // Insertar el reporte y obtener el ID generado
    const [result] = await db.execute(
      `CALL reposresidencia.insert_reporte(?, ?, ?, ?, ?, ?, ?)`,
      [
        nombre_alumno,
        numero_control,
        carrera,
        titulo_reporte,
        empresa_id,
        ruta_pdf,
        semestre_id
      ]
    );

    const proyecto_id = result[0][0].proyecto_id;

    // Insertar palabras clave asociadas
    for (const palabra of palabras_clave) {
      let [rows] = await db.execute(`SELECT palabra_id FROM reposresidencia.palabras_clave WHERE palabra = ?`, [palabra]);
      let palabra_id;

      if (rows.length === 0) {
        const insertResult = await db.execute(`INSERT INTO reposresidencia.palabras_clave(palabra) VALUES (?)`, [palabra]);
        palabra_id = insertResult[0].insertId;
      } else {
        palabra_id = rows[0].palabra_id;
      }

      await db.execute(`INSERT INTO reposresidencia.reporte_palabras(proyecto_id, palabra_id) VALUES (?, ?)`, [proyecto_id, palabra_id]);
    }

    res.status(201).json({ message: 'Reporte creado correctamente' });

  } catch (error) {
    console.error('Error al crear reporte:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const listarReportes = async (req, res) => {
  try {
    const [rows] = await db.execute(`CALL reposresidencia.get_reportes()`); 
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al listar reportes:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const actualizarReporte = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nombre_alumno,
      numero_control,
      carrera,
      titulo_reporte,
      empresa_id,
      semestre_id,
      palabras_clave = []
    } = req.body;

    let nuevoNombrePdf = req.body.ruta_pdf;

    if (req.file) {
      nuevoNombrePdf = req.file.filename;
    }

    await db.execute(
      `CALL reposresidencia.update_reporte(?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        nombre_alumno,
        numero_control,
        carrera,
        titulo_reporte,
        empresa_id,
        nuevoNombrePdf || null,
        semestre_id
      ]
    );

    // Limpiar palabras clave actuales
    await db.execute(`DELETE FROM reposresidencia.reporte_palabras WHERE proyecto_id = ?`, [id]);

    // Insertar nuevas palabras clave asociadas
    for (const palabra of palabras_clave) {
      let [rows] = await db.execute(`SELECT palabra_id FROM reposresidencia.palabras_clave WHERE palabra = ?`, [palabra]);
      let palabra_id;

      if (rows.length === 0) {
        const insertResult = await db.execute(`INSERT INTO reposresidencia.palabras_clave(palabra) VALUES (?)`, [palabra]);
        palabra_id = insertResult[0].insertId;
      } else {
        palabra_id = rows[0].palabra_id;
      }

      await db.execute(`INSERT INTO reposresidencia.reporte_palabras(proyecto_id, palabra_id) VALUES (?, ?)`, [id, palabra_id]);
    }

    res.json({ message: 'Reporte actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar reporte:', error);
    res.status(500).json({ error: 'Error al actualizar el reporte' });
  }
};

const eliminarReporte = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.execute(
      'SELECT ruta_pdf FROM reposresidencia.reportes WHERE proyecto_id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Reporte no encontrado' });
    }

    const ruta_pdf = rows[0].ruta_pdf;
    const filePath = path.join(__dirname, '..', ruta_pdf);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`Archivo eliminado: ${ruta_pdf}`);
    } else {
      console.warn(`Archivo no encontrado para borrar: ${ruta_pdf}`);
    }

    await db.execute('DELETE FROM reposresidencia.reporte_palabras WHERE proyecto_id = ?', [id]);
    await db.execute('DELETE FROM reposresidencia.reportes WHERE proyecto_id = ?', [id]);

    res.json({ message: 'Reporte y archivo PDF eliminados correctamente' });
  } catch (error) {
    console.error('Error al eliminar reporte:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const verPdf = (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '../reportes', filename);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Archivo no encontrado' });
    }

    res.sendFile(filePath);
  } catch (error) {
    console.error('Error al mostrar PDF:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  crearReporte,
  listarReportes,
  actualizarReporte,
  eliminarReporte,
  verPdf
};
