use anyhow::Result;
use scraper::{Html, Selector};
use shared::{LiftStatus, Lifts, Snowfall};

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

impl super::ParkParser for SkiBowl {
    fn url(&self) -> &str {
        &self.url
    }

    fn parse_updated_on(&self, doc: &Html) -> Result<String> {
        let row_sel = Selector::parse("#liststatuses tr").unwrap();
        let td_sel = Selector::parse("td").unwrap();

        let mut date_str = String::new();
        let mut time_str = String::new();

        for row in doc.select(&row_sel) {
            let html = row.inner_html();
            let cells: Vec<_> = row.select(&td_sel).collect();
            if cells.len() < 2 {
                continue;
            }
            if html.contains("Date:") {
                date_str = cells[1].text().collect::<String>().trim().to_string();
            }
            if html.contains("Time:") {
                time_str = cells[1].text().collect::<String>().trim().to_string();
            }
        }

        if date_str.is_empty() || time_str.is_empty() {
            anyhow::bail!("could not find date/time");
        }

        Ok(format!("{} {}", date_str, time_str))
    }

    fn parse_lifts(&self, doc: &Html) -> Result<Lifts> {
        let row_sel = Selector::parse("#intro #liststatuses tr").unwrap();
        let td_sel = Selector::parse("td").unwrap();

        let statuses: Vec<LiftStatus> = doc
            .select(&row_sel)
            .filter_map(|row| {
                let cells: Vec<_> = row.select(&td_sel).collect();
                if cells.len() < 3 {
                    return None;
                }
                let name = cells[0].text().collect::<String>().replace(':', "").trim().to_string();
                if !name.to_lowercase().contains("chair") {
                    return None;
                }
                let name = regex::Regex::new(r"(?i)\s?chair")
                    .unwrap()
                    .replace(&name, "")
                    .to_string();
                let status = cells[1].text().collect::<String>().trim().to_string();
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
        let td_sel = Selector::parse("#liststatuses td").unwrap();
        let tr_sel = Selector::parse("#liststatuses tr").unwrap();

        // Base depth
        let mut base_depth = 0.0;
        for td in doc.select(&td_sel) {
            let html = td.inner_html();
            if html.contains("Snow Depth") {
                // Next sibling has the value
                if let Some(parent) = td.parent() {
                    let text: String = parent
                        .children()
                        .filter_map(|c| scraper::ElementRef::wrap(c))
                        .skip(1)
                        .map(|el| el.text().collect::<String>())
                        .collect();
                    let trimmed = text.trim().to_string();
                    if let Some(idx) = trimmed.find('"') {
                        base_depth = try_parse_float(&trimmed[..idx]);
                    }
                }
                break;
            }
        }

        // New snow rows
        let mut new_snow: Vec<Snowfall> = vec![];
        for row in doc.select(&tr_sel) {
            let html = row.inner_html();
            if !html.contains("New Snow") {
                continue;
            }
            let cells: Vec<_> = row
                .select(&Selector::parse("td").unwrap())
                .collect();
            if cells.len() < 2 {
                continue;
            }
            let since_text = cells[0].text().collect::<String>().trim().to_string();
            // Extract hour number
            let re = regex::Regex::new(r"\d{2}").unwrap();
            let since = re
                .find(&since_text)
                .map(|m| format!("Last {} hrs", m.as_str()))
                .unwrap_or(since_text);
            let depth_text = cells[cells.len() - 1].text().collect::<String>();
            let depth = try_parse_float(&depth_text);
            new_snow.push(Snowfall { since, depth });
        }

        new_snow.push(Snowfall {
            since: "Base Depth".to_string(),
            depth: base_depth,
        });

        Ok(new_snow)
    }
}
