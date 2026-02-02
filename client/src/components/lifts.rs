use shared::Lifts;
use yew::prelude::*;

#[derive(Properties, PartialEq)]
pub struct Props {
    pub lifts: Lifts,
}

#[function_component(LiftsView)]
pub fn lifts_view(props: &Props) -> Html {
    let updated = props
        .lifts
        .updated_on
        .as_deref()
        .unwrap_or("Unavailable");

    html! {
        <div class="lifts">
            <h2>{"Lifts "}<span class="updated">{updated}</span></h2>
            <ul class="lift-statuses">
                { for props.lifts.lift_statuses.iter().map(|lift| {
                    let is_open = lift.status.to_lowercase().contains("open");
                    let (name, sub) = if lift.name.contains('(') {
                        let idx = lift.name.find('(').unwrap();
                        (lift.name[..idx].trim().to_string(), Some(lift.name[idx..].to_string()))
                    } else {
                        (lift.name.clone(), None)
                    };
                    let name_class = if is_open { "lift-name open" } else { "lift-name" };
                    html! {
                        <li key={lift.name.clone()}>
                            <span class={name_class}>{&name}</span>
                            if let Some(sub) = &sub {
                                if is_open {
                                    <span class="lift-substatus">{sub}</span>
                                }
                            }
                            <span class="lift-status">{&lift.status}</span>
                            if is_open {
                                <span class="lift-hours">{&lift.hours}</span>
                            }
                        </li>
                    }
                })}
            </ul>
        </div>
    }
}
