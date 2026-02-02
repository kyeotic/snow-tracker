use shared::ForecastPeriod;
use yew::prelude::*;

#[derive(Properties, PartialEq)]
pub struct Props {
    pub forecasts: Vec<ForecastPeriod>,
}

#[function_component(Forecasts)]
pub fn forecasts(props: &Props) -> Html {
    if props.forecasts.is_empty() {
        return html! {
            <ul class="forecasts">
                <span>{"Error retrieving forecasts"}</span>
            </ul>
        };
    }

    html! {
        <ul class="forecasts">
            { for props.forecasts.iter().map(|f| {
                let temp_class = if f.is_daytime { "forecast-temp day" } else { "forecast-temp" };
                html! {
                    <li key={f.name.clone()}>
                        <div class="forecast-summary">
                            <span class="forecast-name">{&f.name}</span>
                            <span class={temp_class}>
                                {f.temperature}{&f.temperature_unit}
                            </span>
                            <span class="forecast-wind">{&f.wind_speed}</span>
                            <img class="forecast-icon" src={f.icon.clone()} alt={f.short_forecast.clone()} />
                        </div>
                        <span class="forecast-detail">{&f.detailed_forecast}</span>
                    </li>
                }
            })}
        </ul>
    }
}
