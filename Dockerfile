# Etapa de construcción
FROM node:18-alpine AS builder

WORKDIR /app

# Instala las dependencias y construye la aplicación
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa de producción usando Nginx
FROM nginx:alpine

# Copia los archivos generados en `dist` a la carpeta de Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80

# Comando de inicio para Nginx (usado por defecto en la imagen de Nginx)
CMD ["nginx", "-g", "daemon off;"]
