const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const SMTP_CONFIG = require("./config/smtp");
const app = express();
const PORT = process.env.PORT || 3001; // Escolha uma porta disponível

app.use(cors());
app.use(bodyParser.json());

app.post('/send-email', async (req, res) => {
  const { fullName, email, whatsapp } = req.body;

  // Configuração do Nodemailer (substitua com suas próprias credenciais)
  const transporter = nodemailer.createTransport({
    host: SMTP_CONFIG.host,
    port: SMTP_CONFIG.port,
    secure: true,
    auth: {
      user: SMTP_CONFIG.user,
      pass: SMTP_CONFIG.pass,
    }
  });

  // Configuração do email
  const mailOptions = {
    from: 'eldson.caldasw@gmail.com',
    to: ['eldson.caldasw@gmail.com', 'ivysoftwares@gmail.com'], // Substitua com o seu e-mail institucional
    subject: 'Novo formulário de contato',
    html: `<p>Nome: ${fullName}</p><p>Email: ${email}</p><p>Whatsapp: ${whatsapp}</p>`,
  };

  try {
    // Envia o e-mail
    await transporter.sendMail(mailOptions);
    console.log('E-mail enviado com sucesso!');
    res.status(200).json({ message: 'Formulário enviado com sucesso!' });
  } catch (error) {
    console.error('Erro ao enviar o e-mail:', error);
    res.status(500).json({ message: 'Erro ao enviar o formulário. Por favor, tente novamente.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
