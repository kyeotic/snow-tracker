use anyhow::{Context, Ok, Result};
use lazy_static::lazy_static;
use regex::Regex;
use serde::{de::DeserializeOwned, Deserialize, Serialize};
use time::OffsetDateTime;
use url::Url;

use crate::config::WeatherConfig;

#[derive(Debug, Deserialize, Clone)]
pub struct GridPoint {
    pub id: String,
    pub x: i32,
    pub y: i32,
}

#[derive(Debug, Deserialize)]
struct ForecastResponse {
    properties: Forecast,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct Forecast {
    #[serde(with = "time::serde::rfc3339", rename(deserialize = "updateTime"))]
    pub updated_on: OffsetDateTime,
    pub periods: Vec<ForecastPeriod>,
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ForecastPeriod {
    pub number: i32,
    pub name: String,
    pub start_time: String,
    pub end_time: String,
    pub is_daytime: bool,
    pub temperature: i32,
    pub temperature_unit: String,
    pub temperature_trend: Option<String>,
    pub wind_speed: String,
    pub wind_direction: String,
    pub icon: String,
    pub short_forecast: String,
    pub detailed_forecast: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct WeatherCondition {
    #[serde(with = "time::serde::rfc3339", rename(deserialize = "updateTime"))]
    pub updated_on: OffsetDateTime,
    pub temperature: i32,
    pub condition: String,
    pub icon_class: Option<String>,
}

pub struct Weather {
    client: reqwest::Client,
    host: Url,
    user_agent: String,
}

impl Weather {
    pub fn new(client: reqwest::Client, config: WeatherConfig) -> Self {
        Self {
            client,
            host: config.base_url,
            user_agent: config.user_agent.to_owned(),
        }
    }

    pub async fn get_forecast(&self, point: &GridPoint) -> Result<Forecast> {
        let response: ForecastResponse = self
            .get(&format!(
                "gridpoints/{}/{},{}/forecast",
                point.id, point.x, point.y
            ))
            .await?;

        Ok(response.properties)
    }

    pub async fn get_conditions(&self, point: &GridPoint) -> Result<WeatherCondition> {
        let response: ForecastResponse = self
            .get(&format!(
                "gridpoints/{}/{},{}/forecast/hourly",
                point.id, point.x, point.y
            ))
            .await?;

        let forecast = response.properties;
        let lastest = forecast.periods.first().context("no periods")?;

        Ok(WeatherCondition {
            updated_on: forecast.updated_on,
            temperature: lastest.temperature,
            condition: lastest.short_forecast.to_owned(),
            icon_class: get_icon_class(&lastest.icon),
        })
    }

    async fn get<T: DeserializeOwned>(&self, path: &str) -> Result<T> {
        use reqwest::header::USER_AGENT;

        Ok(self
            .client
            .get(
                self.host
                    .join(path)
                    .context("Failed to join Weather Host Path")?,
            )
            .header(USER_AGENT, &self.user_agent)
            .send()
            .await?
            .json()
            .await?)
    }
}

lazy_static! {
    static ref ICON_MATCH: Regex = Regex::new(r"land/(.+?)/(.+?)[?,]").unwrap();
}

fn get_icon_class(icon: &str) -> Option<String> {
    let Some(groups) = ICON_MATCH.captures(icon) else {
        return None;
    };
    Some([&groups[1], &groups[2]].join("-"))
}
