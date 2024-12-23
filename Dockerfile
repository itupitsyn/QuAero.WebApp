ARG node_image=oven/bun:1

FROM $node_image AS dependencies
WORKDIR /QuAero
COPY package.json bun.lockb ./
RUN bun i

FROM $node_image AS builder
WORKDIR /QuAero
COPY . .
COPY --from=dependencies /QuAero/node_modules ./node_modules
RUN bunx prisma generate
RUN bun run build

FROM $node_image AS runner
WORKDIR /QuAero
ENV NODE_ENV=production

COPY --from=builder /QuAero/.next/standalone .
COPY --from=builder /QuAero/.next/static ./.next/static

EXPOSE 3000
CMD ["bun", "server.js"]
