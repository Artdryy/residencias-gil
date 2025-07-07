const db = require('../config/db');

const crearRol = async (req, res) => {
  try {
    const { nombre_rol, descripcion } = req.body;

    if (!nombre_rol) {
      return res.status(400).json({ error: 'Nombre del rol es obligatorio' });
    }

    await db.execute(
      `CALL reposresidencia.insert_role(?, ?)`,
      [nombre_rol, descripcion]
    );

    res.status(201).json({ message: 'Rol creado correctamente' });

  } catch (error) {
    console.error('Error al crear rol:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const listarRoles = async (req, res) => {
  try {
    const [rows] = await db.execute('CALL reposresidencia.get_roles()');
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al listar roles:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const actualizarRol = async (req, res) => {
  try {
    const { rol_id } = req.params;
    const { nombre_rol, descripcion } = req.body;

    await db.execute(
      `CALL reposresidencia.update_role(?, ?, ?)`,
      [rol_id, nombre_rol, descripcion]
    );

    res.json({ message: 'Rol actualizado correctamente' });

  } catch (error) {
    console.error('Error al actualizar rol:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const eliminarRol = async (req, res) => {
  try {
    const { rol_id } = req.params;

    await db.execute('CALL reposresidencia.delete_role(?)', [rol_id]);

    res.json({ message: 'Rol eliminado correctamente' });

  } catch (error) {
    console.error('Error al eliminar rol:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  crearRol,
  listarRoles,
  actualizarRol,
  eliminarRol
};
