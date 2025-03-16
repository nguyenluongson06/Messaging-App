# filepath: /c:/Users/nguye/OneDrive/Documents/GitHub/Messaging-App/backend/Dockerfile
FROM node:14

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]