#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_opener::init())
    .invoke_handler(tauri::generate_handler![search_places])
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while building tauri application");
}

#[tauri::command]
async fn search_places(query: String) -> Result<String, String> {
  let query = query.trim();
  if query.is_empty() || query.chars().count() > 200 {
    return Err("Search query must contain between 1 and 200 characters".to_string());
  }

  reqwest::Client::builder()
    .user_agent(concat!("Trailforge/", env!("CARGO_PKG_VERSION")))
    .timeout(std::time::Duration::from_secs(15))
    .build()
    .map_err(|error| format!("Could not create geocoding client: {error}"))?
    .get("https://nominatim.openstreetmap.org/search")
    .query(&[
      ("q", query),
      ("format", "jsonv2"),
      ("limit", "5"),
      ("polygon_geojson", "1"),
    ])
    .send()
    .await
    .map_err(|error| format!("Geocoding request failed: {error}"))?
    .error_for_status()
    .map_err(|error| format!("Geocoding service returned an error: {error}"))?
    .text()
    .await
    .map_err(|error| format!("Could not read geocoding response: {error}"))
}
