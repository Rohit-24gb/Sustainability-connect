FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .
RUN mkdir -p upload/images

ENV NODE_ENV=production
EXPOSE 4000

CMD ["npm", "start"]
