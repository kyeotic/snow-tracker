# Snow Tracker Refactor Plan

## Target Architecture

**Two-crate workspace:**
- `server/` — Axum REST API + background data fetcher + serves static files (including WASM)
- `client/` — Yew CSR single-page app compiled to WASM

**Stack:** Rust stable (drop nightly requirement), Axum 0.8, Yew 0.21, SQLite (via rusqlite), scraper crate, Docker deployment.

---

## Phase 1: Project Scaffolding

### 1.1 Create Cargo workspace
- Root `Cargo.toml` as workspace with members `server`, `client`, `shared`
- `shared/` crate for types used by both (API response types, config structs)
- Remove old Leptos deps, `deno.jsonc`, `run.ts`, `index.html`, `rust-toolchain.toml` (switch to stable)

### 1.2 Shared crate (`shared/`)
Port from old-src types + existing Rust types:
- `ParkReport`, `SnowStatus`, `Snowfall`, `Lifts`, `LiftStatus`, `Condition`, `ForecastPeriod`
- `AppConfig`, `ParkConfig` (from existing `config.rs`)
- Derive `Serialize`/`Deserialize` on all types

### 1.3 Server crate (`server/`)
Dependencies: `axum 0.8`, `tokio`, `reqwest`, `scraper`, `rusqlite` (with `bundled` feature), `serde`/`serde_json`/`serde_yaml`, `time`, `regex`, `tracing`/`tracing-subscriber`, `anyhow`/`thiserror`

### 1.4 Client crate (`client/`)
Dependencies: `yew 0.21`, `gloo`, `reqwasm`, `serde`/`serde_json`, `shared` (path dep)
Build with `trunk` → outputs to `client/dist/`

---

## Phase 2: Server Backend

### 2.1 Config (`server/src/config.rs`)
- Port existing `config.rs` (mostly done, move to server crate, reference shared types)

### 2.2 Weather client (`server/src/weather.rs`)
- Port existing `weather.rs` (mostly done)
- Switch from `tl` to work with shared types
- Use `thiserror` for typed errors instead of raw `anyhow`

### 2.3 Park parsers (`server/src/parks/`)
- `mod.rs` — `ParkParser` trait, `get_park_conditions()` default impl using `scraper`
- `timberline.rs` — Port selectors from `old-src/worker/conditions/timberline.ts`
  - Lifts: `#lift_status table:first-of-type tbody tr`
  - Snowfall: `.conditions-panel` filtered, `dl dt`
  - Updated: `.conditions-panel p:first`
- `ski_bowl.rs` — Port from `old-src/worker/conditions/skiBowl.ts`
  - Lifts: `#intro #liststatuses tr`
  - Snowfall: `#liststatuses td` filtered
  - Updated: `#liststatuses tr` Date/Time rows
- `meadows.rs` — Port from `old-src/worker/conditions/meadows.ts`
  - Lifts: `#liftGrid tbody tr`
  - Snowfall: `.snowdepth-*` data attributes
  - Updated: `.conditions-info.lift-operations p:first`

### 2.4 SQLite cache (`server/src/db.rs`)
- Single table: `cache(key TEXT PRIMARY KEY, data TEXT, updated_at INTEGER)`
- Keys: `timberline`, `ski_bowl`, `meadows`
- Functions: `get_cached(key)`, `set_cached(key, data)`
- DB file at `/data/snow.db` (Docker volume mount) or `./snow.db` locally

### 2.5 Background refresh (`server/src/refresh.rs`)
- Tokio spawn a task that runs every 5 minutes
- Fetches all 3 parks in parallel (`tokio::join!`)
- Stores results in SQLite
- Shared state via `Arc<AppState>` containing db handle + config

### 2.6 API routes (`server/src/routes.rs`)
- `GET /api/snow` — Returns all 3 parks' cached data as JSON
- `GET /api/snow/:park` — Returns single park data
- `POST /api/refresh` — Trigger manual refresh
- Static file serving: serve `client/dist/` at `/`

### 2.7 Main entry (`server/src/main.rs`)
- Load config, init DB, init tracing
- Spawn background refresh task
- Start Axum server on `0.0.0.0:3000`

---

