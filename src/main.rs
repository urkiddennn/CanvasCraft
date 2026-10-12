use axum::{
    extract::{Multipart, Path, Query, State},
    http::{header, StatusCode},
    response::{IntoResponse, Response},
    routing::{get, post},
    Json, Router,
};
use serde::{Deserialize, Serialize};
use sqlx::{sqlite::SqlitePoolOptions, SqlitePool};
use std::sync::Arc;
use tower_http::cors::CorsLayer;
use tower_http::services::ServeDir;

#[derive(Clone)]
struct AppState {
    db: SqlitePool,
    http_client: reqwest::Client,
}

#[derive(Serialize, Deserialize, sqlx::FromRow)]
pub struct DesignProject {
    pub id: String,
    pub title: String,
    pub canvas_json: String,
    pub thumbnail: Option<String>,
    pub width: i32,
    pub height: i32,
    pub updated_at: String,
}

#[derive(Serialize, Deserialize)]
pub struct SaveProjectPayload {
    pub id: Option<String>,
    pub title: String,
    pub canvas_json: String,
    pub thumbnail: Option<String>,
    pub width: Option<i32>,
    pub height: Option<i32>,
}

#[derive(Deserialize)]
pub struct PhotoQuery {
    pub q: Option<String>,
    pub page: Option<u32>,
    pub limit: Option<u32>,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct OnlinePhoto {
    pub id: String,
    pub title: String,
    pub author: String,
    pub thumb_url: String,
    pub full_url: String,
    pub source: String,
}

#[derive(Deserialize)]
pub struct StickerQuery {
    pub q: Option<String>,
    pub prefix: Option<String>,
    pub limit: Option<u32>,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct OnlineSticker {
    pub id: String,
    pub name: String,
    pub collection: String,
    pub svg_url: String,
}

#[derive(Deserialize)]
pub struct ProxyQuery {
    pub url: String,
}

#[derive(Serialize)]
pub struct UploadResponse {
    pub url: String,
    pub filename: String,
}

#[derive(Deserialize)]
pub struct ExportPayload {
    pub image_data: String, // data:image/png;base64,...
    pub format: Option<String>,
}

#[tokio::main]
async fn main() {
    let _ = std::fs::create_dir_all("assets/uploads");

    let db = SqlitePoolOptions::new()
        .max_connections(5)
        .connect("sqlite:canva_local.db?mode=rwc")
        .await
        .expect("Failed to initialize SQLite database");

    sqlx::query(
        "CREATE TABLE IF NOT EXISTS projects (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            canvas_json TEXT NOT NULL,
            thumbnail TEXT,
            width INTEGER NOT NULL DEFAULT 1080,
            height INTEGER NOT NULL DEFAULT 1080,
            updated_at TEXT NOT NULL
        )",
    )
    .execute(&db)
    .await
    .expect("Failed to initialize table");

    let http_client = reqwest::Client::builder()
        .user_agent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36")
        .timeout(std::time::Duration::from_secs(12))
        .build()
        .unwrap_or_else(|_| reqwest::Client::new());

    let state = Arc::new(AppState { db, http_client });

    let app = Router::new()
        // Project routes
        .route("/api/projects", get(list_projects).post(save_project))
        .route("/api/projects/:id", get(get_project).delete(delete_project))
        // Zero-config online free asset engines
        .route("/api/online/photos", get(fetch_online_photos))
        .route("/api/online/stickers", get(fetch_online_stickers))
        .route("/api/online/fonts", get(list_online_fonts))
        .route("/api/online/mockups", get(list_online_mockups))
        .route("/api/online/templates", get(list_online_templates))
        .route("/api/proxy", get(proxy_asset))
        // File upload & export
        .route("/api/upload", post(upload_file))
        .route("/api/export", post(export_render))
        // Serve local uploads and assets
        .nest_service("/assets", ServeDir::new("assets"))
        // Serve UI
        .fallback_service(ServeDir::new("public"))
        .layer(CorsLayer::permissive())
        .with_state(state);

