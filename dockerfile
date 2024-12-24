FROM node:20.12.2-buster

# puppeteer
# Instala las dependencias necesarias para Puppeteer
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    libnss3 \
    libxss1 \
    libasound2 \
    fonts-liberation \
    libappindicator3-1 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libgtk-3-0 \
    libx11-xcb1 \
    libxtst6 \
    libgbm-dev \
    libxshmfence-dev \
    && rm -rf /var/lib/apt/lists/*

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app



# Copia el archivo package.json y package-lock.json (si existe)
COPY package*.json ./


# Instala las dependencias
RUN npm install


# Copia el resto de los archivos de tu aplicación al contenedor
COPY . .

# Expone el puerto en el que tu aplicación se ejecutará (asegúrate de que coincide con el que usas en tu app)
EXPOSE 8080

# puppeteer
# Establece una variable de entorno para Puppeteer

# Comando para ejecutar la aplicación
CMD [ "npm", "start" ]