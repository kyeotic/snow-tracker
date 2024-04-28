use super::{Lifts, Snowfall};
use anyhow::Result;
use async_trait::async_trait;
use time::OffsetDateTime;
use tl::VDom;
use url::Url;

pub struct ParkCondition {
    pub updated_on: Option<OffsetDateTime>,
    pub snowfalls: Option<Vec<Snowfall>>,
    pub lifts: Option<Lifts>,
}

#[async_trait]
pub trait ParkParser: Sync {
    fn get_updated_on(&self, dom: &VDom) -> Result<OffsetDateTime>;
    fn get_lifts(&self, dom: &VDom) -> Result<Lifts>;
    fn get_snowfall(&self, dom: &VDom) -> Result<Vec<Snowfall>>;

    fn get_url(&self) -> &Url;
    fn get_client(&self) -> &reqwest::Client;

    async fn get_park_conditions(&self) -> Result<ParkCondition> {
        let html = &self
            .get_client()
            .get(self.get_url().as_str())
            .send()
            .await?
            .text()
            .await?;

        let dom = tl::parse(&html, tl::ParserOptions::default())?;

        Ok(ParkCondition {
            updated_on: self.get_updated_on(&dom).ok(),
            lifts: self.get_lifts(&dom).ok(),
            snowfalls: self.get_snowfall(&dom).ok(),
        })
    }
}
