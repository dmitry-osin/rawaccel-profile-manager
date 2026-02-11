use std::io;

use serde::Serialize;

#[derive(Debug, thiserror::Error, Serialize)]
pub enum Error {
    #[error("io error: {0}")]
    Io(String),
    #[error("could not determine application data directory")]
    ConfigDirNotFound,
    #[error("configuration file not found")]
    ConfigNotFound,
    #[error("invalid RawAccel path: {0}")]
    InvalidRawAccelPath(String),
    #[error("profile not found")]
    ProfileNotFound,
    #[error("tauri error: {0}")]
    Tauri(String),
    #[error("serialization error: {0}")]
    Serialize(String),
}

impl From<tauri::Error> for Error {
    fn from(err: tauri::Error) -> Self {
        Error::Tauri(err.to_string())
    }
}

impl From<io::Error> for Error {
    fn from(err: io::Error) -> Self {
        Error::Io(err.to_string())
    }
}

impl From<serde_json::Error> for Error {
    fn from(err: serde_json::Error) -> Self {
        Error::Serialize(err.to_string())
    }
}

pub type Result<T> = std::result::Result<T, Error>;
