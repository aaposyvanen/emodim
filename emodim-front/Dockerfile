FROM node:16
COPY ["package.json", "package-lock.json", "./"]
WORKDIR /app
RUN npm install --production
COPY . .
CMD ["npm", "start"]
