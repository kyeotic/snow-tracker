use anyhow::{Context, Result};
use shared::AppConfig;
use std::path::PathBuf;

pub fn load_config() -> Result<AppConfig> {
    let dirs = get_config_dirs();

    for dir in &dirs {
        let path = dir.join("config.yaml");
        if path.exists() {
            let file = std::fs::File::open(&path)
                .with_context(|| format!("failed to open {}", path.display()))?;
            return serde_yaml::from_reader(file)
                .with_context(|| format!("failed to parse {}", path.display()));
        }
    }

    anyhow::bail!("config.yaml not found in: {:?}", dirs)
}

fn get_config_dirs() -> Vec<PathBuf> {
    let mut dir = std::env::current_dir().unwrap_or_else(|_| PathBuf::from("."));
    let mut dirs = vec![dir.clone()];
    for _ in 0..4 {
        dir.pop();
        dirs.push(dir.clone());
    }
    dirs
}
