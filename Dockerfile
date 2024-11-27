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
RUN npm run build

# Etapa de producción
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Copiar los archivos estáticos generados por la etapa de construcción
COPY --from=builder /app/dist .

# Incluir configuración personalizada de Nginx directamente en el Dockerfile
RUN echo 'server { \
    listen 80; \
    root /usr/share/nginx/html; \
    index index.html; \
    \
    location / { \
        try_files $uri /index.html; \
    } \
    \
    location ~* \.(?:ico|css|js|gif|jpe?g|png|woff2?|eot|ttf|svg|otf)$ { \
        try_files $uri =404; \
        expires 6M; \
        access_log off; \
    } \
    \
    error_page 404 /index.html; \
}' > /etc/nginx/conf.d/default.conf

# Exponer el puerto 80
EXPOSE 80

# Comando de inicio para Nginx
CMD ["nginx", "-g", "daemon off;"]
