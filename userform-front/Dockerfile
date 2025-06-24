# builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# runtime
FROM node:20-alpine
RUN npm install -g http-server
WORKDIR /app
COPY --from=builder /app/dist/userform-front /app/dist
EXPOSE 8080
CMD ["http-server", "dist", "-p", "8080", "-a", "0.0.0.0"]
