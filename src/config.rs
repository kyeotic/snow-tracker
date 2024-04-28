use std::path::PathBuf;

use crate::weather::GridPoint;
use serde::Deserialize;
use url::Url;

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AppConfig {
    pub time_zone: String,
    pub weather: WeatherConfig,
    pub timberline: ParkConfig,
    pub ski_bowl: ParkConfig,
    pub meadows: ParkConfig,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct WeatherConfig {
    pub user_agent: String,
    pub base_url: Url,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ParkConfig {
    pub time_zone: String,
    pub park_url: Url,
    pub noaa_url: Url,
    pub weather: ParkWeatherConfig,
}

#[derive(Debug, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct ParkWeatherConfig {
    pub office: String,
    pub grid: GridPoint,
}

pub fn load_config() -> AppConfig {
    // Get potential config dirs
    let dirs = get_config_dirs();

    let file = dirs
        .iter()
        .map(|path| std::fs::File::open(path.join("config.yaml")))
        .find(|f| f.is_ok());

    if let Some(f) = file {
        serde_yaml::from_reader(f.as_ref().unwrap()).unwrap()
    } else {
        println!();
        panic!("config file not found in: {:?}", dirs)
    }
}

fn get_config_dirs() -> Vec<PathBuf> {
    /*
      There are three possible cases for the current executale

      1. Running as a cargo bin
      2. Running as a cargo main bin
      3. Running as a compiled app

      The first two cases are off by one directory, while the compiled app is CURRENTLY UNKNOWN
      For now, just walk up 3 dirs and check
    */

    let mut rsrc_dir = std::env::current_exe().expect("Can't find path to executable");

    (0..4)
        .map(|_| {
            let d = rsrc_dir.clone();
            rsrc_dir.pop();
            d
        })
        .collect()
}
