use std::sync::Arc;

use shared::{ParkConfig, ParkData, ParkStatus};
use tracing::{error, info};

use crate::parks::{self, meadows::Meadows, ski_bowl::SkiBowl, timberline::Timberline, ParkParser};
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

    let (timberline, ski_bowl, meadows) = tokio::join!(
        fetch_park(&client, &weather, &state.config.timberline, "timberline"),
        fetch_park(&client, &weather, &state.config.ski_bowl, "ski_bowl"),
        fetch_park(&client, &weather, &state.config.meadows, "meadows"),
    );

    let now = chrono_now();

    store_park(state, "timberline", &now, timberline);
    store_park(state, "ski_bowl", &now, ski_bowl);
    store_park(state, "meadows", &now, meadows);

    info!("refresh complete");
}

async fn fetch_park(
    client: &reqwest::Client,
    weather: &Weather,
    config: &ParkConfig,
    name: &str,
) -> Option<ParkData> {
    let parser: Box<dyn ParkParser> = match name {
        "timberline" => Box::new(Timberline::new(&config.park_url, &config.time_zone)),
        "ski_bowl" => Box::new(SkiBowl::new(&config.park_url, &config.time_zone)),
        "meadows" => Box::new(Meadows::new(&config.park_url, &config.time_zone)),
        _ => return None,
    };

    let park_result = parks::fetch_and_parse(client, parser.as_ref()).await;
    let (forecast, api_condition) = tokio::join!(
        weather.get_forecast(&config.weather.grid),
        weather.get_conditions(&config.weather.grid),
    );

    match park_result {
        Ok((park, site_condition)) => {
            let condition = site_condition.or(api_condition.ok());
            Some(ParkData {
                updated_on: park.updated_on,
                snowfalls: park.snowfalls,
                lifts: park.lifts,
                condition,
                forecast: forecast.ok(),
            })
        }
        Err(e) => {
            error!("failed to fetch {name}: {e}");
            Some(ParkData {
                updated_on: None,
                snowfalls: vec![],
                lifts: shared::Lifts {
                    updated_on: None,
                    lift_statuses: vec![],
                },
                condition: api_condition.ok(),
                forecast: forecast.ok(),
            })
        }
    }
}

fn store_park(state: &AppState, key: &str, now: &str, data: Option<ParkData>) {
    let status = ParkStatus {
        checked_on: Some(now.to_string()),
        status: data,
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
    // Simple ISO 8601 timestamp using time crate
    time::OffsetDateTime::now_utc()
        .format(&time::format_description::well_known::Rfc3339)
        .unwrap_or_else(|_| "unknown".to_string())
}
