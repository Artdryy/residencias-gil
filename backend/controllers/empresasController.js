const db = require('../config/db');

const crearEmpresa = async (req, res) => {
  try {
    const { nombre, descripcion, direccion, telefono, correo } = req.body;

    if (!nombre) {
      return res.status(400).json({ error: 'Nombre es obligatorio' });
    }

    await db.execute(
      `CALL reposresidencia.insert_empresa(?, ?, ?, ?, ?)`,
      [nombre, descripcion, direccion, telefono, correo]
    );

    res.status(201).json({ message: 'Empresa creada correctamente' });

  } catch (error) {
    console.error('Error al crear empresa:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const listarEmpresas = async (req, res) => {
  try {
    const [rows] = await db.execute('CALL reposresidencia.get_empresas()');
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al listar empresas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const actualizarEmpresa = async (req, res) => {
  try {
    const { empresa_id } = req.params;
    const { nombre, descripcion, direccion, telefono, correo } = req.body;

    await db.execute(
      `CALL reposresidencia.update_empresa(?, ?, ?, ?, ?, ?)`,
      [empresa_id, nombre, descripcion, direccion, telefono, correo]
    );

    res.json({ message: 'Empresa actualizada correctamente' });

  } catch (error) {
    console.error('Error al actualizar empresa:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const eliminarEmpresa = async (req, res) => {
  try {
    const { empresa_id } = req.params;

    await db.execute('CALL reposresidencia.delete_empresa(?)', [empresa_id]);

    res.json({ message: 'Empresa eliminada correctamente' });

  } catch (error) {
    console.error('Error al eliminar empresa:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  crearEmpresa,
  listarEmpresas,
  actualizarEmpresa,
  eliminarEmpresa
};
