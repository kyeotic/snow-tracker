use anyhow::{Context, Result};
use scraper::{Html, Selector};
use shared::{LiftStatus, Lifts, Snowfall};

use super::try_parse_float;

pub struct Timberline {
    url: String,
    #[allow(dead_code)]
    time_zone: String,
}

impl Timberline {
    pub fn new(url: &str, time_zone: &str) -> Self {
        Self {
            url: url.to_string(),
            time_zone: time_zone.to_string(),
        }
    }
}

impl super::ParkParser for Timberline {
    fn url(&self) -> &str {
        &self.url
    }

    fn parse_updated_on(&self, doc: &Html) -> Result<String> {
        let sel = Selector::parse(".conditions-panel p").unwrap();
        let text = doc
            .select(&sel)
            .next()
            .context("no .conditions-panel p")?
            .text()
            .collect::<String>();
        Ok(text.trim().to_string())
    }

    fn parse_lifts(&self, doc: &Html) -> Result<Lifts> {
        let table_sel = Selector::parse("#lift_status table tbody").unwrap();
        let row_sel = Selector::parse("tr").unwrap();
        let cell_sel = Selector::parse("td").unwrap();
        let span_sel = Selector::parse("span").unwrap();

        let tbody = doc.select(&table_sel).next().context("no lift table")?;

        let statuses: Vec<LiftStatus> = tbody
            .select(&row_sel)
            .filter_map(|row| {
                let cells: Vec<_> = row.select(&cell_sel).collect();
                if cells.len() < 3 {
                    return None;
                }
                let name = cells[0].text().collect::<String>().trim().to_string();
                let status = cells[1]
                    .select(&span_sel)
                    .next()
                    .map(|s| s.text().collect::<String>().trim().to_string())
                    .unwrap_or_default();
                let hours = cells[2].text().collect::<String>().trim().to_string();
                Some(LiftStatus {
                    name,
                    status,
                    hours,
                })
            })
            .collect();

        let updated_on = self.parse_updated_on(doc).ok();

        Ok(Lifts {
            updated_on,
            lift_statuses: statuses,
        })
    }

    fn parse_snowfall(&self, doc: &Html) -> Result<Vec<Snowfall>> {
        let panel_sel = Selector::parse(".conditions-panel").unwrap();
        let dt_sel = Selector::parse("dl dt").unwrap();
        let dd_sel = Selector::parse("dl dd").unwrap();

        let mut snowfalls = vec![];

        for panel in doc.select(&panel_sel) {
            let html = panel.inner_html();
            if !html.contains("Base depth") && !html.contains("base depth") {
                continue;
            }

            let dts: Vec<_> = panel.select(&dt_sel).collect();
            let dds: Vec<_> = panel.select(&dd_sel).collect();

            for (dt, dd) in dts.into_iter().zip(dds.into_iter()) {
                let depth_text = dt.text().collect::<String>();
                let since = dd.text().collect::<String>().trim().to_string();
                let depth = try_parse_float(&depth_text);
                snowfalls.push(Snowfall { since, depth });
            }
        }

        Ok(snowfalls)
    }
}
