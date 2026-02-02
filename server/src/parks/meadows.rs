use anyhow::Result;
use serde::Deserialize;
use shared::{Condition, GridPoint, LiftStatus, Lifts, ParkData, Snowfall};

use crate::weather::Weather;

const REPORT_URL: &str =
    "https://www.skihood.com/api/weather/report?includeResortInfo=true&includeSnowInfo=true";
const LIFTS_URL: &str = "https://www.skihood.com/api/weather/poi?include=Lifts";

/// Fetch Meadows data from their JSON APIs (not HTML scraping).
pub async fn fetch_meadows_data(
    client: &reqwest::Client,
    weather: &Weather,
    grid: &GridPoint,
    park_url: &str,
) -> ParkData {
    let (report, lifts_resp, forecast, api_condition) = tokio::join!(
        fetch_report(client),
        fetch_lifts(client),
        weather.get_forecast(grid),
        weather.get_conditions(grid),
    );

    let mut snowfalls = vec![];
    let mut updated_on = None;
    let mut condition = api_condition.ok();

    if let Ok(report) = report {
        if let Some(snow) = &report.data.snow {
            // Extract snow data from zones
            for zone in &snow.snow_zones {
                let prefix = match zone.altitude_level.as_str() {
                    "LOW" => "Base",
                    "INT" => "Mid-Mtn",
                    "HIGH" => "Summit",
                    _ => &zone.name,
                };

                if let Some(d) = &zone.snow_total_depth {
                    snowfalls.push(Snowfall {
                        since: format!("{prefix} Depth"),
                        depth: d.country_value,
                    });
                }
            }

            // Use first zone for recent snowfall
            if let Some(zone) = snow.snow_zones.first() {
                if let Some(d) = &zone.overnight {
                    snowfalls.push(Snowfall {
                        since: "Overnight".to_string(),
                        depth: d.country_value,
                    });
                }
                if let Some(d) = &zone.fresh_snow_fall_depth_24h {
                    snowfalls.push(Snowfall {
                        since: "24 Hours".to_string(),
                        depth: d.country_value,
                    });
                }
                if let Some(d) = &zone.fresh_snow_fall_depth_48h {
                    snowfalls.push(Snowfall {
                        since: "48 Hours".to_string(),
                        depth: d.country_value,
                    });
                }
                if let Some(d) = &zone.snow_fall_depth_complete_season {
                    snowfalls.push(Snowfall {
                        since: "Season Total".to_string(),
                        depth: d.country_value,
                    });
                }

                updated_on = zone.last_modified.as_deref().map(super::format_timestamp);
            }

            // Use custom temp data if available
            if let Some(custom) = &snow.custom_temp {
                if let Some(base) = &custom.base_area {
                    condition = Some(Condition {
                        updated_on: updated_on.clone(),
                        temperature: base.air_temp_f.unwrap_or(0.0),
                        condition: "At Base".to_string(),
                        icon_class: condition
                            .as_ref()
                            .map(|c| c.icon_class.clone())
                            .unwrap_or_default(),
                    });
                }
            }
        }
    }

    let lift_statuses = match lifts_resp {
        Ok(resp) => resp
            .data
            .into_iter()
            .flat_map(|sector| sector.lifts)
            .map(|lift| {
                let hours = lift
                    .opening_times_real
                    .first()
                    .map(|t| format!("{} - {}", t.begin_time, t.end_time))
                    .unwrap_or_default();
                LiftStatus {
                    name: lift.name,
                    status: format_status(&lift.opening_status),
                    hours,
                }
            })
            .collect(),
        Err(e) => {
            tracing::error!("meadows lifts error: {e}");
            vec![]
        }
    };

    ParkData {
        updated_on,
        park_url: Some(park_url.to_string()),
        snowfalls,
        lifts: Lifts {
            updated_on: None,
            lift_statuses,
        },
        condition,
        forecast: forecast.ok(),
    }
}

fn format_status(status: &str) -> String {
    match status {
        "OPEN" => "Open".to_string(),
        "CLOSED" => "Closed".to_string(),
        "FORECAST" => "Expected".to_string(),
        "GROOMING" => "Grooming".to_string(),
        other => other.to_string(),
    }
}

async fn fetch_report(client: &reqwest::Client) -> Result<ReportResponse> {
    Ok(client
        .get(REPORT_URL)
        .header("User-Agent", "Mozilla/5.0")
        .send()
        .await?
        .error_for_status()?
        .json()
        .await?)
}

async fn fetch_lifts(client: &reqwest::Client) -> Result<LiftsResponse> {
    Ok(client
        .get(LIFTS_URL)
        .header("User-Agent", "Mozilla/5.0")
        .send()
        .await?
        .error_for_status()?
        .json()
        .await?)
}

// --- API response types ---

#[derive(Debug, Deserialize)]
struct ReportResponse {
    data: ReportData,
}

#[derive(Debug, Deserialize)]
struct ReportData {
    snow: Option<SnowData>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct SnowData {
    snow_zones: Vec<SnowZone>,
    custom_temp: Option<CustomTemp>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct SnowZone {
    name: String,
    altitude_level: String,
    snow_total_depth: Option<Measurement>,
    overnight: Option<Measurement>,
    fresh_snow_fall_depth_24h: Option<Measurement>,
    fresh_snow_fall_depth_48h: Option<Measurement>,
    snow_fall_depth_complete_season: Option<Measurement>,
    last_modified: Option<String>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
#[allow(dead_code)]
struct Measurement {
    country_value: f64,
    country_unit: String,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct CustomTemp {
    base_area: Option<BaseAreaTemp>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct BaseAreaTemp {
    air_temp_f: Option<f64>,
}

#[derive(Debug, Deserialize)]
struct LiftsResponse {
    data: Vec<LiftSector>,
}

#[derive(Debug, Deserialize)]
struct LiftSector {
    lifts: Vec<LiftData>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct LiftData {
    name: String,
    opening_status: String,
    #[serde(default)]
    opening_times_real: Vec<LiftTime>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct LiftTime {
    begin_time: String,
    end_time: String,
}
