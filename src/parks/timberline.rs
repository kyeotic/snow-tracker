use crate::parks::park_parser::ParkParser;
use anyhow::{anyhow, Result};
use async_trait::async_trait;
use time::OffsetDateTime;
use tl::VDom;
use url::Url;

pub struct Timberline {
    url: Url,
    client: reqwest::Client,
}

impl Timberline {
    pub fn new(park_url: &Url, client: reqwest::Client) -> Self {
        Self {
            url: park_url.to_owned(),
            client,
        }
    }
}

#[async_trait]
impl ParkParser for Timberline {
    fn get_url(&self) -> &Url {
        &self.url
    }
    fn get_client(&self) -> &reqwest::Client {
        &self.client
    }

    fn get_updated_on(&self, dom: &VDom) -> Result<OffsetDateTime> {
        return Err(anyhow!("not implemented: updated_on"));
    }

    fn get_lifts(&self, dom: &VDom) -> Result<super::Lifts> {
        return Err(anyhow!("not implemented: lifts"));
    }

    fn get_snowfall(&self, dom: &VDom) -> Result<Vec<super::Snowfall>> {
        return Err(anyhow!("not implemented: snowfall"));
    }
}
