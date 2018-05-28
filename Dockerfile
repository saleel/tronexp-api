FROM node:8.6.0

# Create app directory
WORKDIR /www

COPY package*.json ./

COPY server ./server
COPY client ./client

RUN npm run build

EXPOSE 3000

CMD [ "npm", "start" ]