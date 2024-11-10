# Etapa de construcción
FROM node:18-alpine AS builder

WORKDIR /app

# Instala las dependencias
COPY package*.json ./
RUN npm install

# Copia el código fuente y construye la aplicación
COPY . .
RUN npm run build

# Etapa de producción
FROM node:18-alpine AS production

WORKDIR /app

# Copia solo los archivos necesarios para producción
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Exponer el puerto 80
EXPOSE 80

# Comando para iniciar Vite en producción
CMD ["npx", "vite", "preview", "--port", "80"]
