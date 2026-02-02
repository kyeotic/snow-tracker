# Stage 1: Build server
FROM rust:1.84 AS server-builder
WORKDIR /app
COPY . .
RUN cargo build --release -p server

# Stage 2: Build client WASM
FROM rust:1.84 AS client-builder
RUN cargo install trunk
RUN rustup target add wasm32-unknown-unknown
WORKDIR /app
COPY . .
RUN cd client && trunk build --release

# Stage 3: Runtime
FROM debian:bookworm-slim
RUN apt-get update && apt-get install -y ca-certificates sqlite3 && rm -rf /var/lib/apt/lists/*
COPY --from=server-builder /app/target/release/server /usr/local/bin/server
COPY --from=client-builder /app/client/dist /app/static
COPY config.yaml /app/config.yaml
WORKDIR /app
ENV DB_PATH=/data/snow.db
ENV STATIC_DIR=/app/static
EXPOSE 3000
CMD ["server"]
