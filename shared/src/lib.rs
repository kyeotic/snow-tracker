use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SnowReport {
    pub timberline: ParkStatus,
    pub ski_bowl: ParkStatus,
    pub meadows: ParkStatus,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ParkStatus {
    pub checked_on: Option<String>,
    pub status: Option<ParkData>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ParkData {
    pub updated_on: Option<String>,
    pub park_url: Option<String>,
    pub snowfalls: Vec<Snowfall>,
    pub lifts: Lifts,
    pub condition: Option<Condition>,
    pub forecast: Option<Vec<ForecastPeriod>>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Snowfall {
    pub since: String,
    pub depth: f64,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Lifts {
    pub updated_on: Option<String>,
    pub lift_statuses: Vec<LiftStatus>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LiftStatus {
    pub name: String,
    pub status: String,
    pub hours: String,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Condition {
    pub updated_on: Option<String>,
    pub temperature: f64,
    pub condition: String,
    pub icon_class: String,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
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

// Config types
#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AppConfig {
    pub time_zone: String,
    pub weather: WeatherConfig,
    pub timberline: ParkConfig,
    pub ski_bowl: ParkConfig,
    pub meadows: ParkConfig,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct WeatherConfig {
    pub user_agent: String,
    pub base_url: String,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ParkConfig {
    pub time_zone: String,
    pub park_url: String,
    pub noaa_url: String,
    pub weather: ParkWeatherConfig,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ParkWeatherConfig {
    pub office: String,
    pub station: Option<String>,
    pub grid: GridPoint,
}

#[derive(Debug, Clone, Deserialize)]
pub struct GridPoint {
    pub id: String,
    pub x: i32,
    pub y: i32,
}
