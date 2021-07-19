FROM node:latest
COPY ["package.json", "package-lock.json", "./"]
WORKDIR /app
RUN npm install --production
COPY . .
CMD ["npm", "start"]
