use shared::Condition;
use yew::prelude::*;

#[derive(Properties, PartialEq)]
pub struct Props {
    pub condition: Condition,
    #[prop_or_default]
    pub park_url: Option<String>,
}

#[function_component(ConditionView)]
pub fn condition_view(props: &Props) -> Html {
    let c = &props.condition;
    let updated = c
        .updated_on
        .as_deref()
        .unwrap_or("Unavailable");

    html! {
        <div class="conditions">
            <h2>
                {"Conditions "}
                if let Some(url) = &props.park_url {
                    <a class="park-link" href={url.clone()} target="_blank" rel="noopener noreferrer" title="Open park conditions">
                        <i class="fa-solid fa-arrow-up-right-from-square" />
                    </a>
                }
                <span class="updated">{updated}</span>
            </h2>
            <span class="condition-temp">{c.temperature as i32}</span>
            <span class="condition-status">{&c.condition}</span>
            <i title={c.condition.clone()} class={c.icon_class.clone()} />
        </div>
    }
}
