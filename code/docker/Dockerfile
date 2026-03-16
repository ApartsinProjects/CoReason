# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine
WORKDIR /app
RUN apk add --no-cache tini
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/server ./server
COPY --from=builder /app/client ./client
COPY --from=builder /app/content ./content
COPY --from=builder /app/prompts ./prompts
COPY --from=builder /app/scenarios ./scenarios
COPY --from=builder /app/build-content.js ./
COPY --from=builder /app/package.json ./
RUN mkdir -p logs data
ENV NODE_ENV=production
EXPOSE 3000
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "server/index.js"]
