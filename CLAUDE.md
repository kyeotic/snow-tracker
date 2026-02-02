# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Snow Tracker is a ski resort snow condition tracker for Mt. Hood resorts (Timberline, Ski Bowl, Meadows). It fetches live conditions (snowfall, lifts, forecasts) from resort websites and NOAA weather APIs.

## Build Commands

Prerequisites:
```bash
cargo install trunk
rustup target add wasm32-unknown-unknown
```

Build and run:
```bash
cargo build -p server              # Build server
cd client && trunk build           # Build client WASM → client/dist/
cargo run -p server                # Run server on :3000
```

Checks:
```bash
cargo check                        # Check entire workspace (server only, native)
cargo check -p client --target wasm32-unknown-unknown  # Check client for WASM
cargo test                         # Run tests
cargo clippy                       # Lint
```

Docker:
```bash
docker compose build               # Build image
docker compose up                  # Run at localhost:3000
```

Uses **stable Rust** toolchain.

## Architecture

### Workspace structure
Three crates in a Cargo workspace:
- **`shared/`** — Types shared between server and client (API response types, config structs). All derive `Serialize`/`Deserialize`/`PartialEq`.
- **`server/`** — Axum 0.8 REST API server with background data fetching, SQLite caching, and static file serving.
- **`client/`** — Yew 0.21 CSR single-page app compiled to WASM via Trunk.

### Server modules (`server/src/`)
- **`main.rs`** — Entry point: loads config, inits DB, spawns refresh task, starts Axum on :3000.
- **`config.rs`** — Loads `config.yaml` from current dir or parent dirs.
- **`weather.rs`** — NOAA weather API client (`api.weather.gov`). Fetches forecasts/conditions by grid point.
- **`parks/mod.rs`** — `ParkParser` trait + `fetch_and_parse()` function using `scraper` crate.
- **`parks/timberline.rs`** — Timberline Lodge HTML parser.
- **`parks/ski_bowl.rs`** — Ski Bowl HTML parser.
- **`parks/meadows.rs`** — Mt. Hood Meadows HTML parser.
- **`db.rs`** — SQLite cache layer (`rusqlite`). Single `cache` table with key/data/updated_at.
- **`refresh.rs`** — Background task: fetches all 3 parks every 5 minutes, stores in SQLite.
- **`routes.rs`** — API endpoints: `GET /api/snow`, `GET /api/snow/:park`, `POST /api/refresh`. Serves `static/` for client files.
- **`error.rs`** — `thiserror` error types.

### Client modules (`client/src/`)
- **`main.rs`** — Yew app entry, fetches `/api/snow` on mount.
- **`api.rs`** — HTTP client for `/api/snow`.
- **`components/snow_summary.rs`** — Tabbed view for 3 resorts.
- **`components/condition.rs`** — Current conditions display.
- **`components/snowfall.rs`** — Snowfall depths list.
- **`components/lifts.rs`** — Lift statuses list.
- **`components/forecasts.rs`** — NOAA forecast cards.

### Configuration
`config.yaml` at project root defines parks with their URLs and NOAA grid coordinates (office ID, grid X/Y).

### Reference implementation
`old-src/` contains the original Fresh/TypeScript version for reference.
