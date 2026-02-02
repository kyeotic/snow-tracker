use shared::Snowfall;
use yew::prelude::*;

#[derive(Properties, PartialEq)]
pub struct Props {
    pub snowfalls: Vec<Snowfall>,
}

#[function_component(SnowfallView)]
pub fn snowfall_view(props: &Props) -> Html {
    html! {
        <div class="snowfall">
            <h2>{"Snowfall"}</h2>
            <ul class="snowfalls">
                { for props.snowfalls.iter().map(|s| html! {
                    <li key={s.since.clone()}>
                        <span class="snowfall-depth">{format!("{}\"", s.depth)}</span>
                        {" "}
                        <span class="snowfall-since">{&s.since}</span>
                    </li>
                })}
            </ul>
        </div>
    }
}
