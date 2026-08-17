CREATE TABLE IF NOT EXISTS comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL,
  parent_id INTEGER REFERENCES comments(id),
  nickname TEXT NOT NULL,
  email TEXT,
  message TEXT NOT NULL,
  is_author INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'approved' | 'rejected'
  ip_hash TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_comments_slug_status ON comments(slug, status);
CREATE INDEX IF NOT EXISTS idx_comments_parent ON comments(parent_id);
