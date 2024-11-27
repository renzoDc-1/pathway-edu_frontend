# Usa una imagen base de Node.js
FROM node:18-alpine AS production

# Define el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de configuración de dependencias
COPY package*.json ./

# Instala solo las dependencias necesarias para producción
RUN npm install --only=production

# Copia el resto del código fuente al contenedor
COPY . .

# Define el argumento de construcción para VITE_API_GATEWAY
ARG VITE_API_GATEWAY
# Configura VITE_API_GATEWAY como variable de entorno para Vite
ENV VITE_API_GATEWAY=$VITE_API_GATEWAY

# Asegúrate de que la aplicación esté lista
RUN vite build 

# Expone el puerto en el que se ejecutará Vite
EXPOSE 80

# Comando para iniciar Vite en modo de producción
CMD ["vite"]
