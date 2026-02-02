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

fn get_updated(park: &ParkStatus) -> String {
    park.status
        .as_ref()
        .and_then(|s| s.updated_on.clone())
        .unwrap_or_else(|| "Unavailable".to_string())
}

#[function_component(SnowSummary)]
pub fn snow_summary(props: &Props) -> Html {
    let selected = use_state(|| ParkTab::Meadows);

    let current: &ParkStatus = match *selected {
        ParkTab::Meadows => &props.report.meadows,
        ParkTab::Timberline => &props.report.timberline,
        ParkTab::SkiBowl => &props.report.ski_bowl,
    };

    let meadows_updated = get_updated(&props.report.meadows);
    let timberline_updated = get_updated(&props.report.timberline);
    let ski_bowl_updated = get_updated(&props.report.ski_bowl);

    let sel1 = selected.clone();
    let sel2 = selected.clone();
    let sel3 = selected.clone();

    let meadows_class = if *selected == ParkTab::Meadows { "active" } else { "" };
    let timberline_class = if *selected == ParkTab::Timberline { "active" } else { "" };
    let ski_bowl_class = if *selected == ParkTab::SkiBowl { "active" } else { "" };

    html! {
        <div class="snow-summary-container">
            <section class="snow-summary-conditions">
                <div class="conditions-headers">
                    <h1 onclick={Callback::from(move |_: MouseEvent| sel1.set(ParkTab::Meadows))} class={meadows_class}>
                        {"Meadows"}
                        <small class="subtitle">{"("}{&meadows_updated}{")"}</small>
                    </h1>
                    <h1 onclick={Callback::from(move |_: MouseEvent| sel2.set(ParkTab::Timberline))} class={timberline_class}>
                        {"Timberline"}
                        <small class="subtitle">{"("}{&timberline_updated}{")"}</small>
                    </h1>
                    <h1 onclick={Callback::from(move |_: MouseEvent| sel3.set(ParkTab::SkiBowl))} class={ski_bowl_class}>
                        {"Ski Bowl"}
                        <small class="subtitle">{"("}{&ski_bowl_updated}{")"}</small>
                    </h1>
                </div>
                <div class="conditions-container">
                    if let Some(status) = &current.status {
                        if let Some(cond) = &status.condition {
                            <ConditionView condition={cond.clone()} park_url={status.park_url.clone()} />
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
