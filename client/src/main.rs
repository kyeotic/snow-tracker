mod api;
mod components;

use components::snow_summary::SnowSummary;
use shared::SnowReport;
use yew::prelude::*;

#[function_component(App)]
fn app() -> Html {
    let data = use_state(|| None::<SnowReport>);
    let error = use_state(|| None::<String>);

    {
        let data = data.clone();
        let error = error.clone();
        use_effect_with((), move |_| {
            wasm_bindgen_futures::spawn_local(async move {
                match api::fetch_snow_report().await {
                    Ok(report) => data.set(Some(report)),
                    Err(e) => error.set(Some(e.to_string())),
                }
            });
            || ()
        });
    }

    html! {
        if let Some(report) = (*data).clone() {
            <SnowSummary report={report} />
        } else if let Some(err) = (*error).clone() {
            <div class="error">{"Error: "}{err}</div>
        } else {
            <div class="loading">{"Loading..."}</div>
        }
    }
}

fn main() {
    let document = web_sys::window()
        .expect("missing window")
        .document()
        .expect("missing document");
    let root = document
        .query_selector("main")
        .expect("failed to query selector")
        .expect("missing main element");
    yew::Renderer::<App>::with_root(root).render();
}
