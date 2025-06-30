// server.js
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.post('/send', async (req, res) => {
  const { name, email, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
         service: 'gmail',
    auth: {
        user: 'arturstupenko@gmail.com',
        pass: 'mevu iesd ozpo bgmu', // твой App Password
     },
    tls: {
         rejectUnauthorized: false, // игнорировать ошибки сертификата
     },
    });

    const mailOptions = {
      from: `"${name}" <${email}>`, // показывает, кто отправил
      to: 'arturstupenko@gmail.com', // твоя почта, получаешь ты
      subject: `Neue Nachricht von ${name}`,
      text: `Name: ${name}\nE-Mail: ${email}\n\nNachricht:\n${message}`,
      replyTo: email, // при нажатии "ответить" будет подставляться email пользователя
    };

    await transporter.sendMail(mailOptions);

    res.status(200).send({ success: true });
  } catch (error) {
    console.error('Fehler beim Versenden:', error);
    res.status(500).send({ success: false });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server läuft auf http://localhost:${PORT}`);
});
