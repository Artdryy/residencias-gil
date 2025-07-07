const bcrypt = require('bcryptjs');

async function generarHash() {
  const plainPassword = 'PasswordLogin123';
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(plainPassword, salt);
  
  console.log('Contraseña hasheada:', hashedPassword);
}

generarHash();
