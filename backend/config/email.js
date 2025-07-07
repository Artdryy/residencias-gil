const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'alu.22130593@correo.itlalaguna.edu.mx', 
    pass: '' 
  }
});

module.exports = transporter;
