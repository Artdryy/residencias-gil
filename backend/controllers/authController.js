const db = require('../config/db'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 

const login = async (req, res) => {
  try {
    const { user_name, password } = req.body;

    if (!user_name || !password) {
      return res.status(400).json({ error: 'Faltan credenciales' });
    }

    const [rows] = await db.execute(
      'SELECT usuario_id, user_name, password FROM reposresidencia.usuarios WHERE user_name = ?',
      [user_name]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    const usuario = rows[0];
    console.log('🔍 Contraseña recibida:', password);
    console.log('🔍 Contraseña en BD:', usuario.password);
    console.log('✔ Comparando...');

    const passwordCorrecta = await bcrypt.compare(password, usuario.password);
    console.log('Resultado bcrypt.compare:', passwordCorrecta);
    
    if (!passwordCorrecta) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      { usuario_id: usuario.usuario_id, user_name: usuario.user_name },
      process.env.JWT_SECRET,  
      { expiresIn: '1h' }
    );    
    res.json({ token });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { login };
