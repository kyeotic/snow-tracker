use cfg_if::cfg_if;
use leptos::{component, view, IntoView};
use leptos_meta::*;
use leptos_router::*;
mod api;
pub mod error_template;
pub mod fallback;
mod home;
use home::*;
use wasm_bindgen::prelude::wasm_bindgen;
mod weather;

#[component]
pub fn App() -> impl IntoView {
    provide_meta_context();
    view! {
        <Link rel="shortcut icon" type_="image/ico" href="/public/favicon.ico"/>
        <Link rel="apple-touch-icon" href="/public/images/snow_cal_v2.png"/>
        <Link rel="manifest" href="/public/manifest.json"/>
        <Stylesheet id="reset" href="/public/css/reset.css.css"/>
        <Stylesheet id="leptos" href="/public/weather-icons/css/weather-icons.min.css"/>
        <Meta name="description" content="Snow Tracker"/>
        <span>"Value: !"</span>
        // <Router>
        //     <main>
        //         <Routes>
        //             <Route path=":park?" view=Home />
        //         </Routes>
        //     </main>
        // </Router>
    }
}

cfg_if! {
    if #[cfg(feature = "hydrate")] {
        #[wasm_bindgen]
        pub fn hydrate() {
            _ = console_log::init_with_level(log::Level::Debug);
            console_error_panic_hook::set_once();
            leptos::mount_to_body(move || {
                view! { <App/> }
            });
        }
    } else if #[cfg(feature = "ssr")] {

    use axum::{
        Router,
        routing::post
    };
    use leptos_axum::{generate_route_list, LeptosRoutes};
    use leptos::*;
    use log::{info, Level};

    #[wasm_bindgen]
    pub struct Handler(axum_js_fetch::App);

    #[wasm_bindgen]
    impl Handler {
        pub async fn new() -> Self {
            console_log::init_with_level(Level::Debug);
            console_error_panic_hook::set_once();

            let leptos_options = LeptosOptions::builder().output_name("client").site_pkg_dir("pkg").build();
            let routes = generate_route_list(App);

            // build our application with a route
            let app: axum::Router<(), axum::body::Body> = Router::new()
            .leptos_routes(&leptos_options, routes, || view! { <App/> } )
            .route("/api/*fn_name", post(leptos_axum::handle_server_fns))
            .with_state(leptos_options);

            info!("creating handler instance");

            Self(axum_js_fetch::App::new(app))
        }

        pub async fn serve(&self, req: web_sys::Request) -> web_sys::Response {
            self.0.serve(req).await
        }
    }
}
}
