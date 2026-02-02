use shared::{ParkStatus, SnowReport};
use yew::prelude::*;

use super::condition::ConditionView;
use super::forecasts::Forecasts;
use super::lifts::LiftsView;
use super::snowfall::SnowfallView;

#[derive(Clone, PartialEq)]
enum ParkTab {
    Meadows,
    Timberline,
    SkiBowl,
}

#[derive(Properties, PartialEq)]
pub struct Props {
    pub report: SnowReport,
}

#[function_component(SnowSummary)]
pub fn snow_summary(props: &Props) -> Html {
    let selected = use_state(|| ParkTab::Meadows);

    let current: &ParkStatus = match *selected {
        ParkTab::Meadows => &props.report.meadows,
        ParkTab::Timberline => &props.report.timberline,
        ParkTab::SkiBowl => &props.report.ski_bowl,
    };

    let make_header = |tab: ParkTab, title: &str| {
        let sel = selected.clone();
        let is_active = *selected == tab;
        let class = if is_active { "active" } else { "" };
        let updated = current
            .status
            .as_ref()
            .and_then(|s| s.updated_on.clone())
            .unwrap_or_else(|| "Unavailable".to_string());
        let tab_clone = tab.clone();
        let onclick = Callback::from(move |_: MouseEvent| sel.set(tab_clone.clone()));
        html! {
            <h1 {onclick} {class}>
                {title}
                <small class="subtitle">{"("}{&updated}{")"}</small>
            </h1>
        }
    };

    html! {
        <div class="snow-summary-container">
            <section class="snow-summary-conditions">
                <div class="conditions-headers">
                    {make_header(ParkTab::Meadows, "Meadows")}
                    {make_header(ParkTab::Timberline, "Timberline")}
                    {make_header(ParkTab::SkiBowl, "Ski Bowl")}
                </div>
                <div class="conditions-container">
                    if let Some(status) = &current.status {
                        if let Some(cond) = &status.condition {
                            <ConditionView condition={cond.clone()} />
                        }
                        <SnowfallView snowfalls={status.snowfalls.clone()} />
                        <LiftsView lifts={status.lifts.clone()} />
                    }
                </div>
            </section>
            <section class="snow-summary-noaa">
                <h1>{"NOAA"}</h1>
                if let Some(status) = &current.status {
                    if let Some(forecasts) = &status.forecast {
                        <Forecasts forecasts={forecasts.clone()} />
                    }
                }
            </section>
        </div>
    }
}
