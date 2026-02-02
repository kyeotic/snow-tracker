use anyhow::{Context, Result};
use scraper::{Html, Selector};
use shared::{Condition, LiftStatus, Lifts, Snowfall};

use super::try_parse_float;

pub struct Meadows {
    url: String,
    #[allow(dead_code)]
    time_zone: String,
}

impl Meadows {
    pub fn new(url: &str, time_zone: &str) -> Self {
        Self {
            url: url.to_string(),
            time_zone: time_zone.to_string(),
        }
    }
}

impl super::ParkParser for Meadows {
    fn url(&self) -> &str {
        &self.url
    }

    fn has_site_conditions(&self) -> bool {
        true
    }

    fn parse_conditions(&self, doc: &Html) -> Result<Condition> {
        let temp_sel = Selector::parse(".conditions-glance-widget.conditions-current .reading.temperature").unwrap();
        let cond_sel = Selector::parse(".conditions-glance-widget.conditions-current .reading.conditions").unwrap();

        let temp_el = doc.select(&temp_sel).next().context("no temperature")?;
        let temperature = temp_el
            .attr("data-temperature")
            .map(try_parse_float)
            .unwrap_or(0.0);

        let cond_el = doc.select(&cond_sel).next().context("no conditions")?;
        let condition = cond_el.text().collect::<String>().trim().to_string();
        let icon = cond_el
            .attr("data-conditions")
            .unwrap_or("clear");

        let updated_on = self.parse_updated_on(doc).ok();

        Ok(Condition {
            updated_on,
            temperature,
            condition,
            icon_class: format!("weather-icon wi wi-day-{icon}"),
        })
    }

    fn parse_updated_on(&self, doc: &Html) -> Result<String> {
        let sel = Selector::parse(".conditions-snapshot .metric time").unwrap();
        let text = doc
            .select(&sel)
            .next()
            .context("no updated time")?
            .text()
            .collect::<String>();
        Ok(text.trim().to_string())
    }

    fn parse_lifts(&self, doc: &Html) -> Result<Lifts> {
        let row_sel = Selector::parse("#liftGrid tbody tr").unwrap();
        let td_sel = Selector::parse("td").unwrap();

        let statuses: Vec<LiftStatus> = doc
            .select(&row_sel)
            .filter_map(|row| {
                let cells: Vec<_> = row.select(&td_sel).collect();
                if cells.len() < 3 {
                    return None;
                }
                let name = cells[1].text().collect::<String>().trim().to_string();
                let status = cells[0].text().collect::<String>().trim().to_string();
                let hours = cells[2].text().collect::<String>().trim().to_string();
                Some(LiftStatus {
                    name,
                    status,
                    hours,
                })
            })
            .collect();

        let updated_on_sel = Selector::parse(".conditions-info.lift-operations p").unwrap();
        let updated_on = doc
            .select(&updated_on_sel)
            .next()
            .map(|el| {
                el.text()
                    .collect::<String>()
                    .trim()
                    .trim_start_matches("for ")
                    .to_string()
            });

        Ok(Lifts {
            updated_on,
            lift_statuses: statuses,
        })
    }

    fn parse_snowfall(&self, doc: &Html) -> Result<Vec<Snowfall>> {
        let mut snowfalls = vec![];

        // Fixed depth readings from data attributes
        let base_sel = Selector::parse(".snowdepth-base .reading.depth").unwrap();
        let mid_sel = Selector::parse(".snowdepth-mid .reading.depth").unwrap();
        let ytd_sel = Selector::parse(".snowdepth-ytd .reading.depth").unwrap();

        let base = doc.select(&base_sel).next().and_then(|e| e.attr("data-depth")).unwrap_or("0");
        let mid = doc.select(&mid_sel).next().and_then(|e| e.attr("data-depth")).unwrap_or("0");
        let ytd = doc.select(&ytd_sel).next().and_then(|e| e.attr("data-depth")).unwrap_or("0");

        snowfalls.push(Snowfall { since: "Base Depth".to_string(), depth: try_parse_float(base) });
        snowfalls.push(Snowfall { since: "Mid Depth".to_string(), depth: try_parse_float(mid) });
        snowfalls.push(Snowfall { since: "Snow YTD".to_string(), depth: try_parse_float(ytd) });

        // Dynamic snowfall readings
        let dl_sel = Selector::parse(".conditions-snowfall dl").unwrap();
        let metric_sel = Selector::parse(".metric").unwrap();
        let depth_sel = Selector::parse(".reading.depth").unwrap();

        for dl in doc.select(&dl_sel) {
            let since = dl.select(&metric_sel).next().map(|e| e.text().collect::<String>().trim().to_string()).unwrap_or_default();
            let depth = dl.select(&depth_sel).next().and_then(|e| e.attr("data-depth")).unwrap_or("0");
            snowfalls.push(Snowfall { since, depth: try_parse_float(depth) });
        }

        Ok(snowfalls)
    }
}
