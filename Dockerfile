# Etapa de construcción
FROM node:18-alpine AS builder
WORKDIR /app

# Copiar los archivos necesarios para las dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Definir variable de entorno para VITE
ARG VITE_API_GATEWAY
ENV VITE_API_GATEWAY=$VITE_API_GATEWAY

# Copiar el resto del código del proyecto
COPY . .

# Construir la aplicación
RUN npm run build

# Etapa de producción
FROM node:18-alpine
WORKDIR /app

# Copiar los archivos estáticos generados por la etapa de construcción
COPY --from=builder /app/dist ./dist

# Instalar un servidor estático para servir el contenido (por ejemplo, serve)
RUN npm install -g serve

# Exponer el puerto 80 para la producción
EXPOSE 80

# Comando para servir los archivos estáticos
CMD ["serve", "-s", "dist", "-l", "80"]
