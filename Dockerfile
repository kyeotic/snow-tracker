# syntax=docker/dockerfile:1.7

############################
# 1. Server dependency build
############################
FROM rust:1.88-slim AS server-deps
WORKDIR /app

COPY Cargo.toml Cargo.lock ./
COPY shared/Cargo.toml shared/Cargo.toml
COPY server/Cargo.toml server/Cargo.toml
COPY client/Cargo.toml client/Cargo.toml

RUN mkdir -p shared/src server/src client/src \
 && echo "" > shared/src/lib.rs \
 && echo "fn main() {}" > server/src/main.rs \
 && echo "fn main() {}" > client/src/main.rs

RUN --mount=type=cache,target=/usr/local/cargo/registry \
    --mount=type=cache,target=/usr/local/cargo/git \
    --mount=type=cache,target=/app/target \
    cargo build --release -p server \
    && cp /app/target/release/server /app/server


############################
# 2. Server build
############################
FROM rust:1.88-slim AS server-builder
WORKDIR /app

COPY --from=server-deps /app /app
COPY shared/src shared/src
COPY server/src server/src

RUN --mount=type=cache,target=/usr/local/cargo/registry \
    --mount=type=cache,target=/usr/local/cargo/git \
    --mount=type=cache,target=/app/target \
    cargo build --release -p server


############################
# 3. Client dependency build
############################
FROM rust:1.88-slim AS client-deps
WORKDIR /app

RUN rustup target add wasm32-unknown-unknown \
 && cargo install trunk --locked

COPY Cargo.toml Cargo.lock ./
COPY client/ client/
COPY shared/ shared/
COPY server/Cargo.toml server/Cargo.toml

RUN mkdir -p server/src \
 && echo "fn main() {}" > server/src/main.rs

RUN --mount=type=cache,target=/usr/local/cargo/registry \
    --mount=type=cache,target=/usr/local/cargo/git \
    --mount=type=cache,target=/app/target \
    cd client && trunk build --release


############################
# 4. Client build
############################
FROM client-deps AS client-builder
WORKDIR /app

COPY client/src client/src
COPY shared/src shared/src

RUN --mount=type=cache,target=/usr/local/cargo/registry \
    --mount=type=cache,target=/usr/local/cargo/git \
    --mount=type=cache,target=/app/target \
    cd client && trunk build --release


############################
# 5. Runtime (distroless)
############################
FROM gcr.io/distroless/cc-debian12 AS runtime

WORKDIR /app

COPY --from=server-builder /app/server /server
COPY --from=client-builder /app/client/dist /app/static
COPY config.yaml /app/config.yaml

ENV DB_PATH=/data/snow.db
ENV STATIC_DIR=/app/static

EXPOSE 3000
USER nonroot:nonroot
ENTRYPOINT ["/server"]
