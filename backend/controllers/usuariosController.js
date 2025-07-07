const db = require('../config/db');
const bcrypt = require('bcryptjs');

const crearUsuario = async (req, res) => {
  try {
    const { user_name, password, email, rol_id } = req.body;

    if (!user_name || !password || !email || !rol_id) {
      return res.status(400).json({ error: 'Faltan datos' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await db.execute(
      `call reposresidencia.insert_usuario(?, ?, ?, ?, ?)`,
      [user_name, hashedPassword, email, rol_id, 1]
    );

    res.status(201).json({ message: 'Usuario creado correctamente' });

  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const listarUsuarios = async (req, res) => {
  try {
    const [rows] = await db.execute('CALL reposresidencia.get_usuarios()');
    res.json(rows[0]); 
  } catch (error) {
    console.error('Error al listar usuarios:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};


const eliminarUsuario = async (req, res) => {
  try {
    const { usuario_id } = req.params;

    await db.execute('call reposresidencia.delete_usuario(?)', [usuario_id]);

    res.json({ message: 'Usuario eliminado correctamente' });

  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const actualizarEstadoUsuario = async (req, res) => {
  try {
    const { usuario_id } = req.params;
    const { is_active } = req.body;

    await db.execute('call reposresidencia.update_status_usuario(?, ?)', [usuario_id, is_active]);

    res.json({ message: 'Estado del usuario actualizado correctamente' });

  } catch (error) {
    console.error('Error al actualizar estado:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const actualizarUsuario = async (req, res) => {
  try {
    const { usuario_id } = req.params;
    const { user_name, email, rol_id } = req.body;

    await db.execute(
      'UPDATE reposresidencia.usuarios SET user_name = ?, email = ?, rol_id = ? WHERE usuario_id = ?',
      [user_name, email, rol_id, usuario_id]
    );

    res.json({ message: 'Usuario actualizado correctamente' });

  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
};

const actualizarPasswordUsuario = async (req, res) => {
  try {
    const { usuario_id } = req.params;
    const { new_password, codigo } = req.body;

    if (!new_password || !codigo) {
      return res.status(400).json({ error: 'Nueva contraseña y código son obligatorios' });
    }

    const [rows] = await db.execute(
      `SELECT codigo_recuperacion FROM reposresidencia.usuarios WHERE usuario_id = ?`,
      [usuario_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const codigoAlmacenado = rows[0].codigo_recuperacion;

    if (codigo !== codigoAlmacenado) {
      return res.status(401).json({ error: 'Código de recuperación incorrecto' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(new_password, salt);

    await db.execute(
      `UPDATE reposresidencia.usuarios
       SET password = ?, is_active = true, codigo_recuperacion = NULL
       WHERE usuario_id = ?`,
      [hashedPassword, usuario_id]
    );

    res.json({ message: 'Contraseña actualizada correctamente' });

  } catch (error) {
    console.error('Error al actualizar contraseña:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

function generarCodigoRecuperacion() {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let codigo = '';
  for (let i = 0; i < 6; i++) {
    codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return codigo;
}

const transporter = require('../config/email');

const solicitarCodigoRecuperacion = async (req, res) => {
  try {
    const { usuario_id } = req.params;
    const codigo = generarCodigoRecuperacion();
    const [rows] = await db.execute(
      'SELECT email FROM reposresidencia.usuarios WHERE usuario_id = ?',
      [usuario_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const emailUsuario = rows[0].email;

    await db.execute(
      `UPDATE reposresidencia.usuarios SET codigo_recuperacion = ? WHERE usuario_id = ?`,
      [codigo, usuario_id]
    );

    const mailOptions = {
      from: 'tu-email@gmail.com',
      to: emailUsuario,
      subject: 'Código de recuperación de contraseña',
      text: `Tu código de recuperación es: ${codigo}`
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: 'Código de recuperación enviado por correo' });

  } catch (error) {
    console.error('Error al generar código de recuperación:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { usuario_id } = req.params;
    const { codigo_recuperacion, nuevo_password } = req.body;

    if (!codigo_recuperacion || !nuevo_password) {
      return res.status(400).json({ error: 'Faltan datos' });
    }

    const [rows] = await db.execute(
      'SELECT codigo_recuperacion FROM reposresidencia.usuarios WHERE usuario_id = ?',
      [usuario_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const codigoGuardado = rows[0].codigo_recuperacion;

    if (!codigoGuardado || codigo_recuperacion !== codigoGuardado) {
      return res.status(400).json({ error: 'Código de recuperación inválido' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(nuevo_password, salt);

    await db.execute(
      `UPDATE reposresidencia.usuarios
       SET password = ?, is_active = true, codigo_recuperacion = NULL
       WHERE usuario_id = ?`,
      [hashedPassword, usuario_id]
    );

    res.json({ message: 'Contraseña actualizada correctamente' });

  } catch (error) {
    console.error('Error al resetear contraseña:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};


module.exports = {
  crearUsuario,
  listarUsuarios,
  eliminarUsuario,
  actualizarUsuario,
  actualizarEstadoUsuario,
  actualizarPasswordUsuario,
  solicitarCodigoRecuperacion,
  resetPassword
};

