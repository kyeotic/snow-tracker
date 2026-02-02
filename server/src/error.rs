use thiserror::Error;

#[derive(Debug, Error)]
#[allow(dead_code)]
pub enum AppError {
    #[error("failed to fetch URL: {0}")]
    Fetch(#[from] reqwest::Error),

    #[error("failed to parse HTML")]
    Parse(String),

    #[error("database error: {0}")]
    Database(#[from] rusqlite::Error),

    #[error("element not found: {0}")]
    ElementNotFound(String),
}
