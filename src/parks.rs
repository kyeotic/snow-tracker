use std::fmt;

use crate::{
    config::{AppConfig, ParkConfig},
    weather::{Forecast, Weather, WeatherCondition},
};
use serde::Serialize;
use time::OffsetDateTime;

use self::{park_parser::ParkParser, timberline::Timberline};

pub mod park_parser;
pub mod timberline;

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ParkReport {
    #[serde(with = "time::serde::rfc3339")]
    pub checked_on: OffsetDateTime,
    pub timberline: Park,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Park {
    #[serde(with = "time::serde::timestamp::option")]
    pub updated_on: Option<OffsetDateTime>,
    pub condition: Option<WeatherCondition>,
    pub forecast: Option<Forecast>,
    pub snowfalls: Option<Vec<Snowfall>>,
    pub lifts: Option<Lifts>,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Snowfall {
    pub since: String,
    pub depth: f64,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Lifts {
    #[serde(with = "time::serde::rfc3339")]
    pub updated_on: OffsetDateTime,
    pub statuses: Vec<LiftStatus>,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct LiftStatus {
    pub name: String,
    pub status: String,
    pub hours: String,
}

pub struct SnowStore<'a> {
    config: AppConfig,
    client: reqwest::Client,
    weather: Weather,
    timberline: ParkStore<'a>,
}

impl<'a> SnowStore<'a> {
    fn new(config: AppConfig) -> Self {
        let client = reqwest::Client::new();
        let weather = Weather::new(client, config.weather);

        Self {
            config,
            client,
            weather,
            timberline: ParkStore::new(
                &client,
                &config.timberline,
                &weather,
                Timberline::new(&config.timberline.park_url, client),
            ),
        }
    }

    async fn get_park_report(&self) -> ParkReport {
        ParkReport {
            checked_on: OffsetDateTime::now_utc(),
            timberline: self.timberline.get_park_status().await,
        }
    }
}

pub struct ParkStore<'a> {
    client: &'a reqwest::Client,
    config: &'a ParkConfig,
    weather: &'a Weather,
    parser: Box<dyn ParkParser>,
}

impl<'a> ParkStore<'a> {
    fn new(
        client: &'a reqwest::Client,
        config: &'a ParkConfig,
        weather: &'a Weather,
        parser: impl ParkParser,
    ) -> Self {
        Self {
            client,
            config,
            weather,
            parser: Box::new(parser),
        }
    }

    async fn get_park_status(&self) -> Park {
        let (p, condition, forecast) = futures::join!(
            self.parser.get_park_conditions(),
            self.weather.get_conditions(&self.config.weather.grid),
            self.weather.get_forecast(&self.config.weather.grid)
        );
        let park = or_log(p, "park conditions");
        Park {
            updated_on: park.and_then(|p| p.updated_on),
            snowfalls: park.and_then(|p| p.snowfalls),
            lifts: park.and_then(|p| p.lifts),
            condition: condition.ok(),
            forecast: forecast.ok(),
        }
    }
}

fn or_log<T, E>(result: Result<T, E>, msg: &str) -> Option<T>
where
    E: fmt::Debug,
{
    match result {
        Ok(t) => Some(t),
        Err(e) => {
            println!("{} {:?}", msg, e);
            None
        }
    }
}
