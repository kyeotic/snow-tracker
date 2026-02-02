mod config;
mod db;
mod error;
mod parks;
mod refresh;
mod routes;
mod weather;

use std::sync::Arc;

use tokio::net::TcpListener;
use tracing_subscriber;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    tracing_subscriber::fmt::init();

    let config = config::load_config()?;
    tracing::info!("loaded config");

    let db = db::Database::new()?;
    db.init()?;
    tracing::info!("initialized database");

    let state = Arc::new(routes::AppState {
        db,
        config: config.clone(),
    });

    // Spawn background refresh task
    let refresh_state = state.clone();
    tokio::spawn(async move {
        refresh::run_refresh_loop(refresh_state).await;
    });

    let app = routes::router(state);

    let listener = TcpListener::bind("0.0.0.0:3000").await?;
    tracing::info!("listening on 0.0.0.0:3000");
    axum::serve(listener, app).await?;

    Ok(())
}
