pub mod meadows;
pub mod ski_bowl;
pub mod timberline;

use anyhow::Result;
use scraper::Html;
use shared::{Lifts, Snowfall};

pub struct ParkCondition {
    pub updated_on: Option<String>,
    pub snowfalls: Vec<Snowfall>,
    pub lifts: Lifts,
}

pub trait ParkParser: Send + Sync {
    fn url(&self) -> &str;
    fn parse_updated_on(&self, doc: &Html) -> Result<String>;
    fn parse_lifts(&self, doc: &Html) -> Result<Lifts>;
    fn parse_snowfall(&self, doc: &Html) -> Result<Vec<Snowfall>>;

    /// Whether this park gets conditions from the website (vs NOAA weather API).
    fn has_site_conditions(&self) -> bool {
        false
    }
    fn parse_conditions(&self, _doc: &Html) -> Result<shared::Condition> {
        anyhow::bail!("no site conditions")
    }
}

/// Fetches HTML and parses park conditions + optional site conditions.
pub async fn fetch_and_parse(
    client: &reqwest::Client,
    parser: &dyn ParkParser,
) -> Result<(ParkCondition, Option<shared::Condition>)> {
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

    let site_condition = if parser.has_site_conditions() {
        parser.parse_conditions(&doc).ok()
    } else {
        None
    };

    Ok((
        ParkCondition {
            updated_on,
            snowfalls,
            lifts,
        },
        site_condition,
    ))
}

fn try_parse_float(s: &str) -> f64 {
    s.replace('"', "").trim().parse::<f64>().unwrap_or(0.0)
}
