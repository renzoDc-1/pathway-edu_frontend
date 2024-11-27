# Etapa de construcción
FROM node:18-alpine AS builder
WORKDIR /app

# Copiar y descargar dependencias
COPY package*.json ./
RUN npm install

# Definir variable de entorno para VITE
ARG VITE_API_GATEWAY
ENV VITE_API_GATEWAY=$VITE_API_GATEWAY

# Copiar el resto del código y construir la aplicación
COPY . .
RUN rm -rf dist && npm run build

# Etapa de producción
FROM node:18-alpine
WORKDIR /app

# Copiar los archivos estáticos y el servidor desde la etapa de construcción
COPY --from=builder /app/dist ./dist

# Instalar todas las dependencias (incluyendo las de desarrollo)
RUN npm install --production=false

# Exponer el puerto 3000
EXPOSE 80

# Comando para iniciar el servidor
CMD ["npm", "run","preview"]
