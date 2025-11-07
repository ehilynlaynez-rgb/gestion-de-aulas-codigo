
PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('admin','tecnico','instructor')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS rooms (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  module TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#3b82f6',
  is_occupied INTEGER DEFAULT 0,
  occupied_by_user_id INTEGER,
  FOREIGN KEY (occupied_by_user_id) REFERENCES users(id)
);
CREATE TABLE IF NOT EXISTS resources (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  code TEXT UNIQUE,
  type TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS room_resources (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  room_id INTEGER NOT NULL,
  resource_id INTEGER NOT NULL,
  FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
  FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS reservations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  room_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  start_time DATETIME NOT NULL,
  end_time DATETIME NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('active','released')) DEFAULT 'active',
  FOREIGN KEY (room_id) REFERENCES rooms(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE TABLE IF NOT EXISTS damage_reports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  room_id INTEGER,
  resource_id INTEGER,
  user_id INTEGER NOT NULL,
  description TEXT NOT NULL,
  image_path TEXT,
  status TEXT NOT NULL CHECK(status IN ('reportado','en_proceso','reparado')) DEFAULT 'reportado',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  repaired_by_user_id INTEGER,
  repaired_at DATETIME,
  FOREIGN KEY (room_id) REFERENCES rooms(id),
  FOREIGN KEY (resource_id) REFERENCES resources(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (repaired_by_user_id) REFERENCES users(id)
);
CREATE TABLE IF NOT EXISTS resource_loans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  resource_id INTEGER NOT NULL,
  from_room_id INTEGER NOT NULL,
  to_room_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  start_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  due_time DATETIME NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('active','returned')) DEFAULT 'active',
  FOREIGN KEY (resource_id) REFERENCES resources(id),
  FOREIGN KEY (from_room_id) REFERENCES rooms(id),
  FOREIGN KEY (to_room_id) REFERENCES rooms(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE TABLE IF NOT EXISTS notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL,
  payload TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
