use std::sync::Arc;

use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::Json,
    routing::{get, post},
    Router,
};
use shared::{AppConfig, ParkStatus, SnowReport};
use tower_http::services::ServeDir;

use crate::db::Database;

pub struct AppState {
    pub db: Database,
    pub config: AppConfig,
}

pub fn router(state: Arc<AppState>) -> Router {
    Router::new()
        .route("/api/snow", get(get_all_snow))
        .route("/api/snow/{park}", get(get_park_snow))
        .route("/api/refresh", post(trigger_refresh))
        .fallback_service(ServeDir::new(static_dir()).append_index_html_on_directories(true))
        .with_state(state)
}

async fn get_all_snow(State(state): State<Arc<AppState>>) -> Result<Json<SnowReport>, StatusCode> {
    let timberline = load_park(&state.db, "timberline");
    let ski_bowl = load_park(&state.db, "ski_bowl");
    let meadows = load_park(&state.db, "meadows");

    Ok(Json(SnowReport {
        timberline,
        ski_bowl,
        meadows,
    }))
}

async fn get_park_snow(
    State(state): State<Arc<AppState>>,
    Path(park): Path<String>,
) -> Result<Json<ParkStatus>, StatusCode> {
    let key = match park.as_str() {
        "timberline" => "timberline",
        "ski-bowl" | "ski_bowl" | "skiBowl" => "ski_bowl",
        "meadows" => "meadows",
        _ => return Err(StatusCode::NOT_FOUND),
    };
    Ok(Json(load_park(&state.db, key)))
}

async fn trigger_refresh(State(state): State<Arc<AppState>>) -> StatusCode {
    let state_clone = state.clone();
    tokio::spawn(async move {
        crate::refresh::refresh_all_public(&state_clone).await;
    });
    StatusCode::ACCEPTED
}

fn static_dir() -> String {
    std::env::var("STATIC_DIR").unwrap_or_else(|_| "client/dist".to_string())
}

fn load_park(db: &Database, key: &str) -> ParkStatus {
    db.get_cached(key)
        .ok()
        .flatten()
        .and_then(|json| serde_json::from_str(&json).ok())
        .unwrap_or(ParkStatus {
            checked_on: None,
            status: None,
        })
}
