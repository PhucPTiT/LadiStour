FROM node:20-alpine AS base
WORKDIR /app

# Compatibility package commonly needed by Next.js native dependencies on Alpine.
RUN apk add --no-cache libc6-compat

FROM base AS deps
COPY package.json package-lock.json ./
RUN npm install

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
COPY .env .env
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

COPY package.json package-lock.json ./
RUN npm install --omit=dev && npm cache clean --force

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/messages ./messages
COPY --from=builder /app/next.config.ts ./next.config.ts

EXPOSE 3000
CMD ["npm", "run", "start"]