    let addr = "127.0.0.1:3000";
    println!("🚀 EazeGraphics Server listening on http://{}", addr);
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

// --- PROJECT MANAGEMENT ---

async fn list_projects(
    State(state): State<Arc<AppState>>,
) -> Result<Json<Vec<DesignProject>>, StatusCode> {
    let projects = sqlx::query_as::<_, DesignProject>(
        "SELECT id, title, canvas_json, thumbnail, width, height, updated_at FROM projects ORDER BY updated_at DESC",
    )
    .fetch_all(&state.db)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(projects))
}

async fn get_project(
    State(state): State<Arc<AppState>>,
    Path(id): Path<String>,
) -> Result<Json<DesignProject>, StatusCode> {
    let project = sqlx::query_as::<_, DesignProject>(
        "SELECT id, title, canvas_json, thumbnail, width, height, updated_at FROM projects WHERE id = ?",
    )
    .bind(id)
    .fetch_optional(&state.db)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?
    .ok_or(StatusCode::NOT_FOUND)?;

    Ok(Json(project))
}

async fn save_project(
    State(state): State<Arc<AppState>>,
    Json(payload): Json<SaveProjectPayload>,
) -> Result<Json<DesignProject>, StatusCode> {
    let id = payload.id.unwrap_or_else(|| uuid::Uuid::new_v4().to_string());
    let now = chrono::Utc::now().to_rfc3339();
    let width = payload.width.unwrap_or(1080);
    let height = payload.height.unwrap_or(1080);

    sqlx::query(
        "INSERT INTO projects (id, title, canvas_json, thumbnail, width, height, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET
            title=excluded.title,
            canvas_json=excluded.canvas_json,
            thumbnail=excluded.thumbnail,
            width=excluded.width,
            height=excluded.height,
            updated_at=excluded.updated_at",
    )
    .bind(&id)
    .bind(&payload.title)
    .bind(&payload.canvas_json)
    .bind(&payload.thumbnail)
    .bind(width)
    .bind(height)
    .bind(&now)
    .execute(&state.db)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(DesignProject {
        id,
        title: payload.title,
        canvas_json: payload.canvas_json,
        thumbnail: payload.thumbnail,
        width,
        height,
        updated_at: now,
    }))
}

async fn delete_project(
    State(state): State<Arc<AppState>>,
    Path(id): Path<String>,
) -> Result<StatusCode, StatusCode> {
    sqlx::query("DELETE FROM projects WHERE id = ?")
        .bind(id)
        .execute(&state.db)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(StatusCode::NO_CONTENT)
}

// --- FILE UPLOADS & RENDER EXPORT ---

async fn upload_file(mut multipart: Multipart) -> Result<Json<UploadResponse>, StatusCode> {
    while let Ok(Some(field)) = multipart.next_field().await {
        let file_name = field
            .file_name()
            .map(|s| s.to_string())
            .unwrap_or_else(|| "upload.png".to_string());

        let ext = file_name
            .split('.')
            .last()
            .unwrap_or("png")
            .to_lowercase();
        let safe_name = format!("{}.{}", uuid::Uuid::new_v4(), ext);
        let path = format!("assets/uploads/{}", safe_name);

        if let Ok(data) = field.bytes().await {
            if tokio::fs::write(&path, &data).await.is_ok() {
                return Ok(Json(UploadResponse {
                    url: format!("/assets/uploads/{}", safe_name),
                    filename: file_name,
                }));
            }
        }
    }
    Err(StatusCode::BAD_REQUEST)
}

async fn export_render(Json(payload): Json<ExportPayload>) -> Result<Response, StatusCode> {
    let clean_b64 = if let Some(idx) = payload.image_data.find(',') {
        &payload.image_data[idx + 1..]
    } else {
        &payload.image_data
    };

    use base64::Engine;
    let bytes = base64::engine::general_purpose::STANDARD
        .decode(clean_b64)
        .map_err(|_| StatusCode::BAD_REQUEST)?;

    let is_jpg = payload.format.as_deref() == Some("jpeg") || payload.format.as_deref() == Some("jpg");
    let content_type = if is_jpg { "image/jpeg" } else { "image/png" };

    Ok((
        StatusCode::OK,
        [
            (header::CONTENT_TYPE, content_type),
            (
                header::CONTENT_DISPOSITION,
                if is_jpg {
                    "attachment; filename=\"eazegraphics_design.jpg\""
                } else {
                    "attachment; filename=\"eazegraphics_design.png\""
                },
            ),
        ],
        bytes,
    )
        .into_response())
}

