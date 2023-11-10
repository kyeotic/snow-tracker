use crate::api;
use leptos::*;
use leptos_meta::*;
use leptos_router::*;

#[component]
pub fn Home() -> impl IntoView {
    let params = use_params_map();
    let (value, set_value) = create_signal(0);
    let step = 1;

    // let local_only = serde_json::to_string(&local_only).unwrap();

    view! {
        <div>
            <button on:click=move |_| set_value(0)>"Clear"</button>
            <button on:click=move |_| set_value.update(|value| *value -= step)>"-1"</button>
            <span>"Value: " {value} "!"</span>
            <button on:click=move |_| set_value.update(|value| *value += step)>"+1"</button>
            <pre>
              test
            </pre>
        </div>
    }
    // let params = use_params_map();
    // let story = create_resource(
    //     move || params().get("id").cloned().unwrap_or_default(),
    //     move |id| async move {
    //         if id.is_empty() {
    //             None
    //         } else {
    //             api::fetch_api::<api::Story>(&api::story(&format!("item/{id}")))
    //                 .await
    //         }
    //     },
    // );
    // let meta_description = move || {
    //     story
    //         .get()
    //         .and_then(|story| story.map(|story| story.title))
    //         .unwrap_or_else(|| "Loading story...".to_string())
    // };

    // view! {
    //     <Suspense fallback=|| view! {  "Loading..." }>
    //         <Meta name="description" content=meta_description/>
    //         {move || story.get().map(|story| match story {
    //             None => view! { <div class="item-view">"Error loading this story."</div> },
    //             Some(story) => view! {
    //                 <div class="item-view">
    //                     <div class="item-view-header">
    //                     <a href=story.url target="_blank">
    //                         <h1>{story.title}</h1>
    //                     </a>
    //                     <span class="host">
    //                         "("{story.domain}")"
    //                     </span>
    //                     {story.user.map(|user| view! { <p class="meta">
    //                         {story.points}
    //                         " points | by "
    //                         <A href=format!("/users/{user}")>{user.clone()}</A>
    //                         {format!(" {}", story.time_ago)}
    //                     </p>})}
    //                     </div>
    //                     <div class="item-view-comments">
    //                     <p class="item-view-comments-header">
    //                         {if story.comments_count.unwrap_or_default() > 0 {
    //                             format!("{} comments", story.comments_count.unwrap_or_default())
    //                         } else {
    //                             "No comments yet.".into()
    //                         }}
    //                     </p>
    //                     <ul class="comment-children">
    //                         <For
    //                             each=move || story.comments.clone().unwrap_or_default()
    //                             key=|comment| comment.id
    //                             let:comment
    //                         >
    //                             <Comment comment />
    //                         </For>
    //                     </ul>
    //                 </div>
    //             </div>
    //         }})}
    //     </Suspense>
    // }
}
