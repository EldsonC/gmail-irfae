const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const SMTP_CONFIG = require("./config/smtp");
const app = express();
const PORT = process.env.PORT || 3000; // Escolha uma porta disponível
const fs = require('fs');

app.use(cors());
app.use(bodyParser.json());

app.post('/send-email', async (req, res) => {
  const { fullName, email, whatsapp } = req.body;

  // Leitura do arquivo HTML
  let htmlContent = fs.readFileSync('./src/index.html', 'utf-8');
  let htmlirfae = fs.readFileSync('./src/irfae.html', 'utf-8');

  htmlContent = htmlContent.replace('[Nome Completo]', fullName);
  htmlContent = htmlContent.replace('[Endereço de E-mail]', email);
  htmlContent = htmlContent.replace('[Número de Telefone]', whatsapp);

  htmlirfae = htmlirfae.replace('[Nome Completo]', fullName);
  htmlirfae = htmlirfae.replace('[Endereço de E-mail]', email);
  htmlirfae = htmlirfae.replace('[Número de Telefone]', whatsapp);

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
  const mailCliente = {
    from: ``,
    to: [`${email}`], // Substitua com o seu e-mail institucional
    subject: `(IRFAE) ${fullName} quer conhecer mais!`,
    html: htmlContent,
    
  };

  const mailIRFAE = {
    from: ``,
    to: ['ivysoftwares@gmail.com'], // Substitua com o seu e-mail institucional
    subject: `(IRFAE) ${fullName} quer conhecer mais!`,
    html: htmlirfae,
    
  };

  try {
    // Envia o e-mail
    await transporter.sendMail(mailCliente);
    await transporter.sendMail(mailIRFAE);
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