// --- ONLINE FREE ASSET ENGINES (ZERO CONFIG) ---

// 1. Stock Photos via Picsum & Wikimedia Commons
async fn fetch_online_photos(
    State(state): State<Arc<AppState>>,
    Query(query): Query<PhotoQuery>,
) -> Json<Vec<OnlinePhoto>> {
    let page = query.page.unwrap_or(1);
    let limit = query.limit.unwrap_or(24);
    let search = query.q.unwrap_or_default().trim().to_lowercase();

    let mut results: Vec<OnlinePhoto> = Vec::new();

    if !search.is_empty() {
        let url = format!(
            "https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={}&gsrlimit={}&gsroffset={}&prop=imageinfo&iiprop=url|extmetadata&format=json",
            urlencoding(&search),
            limit,
            (page - 1) * limit
        );

        if let Ok(resp) = state.http_client.get(&url).send().await {
            if let Ok(json) = resp.json::<serde_json::Value>().await {
                if let Some(pages) = json.pointer("/query/pages").and_then(|p| p.as_object()) {
                    for (page_id, page_data) in pages {
                        if let Some(imageinfo) = page_data.pointer("/imageinfo/0") {
                            let img_url = imageinfo.pointer("/url").and_then(|u| u.as_str()).unwrap_or("");
                            let title = page_data.pointer("/title").and_then(|t| t.as_str()).unwrap_or("Wikimedia photo");
                            let clean_title = title.trim_start_matches("File:").to_string();
                            let is_image = img_url.ends_with(".jpg") || img_url.ends_with(".jpeg") || img_url.ends_with(".png") || img_url.ends_with(".webp");

                            if is_image && !img_url.is_empty() {
                                results.push(OnlinePhoto {
                                    id: format!("wiki-{}", page_id),
                                    title: clean_title,
                                    author: "Wikimedia Commons (Free Public Domain)".to_string(),
                                    thumb_url: format!("/api/proxy?url={}", urlencoding(img_url)),
                                    full_url: format!("/api/proxy?url={}", urlencoding(img_url)),
                                    source: "Wikimedia".to_string(),
                                });
                            }
                        }
                    }
                }
            }
        }
    }

    if results.is_empty() {
        let url = format!("https://picsum.photos/v2/list?page={}&limit={}", page, limit);
        if let Ok(resp) = state.http_client.get(&url).send().await {
            if let Ok(items) = resp.json::<Vec<serde_json::Value>>().await {
                for item in items {
                    let id = item.pointer("/id").and_then(|v| v.as_str()).unwrap_or("0");
                    let author = item.pointer("/author").and_then(|v| v.as_str()).unwrap_or("Unsplash Artist");
                    results.push(OnlinePhoto {
                        id: format!("picsum-{}", id),
                        title: format!("Photo by {}", author),
                        author: author.to_string(),
                        thumb_url: format!("https://picsum.photos/id/{}/400/300", id),
                        full_url: format!("https://picsum.photos/id/{}/1200/800", id),
                        source: "Picsum / Unsplash CC0".to_string(),
                    });
                }
            }
        }
    }

    if results.is_empty() {
        results = get_fallback_photos();
    }

    Json(results)
}

