use std::sync::Arc;

use shared::{ParkData, ParkStatus};
use tracing::{error, info};

use crate::parks::{self, ski_bowl::SkiBowl, timberline::Timberline};
use crate::routes::AppState;
use crate::weather::Weather;

pub async fn run_refresh_loop(state: Arc<AppState>) {
    // Run immediately on startup
    refresh_all(&state).await;

    let mut interval = tokio::time::interval(std::time::Duration::from_secs(300));
    interval.tick().await; // skip first immediate tick
    loop {
        interval.tick().await;
        refresh_all(&state).await;
    }
}

pub async fn refresh_all_public(state: &AppState) {
    refresh_all(state).await;
}

async fn refresh_all(state: &AppState) {
    info!("refreshing park data");
    let weather = Weather::new(&state.config.weather);
    let client = reqwest::Client::new();

    let timberline_parser =
        Timberline::new(&state.config.timberline.park_url, &state.config.timberline.time_zone);
    let ski_bowl_parser =
        SkiBowl::new(&state.config.ski_bowl.park_url, &state.config.ski_bowl.time_zone);

    let (timberline, ski_bowl, meadows) = tokio::join!(
        parks::fetch_html_park_data(
            &client,
            &weather,
            &state.config.timberline.weather.grid,
            &state.config.timberline.park_url,
            &timberline_parser,
        ),
        parks::fetch_html_park_data(
            &client,
            &weather,
            &state.config.ski_bowl.weather.grid,
            &state.config.ski_bowl.park_url,
            &ski_bowl_parser,
        ),
        parks::meadows::fetch_meadows_data(
            &client,
            &weather,
            &state.config.meadows.weather.grid,
            &state.config.meadows.park_url,
        ),
    );

    let now = chrono_now();

    store_park(state, "timberline", &now, timberline);
    store_park(state, "ski_bowl", &now, ski_bowl);
    store_park(state, "meadows", &now, meadows);

    info!("refresh complete");
}

fn store_park(state: &AppState, key: &str, now: &str, data: ParkData) {
    let status = ParkStatus {
        checked_on: Some(now.to_string()),
        status: Some(data),
    };
    match serde_json::to_string(&status) {
        Ok(json) => {
            if let Err(e) = state.db.set_cached(key, &json) {
                error!("failed to cache {key}: {e}");
            }
        }
        Err(e) => error!("failed to serialize {key}: {e}"),
    }
}

fn chrono_now() -> String {
    time::OffsetDateTime::now_utc()
        .format(&time::format_description::well_known::Rfc3339)
        .unwrap_or_else(|_| "unknown".to_string())
}
