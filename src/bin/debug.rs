use snow_tracker::config::load_config;
use snow_tracker::parks::park_parser::ParkParser;
use snow_tracker::weather::{GridPoint, Weather};
use tokio;

#[tokio::main]
async fn main() {
    // weather();
    get_config();
}

async fn weather() {
    let weather = Weather::new("snow-tracker");
    let point = GridPoint {
        id: "PQR".to_owned(),
        x: 141,
        y: 88,
    };
    let forecast = weather.get_forecast(&point).await;
    println!("{:#?}", forecast.unwrap());

    let conditions = weather.get_conditions(&point).await;
    println!("{:#?}", conditions.unwrap());
}

fn get_config() {
    let c = load_config();
    println!("{:?}", c);
}

// grid:
//       id: PQR
//       x: 141
//       "y": 88
