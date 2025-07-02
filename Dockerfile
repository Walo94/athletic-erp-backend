FROM node:20-bullseye
WORKDIR /app

# Copia primero el package.json para aprovechar el caché de Docker
COPY package*.json ./
RUN npm install

# Ahora copia el resto de tu código
COPY . .

EXPOSE 5000

# Comando para iniciar tu servidor
CMD [ "node", "server.js" ]