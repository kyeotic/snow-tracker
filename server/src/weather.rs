use anyhow::{Context, Result};
use regex::Regex;
use serde::Deserialize;
use shared::{Condition, ForecastPeriod, GridPoint, WeatherConfig};
use std::sync::LazyLock;

#[derive(Debug, Deserialize)]
struct ForecastResponse {
    properties: ForecastProperties,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct ForecastProperties {
    update_time: String,
    periods: Vec<ForecastPeriod>,
}

pub struct Weather {
    client: reqwest::Client,
    base_url: String,
    user_agent: String,
}

impl Weather {
    pub fn new(config: &WeatherConfig) -> Self {
        Self {
            client: reqwest::Client::new(),
            base_url: config.base_url.trim_end_matches('/').to_string(),
            user_agent: config.user_agent.clone(),
        }
    }

    pub async fn get_forecast(&self, point: &GridPoint) -> Result<Vec<ForecastPeriod>> {
        let resp: ForecastResponse = self
            .get(&format!(
                "gridpoints/{}/{},{}/forecast",
                point.id, point.x, point.y
            ))
            .await?;
        Ok(resp.properties.periods)
    }

    pub async fn get_conditions(&self, point: &GridPoint) -> Result<Condition> {
        let resp: ForecastResponse = self
            .get(&format!(
                "gridpoints/{}/{},{}/forecast/hourly",
                point.id, point.x, point.y
            ))
            .await?;

        let latest = resp.properties.periods.first().context("no periods")?;
        let icon_class = get_icon_class(&latest.icon)
            .map(|s| format!("weather-icon wi wi-{s}"))
            .unwrap_or_default();

        Ok(Condition {
            updated_on: Some(resp.properties.update_time),
            temperature: latest.temperature as f64,
            condition: latest.short_forecast.clone(),
            icon_class,
        })
    }

    async fn get<T: serde::de::DeserializeOwned>(&self, path: &str) -> Result<T> {
        let url = format!("{}/{}", self.base_url, path);
        Ok(self
            .client
            .get(&url)
            .header("User-Agent", &self.user_agent)
            .header("Accept", "application/json")
            .send()
            .await?
            .error_for_status()?
            .json()
            .await?)
    }
}

static ICON_REGEX: LazyLock<Regex> =
    LazyLock::new(|| Regex::new(r"land/(.+?)/(.+?)[?,]").unwrap());

fn get_icon_class(icon: &str) -> Option<String> {
    let caps = ICON_REGEX.captures(icon)?;
    Some(format!("{}-{}", &caps[1], &caps[2]))
}
