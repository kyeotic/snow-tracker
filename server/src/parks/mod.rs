pub mod meadows;
pub mod ski_bowl;
pub mod timberline;

use anyhow::Result;
use scraper::Html;
use shared::{Condition, Lifts, ParkData, Snowfall};
use time::format_description::well_known::Iso8601;
use time::macros::format_description;

use crate::weather::Weather;

pub struct ParkCondition {
    pub updated_on: Option<String>,
    pub snowfalls: Vec<Snowfall>,
    pub lifts: Lifts,
    pub condition: Option<Condition>,
}

/// HTML-based park parser (Timberline, Ski Bowl).
pub trait HtmlParkParser: Send + Sync {
    fn url(&self) -> &str;
    fn parse_updated_on(&self, doc: &Html) -> Result<String>;
    fn parse_lifts(&self, doc: &Html) -> Result<Lifts>;
    fn parse_snowfall(&self, doc: &Html) -> Result<Vec<Snowfall>>;
    fn parse_conditions(&self, _doc: &Html) -> Result<Condition> {
        anyhow::bail!("no site conditions")
    }
    fn has_site_conditions(&self) -> bool {
        false
    }
}

/// Fetch + parse an HTML-based park.
pub async fn fetch_html_park(
    client: &reqwest::Client,
    parser: &dyn HtmlParkParser,
) -> Result<ParkCondition> {
    let html = client
        .get(parser.url())
        .header("User-Agent", "PostmanRuntime/7.21.0")
        .send()
        .await?
        .error_for_status()?
        .text()
        .await?;

    let doc = Html::parse_document(&html);

    let updated_on = parser.parse_updated_on(&doc).ok();
    let snowfalls = parser.parse_snowfall(&doc).unwrap_or_default();
    let lifts = parser.parse_lifts(&doc).unwrap_or_else(|_| Lifts {
        updated_on: None,
        lift_statuses: vec![],
    });

    if snowfalls.is_empty() && lifts.lift_statuses.is_empty() && updated_on.is_none() {
        let preview: String = html.chars().take(500).collect();
        tracing::warn!(
            url = parser.url(),
            html_length = html.len(),
            html_preview = %preview,
            "park fetch returned HTML but parsed no data"
        );
    }
    let condition = if parser.has_site_conditions() {
        parser.parse_conditions(&doc).ok()
    } else {
        None
    };

    Ok(ParkCondition {
        updated_on,
        snowfalls,
        lifts,
        condition,
    })
}

/// Fetch a full ParkData for an HTML-based park, combining with NOAA weather.
pub async fn fetch_html_park_data(
    client: &reqwest::Client,
    weather: &Weather,
    grid: &shared::GridPoint,
    park_url: &str,
    parser: &dyn HtmlParkParser,
) -> ParkData {
    let park_result = fetch_html_park(client, parser).await;
    let (forecast, api_condition) = tokio::join!(
        weather.get_forecast(grid),
        weather.get_conditions(grid),
    );

    match park_result {
        Ok(park) => {
            let condition = match (park.condition, api_condition.ok()) {
                (Some(mut site), Some(api)) if site.icon_class.is_empty() => {
                    site.icon_class = api.icon_class;
                    Some(site)
                }
                (Some(site), _) => Some(site),
                (None, api) => api,
            };
            ParkData {
                updated_on: park.updated_on,
                park_url: Some(park_url.to_string()),
                snowfalls: park.snowfalls,
                lifts: park.lifts,
                condition,
                forecast: forecast.ok(),
            }
        }
        Err(e) => {
            tracing::error!("park parse error: {e}");
            ParkData {
                updated_on: None,
                park_url: Some(park_url.to_string()),
                snowfalls: vec![],
                lifts: Lifts {
                    updated_on: None,
                    lift_statuses: vec![],
                },
                condition: api_condition.ok(),
                forecast: forecast.ok(),
            }
        }
    }
}

/// Format an ISO 8601 datetime string to a human-readable form like "Updated February 1, 3:48pm"
pub fn format_timestamp(s: &str) -> String {
    // Try ISO 8601 with offset (e.g. "2026-02-01T10:30:00.000-08:00")
    if let Ok(dt) = time::OffsetDateTime::parse(s, &Iso8601::DEFAULT) {
        let fmt = format_description!(
            "Updated [month repr:long] [day padding:none], [hour repr:12 padding:none]:[minute][period case:lower]"
        );
        if let Ok(formatted) = dt.format(&fmt) {
            return formatted;
        }
    }
    // Try plain ISO 8601 without fractional seconds
    if let Ok(dt) = time::PrimitiveDateTime::parse(
        s,
        &format_description!("[year]-[month]-[day]T[hour]:[minute]:[second]"),
    ) {
        let fmt = format_description!(
            "Updated [month repr:long] [day padding:none], [hour repr:12 padding:none]:[minute][period case:lower]"
        );
        if let Ok(formatted) = dt.format(&fmt) {
            return formatted;
        }
    }
    s.to_string()
}

fn try_parse_float(s: &str) -> f64 {
    let cleaned = s.replace(['"', '\u{2033}', '\u{2032}', '\u{201d}', '\u{201c}', '\u{2019}'], "");
    let trimmed = cleaned.trim();
    // Extract leading numeric portion (digits, dots, minus)
    let num_end = trimmed
        .find(|c: char| !c.is_ascii_digit() && c != '.' && c != '-')
        .unwrap_or(trimmed.len());
    trimmed[..num_end].parse::<f64>().unwrap_or(0.0)
}