// 2. Online Stickers / Vector Icons via Iconify Open API (200,000+ free vectors)
async fn fetch_online_stickers(
    State(state): State<Arc<AppState>>,
    Query(query): Query<StickerQuery>,
) -> Json<Vec<OnlineSticker>> {
    let q = query.q.unwrap_or_else(|| "sparkle".to_string());
    let prefix = query.prefix.unwrap_or_else(|| "lucide".to_string());

    let mut stickers: Vec<OnlineSticker> = Vec::new();

    let url = format!(
        "https://api.iconify.design/search?query={}&limit={}&prefixes={}",
        urlencoding(&q),
        query.limit.unwrap_or(40),
        urlencoding(&prefix)
    );

    if let Ok(resp) = state.http_client.get(&url).send().await {
        if let Ok(json) = resp.json::<serde_json::Value>().await {
            if let Some(icons) = json.pointer("/icons").and_then(|arr| arr.as_array()) {
                for icon in icons {
                    if let Some(icon_full) = icon.as_str() {
                        let parts: Vec<&str> = icon_full.split(':').collect();
                        let (coll, name) = if parts.len() == 2 {
                            (parts[0], parts[1])
                        } else {
                            (prefix.as_str(), icon_full)
                        };

                        stickers.push(OnlineSticker {
                            id: icon_full.to_string(),
                            name: name.replace('-', " ").to_string(),
                            collection: coll.to_string(),
                            svg_url: format!("https://api.iconify.design/{}/{}.svg", coll, name),
                        });
                    }
                }
            }
        }
    }

    if stickers.is_empty() {
        stickers = get_fallback_stickers();
    }

    Json(stickers)
}

// 3. Online Google Fonts Catalog
#[derive(Serialize)]
pub struct FontEntry {
    pub name: String,
    pub family: String,
    pub category: String,
    pub weights: Vec<String>,
}

async fn list_online_fonts() -> Json<Vec<FontEntry>> {
    let fonts = vec![
        FontEntry { name: "Inter".into(), family: "'Inter', sans-serif".into(), category: "sans-serif".into(), weights: vec!["300".into(), "400".into(), "600".into(), "800".into()] },
        FontEntry { name: "Outfit".into(), family: "'Outfit', sans-serif".into(), category: "sans-serif".into(), weights: vec!["400".into(), "700".into(), "900".into()] },
        FontEntry { name: "Playfair Display".into(), family: "'Playfair Display', serif".into(), category: "serif".into(), weights: vec!["400".into(), "700".into(), "900".into()] },
        FontEntry { name: "Montserrat".into(), family: "'Montserrat', sans-serif".into(), category: "sans-serif".into(), weights: vec!["400".into(), "600".into(), "800".into()] },
        FontEntry { name: "Space Grotesk".into(), family: "'Space Grotesk', sans-serif".into(), category: "display".into(), weights: vec!["500".into(), "700".into()] },
        FontEntry { name: "Bebas Neue".into(), family: "'Bebas Neue', display".into(), category: "display".into(), weights: vec!["400".into()] },
        FontEntry { name: "Caveat".into(), family: "'Caveat', cursive".into(), category: "handwriting".into(), weights: vec!["400".into(), "700".into()] },
        FontEntry { name: "JetBrains Mono".into(), family: "'JetBrains Mono', monospace".into(), category: "monospace".into(), weights: vec!["400".into(), "700".into()] },
        FontEntry { name: "Cinzel".into(), family: "'Cinzel', serif".into(), category: "serif".into(), weights: vec!["600".into(), "800".into()] },
        FontEntry { name: "Syne".into(), family: "'Syne', sans-serif".into(), category: "display".into(), weights: vec!["700".into(), "800".into()] },
        FontEntry { name: "Pacifico".into(), family: "'Pacifico', cursive".into(), category: "handwriting".into(), weights: vec!["400".into()] },
        FontEntry { name: "Plus Jakarta Sans".into(), family: "'Plus Jakarta Sans', sans-serif".into(), category: "sans-serif".into(), weights: vec!["400".into(), "600".into(), "800".into()] },
    ];
    Json(fonts)
}

// 4. Free Mockups Catalog
#[derive(Serialize)]
pub struct MockupDefinition {
    pub id: String,
    pub name: String,
    pub category: String,
    pub width: u32,
    pub height: u32,
    pub screen: MockupScreenArea,
    pub frame_url: String,
}

#[derive(Serialize)]
pub struct MockupScreenArea {
    pub x: f32,
    pub y: f32,
    pub width: f32,
    pub height: f32,
    pub rx: f32,
}

