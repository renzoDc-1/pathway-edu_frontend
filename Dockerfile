# Etapa de construcción
FROM node:18-alpine AS builder
WORKDIR /app

# Copia los archivos de configuración de dependencias
COPY package*.json ./
RUN npm install

# Copia el resto del código
COPY . .

# Asegúrate de eliminar la carpeta dist si existe antes de construir
RUN rm -rf dist && npm run build

# Etapa de producción usando Nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80

# Comando de inicio para Nginx (por defecto en la imagen de Nginx)
CMD ["nginx", "-g", "daemon off;"]