## Phase 3: Yew Frontend

### 3.1 App shell (`client/src/main.rs`)
- Yew app with router (yew-router)
- Single route `/` → `Home` component
- Fetch from `/api/snow` on mount

### 3.2 Components (port from `old-src/components/`)
- `snow_summary.rs` — Tabbed view (Meadows/Timberline/Ski Bowl), uses shared types
- `condition.rs` — Temperature + weather icon + condition text
- `snowfall.rs` — Snowfall depths list
- `lifts.rs` — Lift statuses list
- `forecasts.rs` — NOAA forecast cards

### 3.3 Styling
- Copy `public/css/` (reset.css, weather-icons/) into `client/`
- Port styles from `old-src/static/css/snow.css`
- Reference in `client/index.html` (Trunk template)

---

## Phase 4: Docker & Deployment

### 4.1 Multi-stage Dockerfile
```dockerfile
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
EXPOSE 3000
CMD ["server"]
```

### 4.2 docker-compose.yml
```yaml
services:
  snow-tracker:
    image: docker.local.kye.ev/snow-tracker:latest
    build: .
    ports:
      - "3000:3000"
    volumes:
      - snow-data:/data
    labels:
      stook.image: "snow-tracker"

volumes:
  snow-data:
```

### 4.3 CI/Build script
- `scripts/build` — Build and push to `docker.local.kye.ev/snow-tracker:latest`
- Remove old Terraform infra (or leave for reference)

---

## Phase 5: Cleanup & Polish

### 5.1 Linting & error handling
- Add `clippy.toml` or workspace-level clippy config
- Use `thiserror` for library errors, `anyhow` only in `main.rs`
- Add `#![deny(clippy::all, clippy::pedantic)]` with targeted allows
- `.cargo/config.toml` for default clippy flags

### 5.2 Remove old code
- Delete `old-src/` (or archive to a branch)
- Delete `src/` (old Leptos code)
- Delete `infra/`, `scripts/deploy*`, `deno.jsonc`, `run.ts`, `index.html`
- Update `CLAUDE.md` and `README.md`

### 5.3 Tests
- Unit tests for each park parser (with saved HTML fixtures)
- Unit tests for weather response parsing
- Integration test for API routes

---

## Verification

1. `cargo check` — workspace compiles
2. `cargo test` — parser and weather tests pass
3. `cargo clippy` — no warnings
4. `cd client && trunk build` — WASM builds
5. `docker compose build` — image builds
6. `docker compose up` — app serves at localhost:3000, shows park data
7. Manual: visit localhost:3000, verify all 3 resort tabs work, forecasts display

---

## File Structure (Final)

```
snow-tracker/
├── Cargo.toml              # Workspace
├── config.yaml
├── Dockerfile
├── docker-compose.yml
├── .cargo/config.toml      # Clippy settings
├── shared/
│   ├── Cargo.toml
│   └── src/lib.rs          # Types: ParkReport, Snowfall, Lifts, Condition, ForecastPeriod, Config
├── server/
│   ├── Cargo.toml
│   └── src/
│       ├── main.rs         # Entry: config, db, tracing, spawn refresh, axum server
│       ├── config.rs       # YAML config loader
│       ├── db.rs           # SQLite cache layer
│       ├── weather.rs      # NOAA API client
│       ├── refresh.rs      # Background fetch task
│       ├── routes.rs       # API endpoints + static file serving
│       ├── error.rs        # thiserror types
│       └── parks/
│           ├── mod.rs      # ParkParser trait
│           ├── timberline.rs
│           ├── ski_bowl.rs
│           └── meadows.rs
├── client/
│   ├── Cargo.toml
│   ├── index.html          # Trunk template
│   ├── Trunk.toml
│   └── src/
│       ├── main.rs         # Yew app + router
│       ├── components/
│       │   ├── snow_summary.rs
│       │   ├── condition.rs
│       │   ├── snowfall.rs
│       │   ├── lifts.rs
│       │   └── forecasts.rs
│       └── api.rs          # Fetch /api/snow
├── public/                 # Static assets (CSS, icons, manifest)
│   └── css/
└── tests/
    └── fixtures/           # Saved resort HTML for parser tests
```