async fn list_online_mockups() -> Json<Vec<MockupDefinition>> {
    let mockups = vec![
        MockupDefinition {
            id: "phone".into(),
            name: "iPhone 16 Pro".into(),
            category: "mobile".into(),
            width: 320,
            height: 640,
            screen: MockupScreenArea { x: 20.0, y: 20.0, width: 280.0, height: 600.0, rx: 42.0 },
            frame_url: "/assets/mockups/phone.svg".into(),
        },
        MockupDefinition {
            id: "laptop".into(),
            name: "MacBook Pro 16\"".into(),
            category: "desktop".into(),
            width: 640,
            height: 400,
            screen: MockupScreenArea { x: 74.0, y: 24.0, width: 492.0, height: 312.0, rx: 8.0 },
            frame_url: "/assets/mockups/laptop.svg".into(),
        },
        MockupDefinition {
            id: "tablet".into(),
            name: "iPad Pro".into(),
            category: "tablet".into(),
            width: 440,
            height: 580,
            screen: MockupScreenArea { x: 25.0, y: 25.0, width: 390.0, height: 530.0, rx: 16.0 },
            frame_url: "/assets/mockups/tablet.svg".into(),
        },
        MockupDefinition {
            id: "browser".into(),
            name: "Glass Browser Window".into(),
            category: "web".into(),
            width: 600,
            height: 400,
            screen: MockupScreenArea { x: 2.0, y: 46.0, width: 596.0, height: 350.0, rx: 0.0 },
            frame_url: "/assets/mockups/browser.svg".into(),
        },
        MockupDefinition {
            id: "billboard".into(),
            name: "Minimal Poster / Frame".into(),
            category: "print".into(),
            width: 480,
            height: 360,
            screen: MockupScreenArea { x: 30.0, y: 30.0, width: 420.0, height: 300.0, rx: 4.0 },
            frame_url: "/assets/mockups/billboard.svg".into(),
        },
    ];
    Json(mockups)
}

// 5. Online Community Templates
#[derive(Serialize)]
pub struct OnlineTemplate {
    pub id: String,
    pub title: String,
    pub category: String,
    pub width: i32,
    pub height: i32,
    pub preview: String,
    pub canvas_json: serde_json::Value,
}

