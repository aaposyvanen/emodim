FROM node:latest
COPY ["package.json", "./"]
WORKDIR /app
RUN npm install --production
COPY . .
CMD ["npm", "start"]