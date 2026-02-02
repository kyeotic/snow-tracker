use anyhow::Result;
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

impl super::HtmlParkParser for Timberline {
    fn url(&self) -> &str {
        &self.url
    }

    fn parse_updated_on(&self, doc: &Html) -> Result<String> {
        // Look for "Updated <date>" text inside .conditions__group-header p
        let sel = Selector::parse(".conditions__group-header p").unwrap();
        for el in doc.select(&sel) {
            let text = el.text().collect::<String>();
            let trimmed = text.trim();
            if trimmed.contains("Updated") {
                return Ok(trimmed.to_string());
            }
        }
        // Fallback: search broadly
        let sel = Selector::parse("p, span, div").unwrap();
        for el in doc.select(&sel) {
            let text = el.text().collect::<String>();
            let trimmed = text.trim();
            if trimmed.starts_with("Updated ")
                && (trimmed.contains("am") || trimmed.contains("pm"))
                && trimmed.len() < 60
            {
                return Ok(trimmed.to_string());
            }
        }
        anyhow::bail!("no updated time found")
    }

    fn parse_lifts(&self, doc: &Html) -> Result<Lifts> {
        // Table with headers: Lifts | Status | Type | Operating Hours
        let table_sel = Selector::parse("table").unwrap();
        let thead_sel = Selector::parse("thead").unwrap();
        let tbody_sel = Selector::parse("tbody").unwrap();
        let row_sel = Selector::parse("tr").unwrap();
        let th_sel = Selector::parse("th").unwrap();
        let cell_sel = Selector::parse("td").unwrap();

        for table in doc.select(&table_sel) {
            let headers: Vec<String> = table
                .select(&thead_sel)
                .flat_map(|h| h.select(&th_sel))
                .map(|th| th.text().collect::<String>().trim().to_string())
                .collect();

            // Need at least "Status" in headers
            let status_col = headers.iter().position(|h| h.contains("Status"));
            if status_col.is_none() {
                continue;
            }
            let status_col = status_col.unwrap();
            let name_col = headers
                .iter()
                .position(|h| h.contains("Lift") || h.contains("Name"))
                .unwrap_or(0);
            let hours_col = headers
                .iter()
                .position(|h| h.contains("Hours") || h.contains("Operating"));

            let tbody = match table.select(&tbody_sel).next() {
                Some(t) => t,
                None => continue,
            };

            let statuses: Vec<LiftStatus> = tbody
                .select(&row_sel)
                .filter_map(|row| {
                    let cells: Vec<_> = row.select(&cell_sel).collect();
                    if cells.len() <= status_col {
                        return None;
                    }

                    let name = cells[name_col]
                        .text()
                        .collect::<String>()
                        .trim()
                        .to_string();
                    if name.is_empty() {
                        return None;
                    }
                    let status = cells[status_col]
                        .text()
                        .collect::<String>()
                        .trim()
                        .to_string();
                    let hours = hours_col
                        .and_then(|i| cells.get(i))
                        .map(|c| c.text().collect::<String>().trim().to_string())
                        .unwrap_or_default();

                    Some(LiftStatus {
                        name,
                        status,
                        hours,
                    })
                })
                .collect();

            if !statuses.is_empty() {
                return Ok(Lifts {
                    updated_on: self.parse_updated_on(doc).ok(),
                    lift_statuses: statuses,
                });
            }
        }

        anyhow::bail!("no lift table found")
    }

    fn parse_snowfall(&self, doc: &Html) -> Result<Vec<Snowfall>> {
        // Snow section: .conditions__group containing heading "Snow"
        // Each item: .conditions__item with .conditions__item-data (number) and .conditions__item-label
        let group_sel = Selector::parse(".conditions__group").unwrap();
        let heading_sel = Selector::parse(".conditions__heading").unwrap();
        let item_sel = Selector::parse(".conditions__item").unwrap();
        let data_sel = Selector::parse(".conditions__item-data").unwrap();
        let label_sel = Selector::parse(".conditions__item-label").unwrap();

        for group in doc.select(&group_sel) {
            let heading = group
                .select(&heading_sel)
                .next()
                .map(|h| h.text().collect::<String>());
            if heading.as_deref() != Some("Snow") {
                continue;
            }

            let mut snowfalls = vec![];
            for item in group.select(&item_sel) {
                let data_text = item
                    .select(&data_sel)
                    .next()
                    .map(|d| d.text().collect::<String>())
                    .unwrap_or_default();
                let label = item
                    .select(&label_sel)
                    .next()
                    .map(|l| l.text().collect::<String>().trim().to_string())
                    .unwrap_or_default();

                if label.is_empty() {
                    continue;
                }

                let depth = try_parse_float(&data_text);
                snowfalls.push(Snowfall {
                    since: label,
                    depth,
                });
            }

            if !snowfalls.is_empty() {
                return Ok(snowfalls);
            }
        }

        // Fallback: try dl/dt/dd pattern
        let dl_sel = Selector::parse("dl").unwrap();
        let dt_sel = Selector::parse("dt").unwrap();
        let dd_sel = Selector::parse("dd").unwrap();

        for dl in doc.select(&dl_sel) {
            let dts: Vec<_> = dl.select(&dt_sel).collect();
            let dds: Vec<_> = dl.select(&dd_sel).collect();
            if dts.is_empty() {
                continue;
            }
            let is_snow = dds.iter().any(|dd| {
                let t = dd.text().collect::<String>().to_lowercase();
                t.contains("depth") || t.contains("hours") || t.contains("season") || t.contains("since")
            });
            if !is_snow {
                continue;
            }
            let snowfalls: Vec<Snowfall> = dts
                .into_iter()
                .zip(dds.into_iter())
                .map(|(dt, dd)| Snowfall {
                    depth: try_parse_float(&dt.text().collect::<String>()),
                    since: dd.text().collect::<String>().trim().to_string(),
                })
                .collect();
            if !snowfalls.is_empty() {
                return Ok(snowfalls);
            }
        }

        anyhow::bail!("no snowfall data found")
    }
}
