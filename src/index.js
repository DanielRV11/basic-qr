const qrcode = require("qrcode"); // Usamos qrcode para generar imágenes
const { Client, NoAuth } = require("whatsapp-web.js");
const express = require("express");
const app = express();

const PORT = 8080;

// Inicializa el cliente de WhatsApp Web sin autenticación.
const client = new Client({
  puppeteer: {
    args: ["--no-sandbox", "--disable-setuid-sandbox"], // Configuración correcta para Puppeteer
  },
  authStrategy: new NoAuth(),
});

// Almacena el buffer de la imagen del QR
let qrImageBuffer = null;

// Genera el QR como una imagen PNG
client.on("qr", (qr) => {
  qrcode.toBuffer(qr, { type: "png" }, (err, buffer) => {
    if (err) {
      console.error("Error al generar QR:", err);
    } else {
      qrImageBuffer = buffer;
      console.log("Código QR generado.");
    }
  });
});

// Maneja mensajes entrantes
client.on("message", (message) => {
  if (message.body.toLowerCase() === "hello") {
    client.sendMessage(message.from, "world!!!");
  }
});

// Evento cuando el cliente está listo
client.on("ready", () => {
  console.log("El cliente está listo.");
});

// Manejo de errores del cliente
client.on("auth_failure", (msg) => {
  console.error("Error de autenticación:", msg);
});

client.on("disconnected", (reason) => {
  console.warn("Cliente desconectado:", reason);
});

// Inicializa el cliente
client.initialize();

// Ruta para la página de inicio
app.get("/", (req, res) => {
  res.send("Hello, world!");
});

// Ruta para devolver el QR generado
app.get("/screenshot", (req, res) => {
  if (!qrImageBuffer) {
    return res.send(
      "Aún no se ha generado el código QR. Espera a que el cliente se conecte."
    );
  }

  // Devuelve la imagen del QR como respuesta
  res.set("Content-Type", "image/png");
  res.send(qrImageBuffer);
});

// Inicia el servidor
app.listen(PORT, (err) => {
  if (err) return console.error(err);
  console.info(`App listening on port ${PORT}`);
});
