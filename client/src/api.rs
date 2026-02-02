use shared::SnowReport;

pub async fn fetch_snow_report() -> Result<SnowReport, gloo_net::Error> {
    let resp = gloo_net::http::Request::get("/api/snow").send().await?;
    resp.json().await
}
