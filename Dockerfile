FROM node:10
WORKDIR /usr/src/app
COPY package*.json ./
Run npm i npm@latest -g
RUN npm i ajv@^6.0.0
RUN npm i
RUN npm run install-express
COPY . .
EXPOSE 8080
CMD [ "npm", "start" ]
