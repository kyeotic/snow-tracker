use anyhow::Result;
use scraper::{Html, Selector};
use shared::{Condition, LiftStatus, Lifts, Snowfall};

use super::try_parse_float;

pub struct SkiBowl {
    url: String,
    #[allow(dead_code)]
    time_zone: String,
}

impl SkiBowl {
    pub fn new(url: &str, time_zone: &str) -> Self {
        Self {
            url: url.to_string(),
            time_zone: time_zone.to_string(),
        }
    }
}

/// Extract all rows from jet-tables as Vec<Vec<String>>.
/// Each row is a vec of cell texts.
fn extract_jet_rows(doc: &Html) -> Vec<Vec<String>> {
    let row_sel = Selector::parse(".jet-table__body-row").unwrap();
    let cell_sel = Selector::parse(".jet-table__cell-text").unwrap();

    doc.select(&row_sel)
        .map(|row| {
            row.select(&cell_sel)
                .map(|c| c.text().collect::<String>().trim().to_string())
                .filter(|s| !s.is_empty())
                .collect()
        })
        .filter(|cells: &Vec<String>| !cells.is_empty())
        .collect()
}

impl super::HtmlParkParser for SkiBowl {
    fn url(&self) -> &str {
        &self.url
    }

    fn has_site_conditions(&self) -> bool {
        true
    }

    fn parse_conditions(&self, doc: &Html) -> Result<Condition> {
        let rows = extract_jet_rows(doc);
        let mut temperature = 0.0;
        let mut condition_text = String::new();

        for row in &rows {
            if row.len() < 2 {
                continue;
            }
            match row[0].as_str() {
                "Temperature" => {
                    // "35 degrees in the base area, 33 at the top"
                    temperature = try_parse_float(&row[1]);
                }
                "Weather" => {
                    condition_text = row[1].clone();
                }
                _ => {}
            }
        }

        Ok(Condition {
            updated_on: self.parse_updated_on(doc).ok(),
            temperature,
            condition: condition_text,
            icon_class: String::new(),
        })
    }

    fn parse_updated_on(&self, doc: &Html) -> Result<String> {
        let rows = extract_jet_rows(doc);
        let mut date = String::new();
        let mut time = String::new();

        for row in &rows {
            if row.len() < 2 {
                continue;
            }
            match row[0].as_str() {
                "Date" => date = row[1].clone(),
                "Time" => time = row[1].clone(),
                _ => {}
            }
        }

        if !date.is_empty() {
            let suffix = if time.is_empty() {
                date
            } else {
                format!("{date} {time}")
            };
            return Ok(format!("Updated {suffix}"));
        }

        anyhow::bail!("no date found")
    }

    fn parse_lifts(&self, doc: &Html) -> Result<Lifts> {
        let rows = extract_jet_rows(doc);

        // Lift rows have 2-3 cells where the second is a status keyword
        let status_keywords = ["Open", "Closed", "Standby", "Hold"];

        let statuses: Vec<LiftStatus> = rows
            .iter()
            .filter(|row| {
                row.len() >= 2
                    && status_keywords
                        .iter()
                        .any(|kw| row[1].contains(kw))
            })
            .map(|row| LiftStatus {
                name: row[0].clone(),
                status: row[1].clone(),
                hours: row.get(2).cloned().unwrap_or_default(),
            })
            .collect();

        Ok(Lifts {
            updated_on: self.parse_updated_on(doc).ok(),
            lift_statuses: statuses,
        })
    }

    fn parse_snowfall(&self, doc: &Html) -> Result<Vec<Snowfall>> {
        let rows = extract_jet_rows(doc);
        let mut snowfalls = vec![];

        for row in &rows {
            let label = &row[0];
            if label.contains("Snow Depth") {
                let value = row.get(1).map(|s| s.as_str()).unwrap_or("0");
                snowfalls.push(Snowfall {
                    since: "Base Depth".to_string(),
                    depth: try_parse_float(value),
                });
            } else if label.contains("New Snow") {
                let value = row.get(1).map(|s| s.as_str()).unwrap_or("0");
                let since = if label.contains("24") {
                    "Last 24 Hours"
                } else if label.contains("48") {
                    "Last 48 Hours"
                } else {
                    "New Snow"
                };
                snowfalls.push(Snowfall {
                    since: since.to_string(),
                    depth: try_parse_float(value),
                });
            } else if label.contains("Year to Date") {
                let value = row.get(1).map(|s| s.as_str()).unwrap_or("0");
                snowfalls.push(Snowfall {
                    since: "Season Total".to_string(),
                    depth: try_parse_float(value),
                });
            }
        }

        Ok(snowfalls)
    }
}
