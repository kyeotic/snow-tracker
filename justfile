default:
    @just --list

# Run the server locally
run:
    cargo run -p server

# Build in release mode
build:
    cargo build --release -p server

# Build client WASM
build-client:
    cd client && trunk build --release

# Check compilation without building
check:
    cargo check -p shared -p server

# Check client WASM compilation
check-client:
    cargo check -p client --target wasm32-unknown-unknown

# Run tests
test:
    cargo test

# Run clippy lints
lint:
    cargo clippy -- -D warnings

# Format code
fmt:
    cargo fmt

# Check formatting without modifying files
fmt-check:
    cargo fmt -- --check

# Build Docker image
docker-build:
    docker build -t docker.local.kye.dev/snow-tracker:latest .

# Run Docker image locally
docker-run:
    docker run --rm -p 3000:3000 -v snow-data:/data docker.local.kye.dev/snow-tracker:latest

# Build and push Docker image
deploy:
    docker build --platform linux/amd64 -t docker.local.kye.dev/snow-tracker:latest .
    docker push docker.local.kye.dev/snow-tracker:latest

# Check health / fetch snow data
health:
    curl -s http://localhost:3000/api/snow | head -c 200

# Trigger manual refresh
refresh:
    curl -s -X POST http://localhost:3000/api/refresh
