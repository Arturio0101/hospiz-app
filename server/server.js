const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

const CONTACT_FILE = path.join(__dirname, '..', 'data', 'contactData.json');
const CREDENTIALS_FILE = path.join(__dirname, '..', 'data', 'adminCredentials.json');
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('Fehler: JWT_SECRET nicht gesetzt');
  process.exit(1);
}

// Проверка доступности каталога data
fs.access(path.dirname(CONTACT_FILE))
  .then(() => console.log('📂 Datenverzeichnis vorhanden:', path.dirname(CONTACT_FILE)))
  .catch(err => {
    console.error('❌ Datenverzeichnis fehlt oder keine Schreibrechte:', err);
  });

// Middleware: проверка токена
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token fehlt' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token ungültig' });
    req.user = user;
    next();
  });
}

// === CONTACT ===
app.get('/contact', async (req, res) => {
  try {
    const data = await fs.readFile(CONTACT_FILE, 'utf-8');
    const json = JSON.parse(data);
    res.json(json);
  } catch (error) {
    if (error.code === 'ENOENT') return res.json({});
    console.error('Error reading contact data:', error);
    res.status(500).json({ error: 'Fehler beim Lesen der Kontaktdaten' });
  }
});

app.post('/contact', authenticateToken, async (req, res) => {
  const newData = req.body;
  console.log('📨 Eingehende Daten für /contact:', JSON.stringify(newData, null, 2));

  if (!newData || typeof newData !== 'object' || Array.isArray(newData)) {
    console.log('❌ Ungültige Datenstruktur');
    return res.status(400).json({ error: 'Ungültige Kontaktdaten' });
  }

  try {
    console.log('📁 Zielpfad:', CONTACT_FILE);
    console.log('➡️ Versuch, in Datei zu schreiben...');

    await fs.writeFile(CONTACT_FILE, JSON.stringify(newData, null, 2), 'utf-8');

    console.log('✅ Kontaktdaten erfolgreich in Datei geschrieben');
    res.json({ message: 'Kontaktdaten gespeichert' });
  } catch (error) {
    console.error('❌ Fehler beim Schreiben in Datei:', error);
    res.status(500).json({ error: 'Fehler beim Speichern der Kontaktdaten' });
  }
});

// === LOGIN ===
app.post('/admin/login', async (req, res) => {
  const { login, password } = req.body;
  try {
    const raw = await fs.readFile(CREDENTIALS_FILE, 'utf8');
    const credentials = JSON.parse(raw);

    if (login !== credentials.admin_login) {
      return res.status(401).json({ success: false, message: 'Ungültiger Login' });
    }

    const validPassword = await bcrypt.compare(password, credentials.admin_password_hash);
    if (!validPassword) {
      return res.status(401).json({ success: false, message: 'Ungültiges Passwort' });
    }

    const token = jwt.sign({ login }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ success: true, token });
  } catch (err) {
    console.error('Fehler beim Lesen der Zugangsdaten:', err);
    res.status(500).json({ message: 'Fehler beim Lesen der Datei' });
  }
});

app.get('/admin/login', async (req, res) => {
  try {
    const raw = await fs.readFile(CREDENTIALS_FILE, 'utf8');
    const credentials = JSON.parse(raw);
    res.json({ login: credentials.admin_login });
  } catch (err) {
    console.error('Fehler beim Lesen der Zugangsdaten:', err);
    res.status(500).json({ error: 'Fehler beim Lesen der Zugangsdaten' });
  }
});

app.post('/admin/update-login', authenticateToken, async (req, res) => {
  const { login } = req.body;
  if (!login || typeof login !== 'string') {
    return res.status(400).json({ error: 'Login erforderlich' });
  }

  try {
    const raw = await fs.readFile(CREDENTIALS_FILE, 'utf-8');
    const creds = JSON.parse(raw);
    creds.admin_login = login;
    await fs.writeFile(CREDENTIALS_FILE, JSON.stringify(creds, null, 2), 'utf-8');

    res.json({ success: true, message: 'Login wurde aktualisiert' });
  } catch (err) {
    console.error('Fehler beim Aktualisieren des Logins:', err);
    res.status(500).json({ error: 'Fehler beim Speichern' });
  }
});

// === CHANGE PASSWORD ===
app.post('/admin/change-password', authenticateToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'currentPassword und newPassword erforderlich' });
  }

  try {
    const raw = await fs.readFile(CREDENTIALS_FILE, 'utf-8');
    const creds = JSON.parse(raw);

    const validPassword = await bcrypt.compare(currentPassword, creds.admin_password_hash);
    if (!validPassword) {
      return res.status(403).json({ error: 'Falsches aktuelles Passwort' });
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    creds.admin_password_hash = newPasswordHash;

    await fs.writeFile(CREDENTIALS_FILE, JSON.stringify(creds, null, 2), 'utf-8');
    res.json({ message: '✅ Passwort erfolgreich geändert' });
  } catch (err) {
    console.error('Fehler beim Ändern des Passworts:', err);
    res.status(500).json({ error: 'Serverfehler beim Ändern des Passworts' });
  }
});

app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
