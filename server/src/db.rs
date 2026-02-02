use anyhow::Result;
use rusqlite::Connection;
use std::sync::Mutex;

pub struct Database {
    conn: Mutex<Connection>,
}

impl Database {
    pub fn new() -> Result<Self> {
        let path = std::env::var("DB_PATH").unwrap_or_else(|_| "./snow.db".to_string());
        let conn = Connection::open(path)?;
        Ok(Self {
            conn: Mutex::new(conn),
        })
    }

    pub fn init(&self) -> Result<()> {
        let conn = self.conn.lock().unwrap();
        conn.execute_batch(
            "CREATE TABLE IF NOT EXISTS cache (
                key TEXT PRIMARY KEY,
                data TEXT NOT NULL,
                updated_at INTEGER NOT NULL DEFAULT (unixepoch())
            )",
        )?;
        Ok(())
    }

    pub fn get_cached(&self, key: &str) -> Result<Option<String>> {
        let conn = self.conn.lock().unwrap();
        let mut stmt = conn.prepare("SELECT data FROM cache WHERE key = ?1")?;
        let result = stmt.query_row([key], |row| row.get::<_, String>(0));
        match result {
            Ok(data) => Ok(Some(data)),
            Err(rusqlite::Error::QueryReturnedNoRows) => Ok(None),
            Err(e) => Err(e.into()),
        }
    }

    pub fn set_cached(&self, key: &str, data: &str) -> Result<()> {
        let conn = self.conn.lock().unwrap();
        conn.execute(
            "INSERT OR REPLACE INTO cache (key, data, updated_at) VALUES (?1, ?2, unixepoch())",
            [key, data],
        )?;
        Ok(())
    }
}
