# Usar una imagen base de Node.js
FROM node:18-alpine
WORKDIR /app

# Copiar los archivos necesarios para instalar dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto de los archivos del proyecto
COPY . .

# Exponer el puerto predeterminado de Vite (5173)
EXPOSE 80

# Comando para iniciar Vite en modo desarrollo
CMD ["npm", "run", "start"]
