ARG bun_image=oven/bun:1

FROM $bun_image AS builder

WORKDIR /QuAero
COPY . .
RUN bun i
RUN bunx prisma generate
RUN bun run build

FROM $bun_image AS runner

WORKDIR /QuAero
ENV NODE_ENV=production

COPY --from=builder /QuAero/.next/standalone .
COPY --from=builder /QuAero/.next/static ./.next/static

EXPOSE 3000
CMD ["bun", "server.js"]