async fn list_online_templates() -> Json<Vec<OnlineTemplate>> {
    let t1 = serde_json::json!({
        "background": "#0B0F19",
        "objects": [
            { "type": "rect", "left": 40, "top": 40, "width": 720, "height": 720, "rx": 24, "ry": 24, "fill": "#111827", "stroke": "#6366F1", "strokeWidth": 4 },
            { "type": "i-text", "text": "AI LAUNCH 2026", "left": 400, "top": 140, "originX": "center", "originY": "center", "fontSize": 24, "fontWeight": "bold", "fill": "#818CF8", "fontFamily": "Outfit", "charSpacing": 200 },
            { "type": "i-text", "text": "THE NEXT GEN\nCREATIVE SUITE", "left": 400, "top": 270, "originX": "center", "originY": "center", "fontSize": 52, "fontWeight": "900", "fill": "#FFFFFF", "fontFamily": "Outfit", "textAlign": "center" },
            { "type": "i-text", "text": "Zero Config · 100% Free Ecosystem · Pure Rust Core", "left": 400, "top": 390, "originX": "center", "originY": "center", "fontSize": 18, "fontWeight": "500", "fill": "#9CA3AF", "fontFamily": "Inter" },
            { "type": "rect", "left": 400, "top": 490, "originX": "center", "originY": "center", "width": 280, "height": 64, "rx": 32, "ry": 32, "fill": "#4F46E5" },
            { "type": "i-text", "text": "GET STARTED FREE", "left": 400, "top": 490, "originX": "center", "originY": "center", "fontSize": 20, "fontWeight": "bold", "fill": "#FFFFFF", "fontFamily": "Inter" }
        ]
    });

    let t2 = serde_json::json!({
        "background": "#0F172A",
        "objects": [
            { "type": "rect", "left": 60, "top": 60, "width": 1160, "height": 600, "rx": 20, "ry": 20, "fill": "#1E293B", "stroke": "#EC4899", "strokeWidth": 3 },
            { "type": "i-text", "text": "HOW TO BUILD A CANVA ALTERNATIVE", "left": 100, "top": 200, "fontSize": 54, "fontWeight": "900", "fill": "#FFFFFF", "fontFamily": "Outfit" },
            { "type": "i-text", "text": "FROM SCRATCH WITH RUST & WEBASSEMBLY", "left": 100, "top": 300, "fontSize": 34, "fontWeight": "700", "fill": "#F472B6", "fontFamily": "Space Grotesk" },
            { "type": "rect", "left": 100, "top": 420, "width": 300, "height": 60, "rx": 12, "ry": 12, "fill": "#EC4899" },
            { "type": "i-text", "text": "WATCH TUTORIAL ➔", "left": 250, "top": 450, "originX": "center", "originY": "center", "fontSize": 20, "fontWeight": "bold", "fill": "#FFFFFF", "fontFamily": "Inter" }
        ]
    });

    let t3 = serde_json::json!({
        "background": "#064E3B",
        "objects": [
            { "circle": "true", "type": "circle", "left": 400, "top": 400, "originX": "center", "originY": "center", "radius": 320, "fill": "transparent", "stroke": "#34D399", "strokeWidth": 3 },
            { "type": "i-text", "text": "“", "left": 400, "top": 230, "originX": "center", "originY": "center", "fontSize": 120, "fontWeight": "900", "fill": "#FDE047", "fontFamily": "Playfair Display" },
            { "type": "i-text", "text": "Creativity is intelligence\nhaving fun.", "left": 400, "top": 380, "originX": "center", "originY": "center", "fontSize": 44, "fontWeight": "700", "fill": "#ECFDF5", "fontFamily": "Playfair Display", "textAlign": "center" },
            { "type": "i-text", "text": "— ALBERT EINSTEIN", "left": 400, "top": 540, "originX": "center", "originY": "center", "fontSize": 18, "fontWeight": "700", "fill": "#A7F3D0", "fontFamily": "Inter", "charSpacing": 200 }
        ]
    });

    let templates = vec![
        OnlineTemplate {
            id: "tech-launch".into(),
            title: "Tech Launch Banner".into(),
            category: "social".into(),
            width: 800,
            height: 800,
            preview: "linear-gradient(135deg, #0B0F19 0%, #111827 50%, #4F46E5 100%)".into(),
            canvas_json: t1,
        },
        OnlineTemplate {
            id: "yt-masterclass".into(),
            title: "Masterclass Thumbnail".into(),
            category: "youtube".into(),
            width: 1280,
            height: 720,
            preview: "linear-gradient(135deg, #0F172A 0%, #1E293B 60%, #EC4899 100%)".into(),
            canvas_json: t2,
        },
        OnlineTemplate {
            id: "quote-minimal".into(),
            title: "Emerald Quote Card".into(),
            category: "social".into(),
            width: 800,
            height: 800,
            preview: "linear-gradient(135deg, #064E3B 0%, #047857 70%, #10B981 100%)".into(),
            canvas_json: t3,
        },
    ];

    Json(templates)
}

// 6. CORS / Streaming Proxy (bypasses CORS & canvas taint)
async fn proxy_asset(
    State(state): State<Arc<AppState>>,
    Query(query): Query<ProxyQuery>,
) -> Response {
    if !query.url.starts_with("http://") && !query.url.starts_with("https://") {
        return (StatusCode::BAD_REQUEST, "Invalid URL scheme").into_response();
    }

    match state.http_client.get(&query.url).send().await {
        Ok(resp) => {
            let status = resp.status();
            let content_type = resp
                .headers()
                .get(header::CONTENT_TYPE)
                .and_then(|v| v.to_str().ok())
                .unwrap_or("image/jpeg")
                .to_string();

            match resp.bytes().await {
                Ok(bytes) => (
                    status,
                    [
                        (header::CONTENT_TYPE, content_type),
                        (header::ACCESS_CONTROL_ALLOW_ORIGIN, "*".to_string()),
                        (header::CACHE_CONTROL, "public, max-age=86400".to_string()),
                    ],
                    bytes,
                )
                    .into_response(),
                Err(_) => (StatusCode::BAD_GATEWAY, "Failed reading remote payload").into_response(),
            }
        }
        Err(_) => (StatusCode::BAD_GATEWAY, "Failed fetching remote asset").into_response(),
    }
}

// --- HELPER FALLBACKS ---

