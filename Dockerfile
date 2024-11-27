# Usa una imagen base de Node.js
FROM node:18-alpine AS production

# Define el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de configuración de dependencias
COPY package*.json ./

# Instala las dependencias necesarias para producción y Vite globalmente
RUN npm install --only=production && npm install -g vite

# Copia el resto del código fuente al contenedor
COPY . .

# Define el argumento de construcción para VITE_API_GATEWAY
ARG VITE_API_GATEWAY
# Configura VITE_API_GATEWAY como variable de entorno para Vite
ENV VITE_API_GATEWAY=$VITE_API_GATEWAY

# Construye la aplicación usando Vite
RUN vite build

# Expone el puerto en el que se ejecutará Vite
EXPOSE 80

# Comando para iniciar Vite en modo de producción
CMD ["npm", "run", "preview"]