fn urlencoding(s: &str) -> String {
    let mut encoded = String::new();
    for b in s.bytes() {
        match b {
            b'a'..=b'z' | b'A'..=b'Z' | b'0'..=b'9' | b'-' | b'_' | b'.' | b'~' => {
                encoded.push(b as char);
            }
            _ => {
                encoded.push_str(&format!("%{:02X}", b));
            }
        }
    }
    encoded
}

fn get_fallback_photos() -> Vec<OnlinePhoto> {
    vec![
        OnlinePhoto {
            id: "1015".into(),
            title: "Mountain Lake River".into(),
            author: "Alexey Topolyanskiy".into(),
            thumb_url: "https://picsum.photos/id/1015/400/300".into(),
            full_url: "https://picsum.photos/id/1015/1200/800".into(),
            source: "Picsum Photos".into(),
        },
        OnlinePhoto {
            id: "1018".into(),
            title: "Misty Pine Forest".into(),
            author: "Andrew Ridley".into(),
            thumb_url: "https://picsum.photos/id/1018/400/300".into(),
            full_url: "https://picsum.photos/id/1018/1200/800".into(),
            source: "Picsum Photos".into(),
        },
        OnlinePhoto {
            id: "1036".into(),
            title: "Snowy Mountain Peak".into(),
            author: "Dan Gold".into(),
            thumb_url: "https://picsum.photos/id/1036/400/300".into(),
            full_url: "https://picsum.photos/id/1036/1200/800".into(),
            source: "Picsum Photos".into(),
        },
        OnlinePhoto {
            id: "1067".into(),
            title: "Architectural Spiral".into(),
            author: "Kevin Bhagat".into(),
            thumb_url: "https://picsum.photos/id/1067/400/300".into(),
            full_url: "https://picsum.photos/id/1067/1200/800".into(),
            source: "Picsum Photos".into(),
        },
        OnlinePhoto {
            id: "1069".into(),
            title: "Golden Hour Ocean Wave".into(),
            author: "Marat Gilyadzinov".into(),
            thumb_url: "https://picsum.photos/id/1069/400/300".into(),
            full_url: "https://picsum.photos/id/1069/1200/800".into(),
            source: "Picsum Photos".into(),
        },
    ]
}

fn get_fallback_stickers() -> Vec<OnlineSticker> {
    vec![
        OnlineSticker {
            id: "lucide:sparkles".into(),
            name: "Sparkles".into(),
            collection: "lucide".into(),
            svg_url: "https://api.iconify.design/lucide/sparkles.svg".into(),
        },
        OnlineSticker {
            id: "lucide:flame".into(),
            name: "Flame Fire".into(),
            collection: "lucide".into(),
            svg_url: "https://api.iconify.design/lucide/flame.svg".into(),
        },
        OnlineSticker {
            id: "lucide:rocket".into(),
            name: "Rocket Launch".into(),
            collection: "lucide".into(),
            svg_url: "https://api.iconify.design/lucide/rocket.svg".into(),
        },
        OnlineSticker {
            id: "lucide:heart".into(),
            name: "Heart Like".into(),
            collection: "lucide".into(),
            svg_url: "https://api.iconify.design/lucide/heart.svg".into(),
        },
        OnlineSticker {
            id: "lucide:zap".into(),
            name: "Lightning Zap".into(),
            collection: "lucide".into(),
            svg_url: "https://api.iconify.design/lucide/zap.svg".into(),
        },
        OnlineSticker {
            id: "fluent-emoji:fire".into(),
            name: "Fire 3D".into(),
            collection: "fluent-emoji".into(),
            svg_url: "https://api.iconify.design/fluent-emoji/fire.svg".into(),
        },
        OnlineSticker {
            id: "fluent-emoji:glowing-star".into(),
            name: "Star 3D".into(),
            collection: "fluent-emoji".into(),
            svg_url: "https://api.iconify.design/fluent-emoji/glowing-star.svg".into(),
        },
        OnlineSticker {
            id: "fluent-emoji:party-popper".into(),
            name: "Party 3D".into(),
            collection: "fluent-emoji".into(),
            svg_url: "https://api.iconify.design/fluent-emoji/party-popper.svg".into(),
        },
    ]
}
