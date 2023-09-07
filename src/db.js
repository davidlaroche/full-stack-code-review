import fs from "fs";

import sqlite3 from "sqlite3";

const filepath = "csv.db";

export function createDbConnection() {
  if (fs.existsSync(filepath)) {
    return new sqlite3.Database(filepath);
  } else {
    let db = new sqlite3.Database(filepath, (error) => {
      if (error) {
        return console.error(error.message);
      }
      createTable(db);
    });
    console.log("Connection with SQLite has been established");
    return db;
  }
}

function createTable(db) {
  db.exec(`
    CREATE TABLE export
    (
      ID INTEGER PRIMARY KEY AUTOINCREMENT,
      owner_email VARCHAR(255) NOT NULL,
      url   VARCHAR(255) NOT NULL,
      username   VARCHAR(255) DEFAULT NULL,
      password   VARCHAR(255) DEFAULT NULL,
      totp   VARCHAR(255) DEFAULT NULL,
      extra   VARCHAR(255) DEFAULT NULL,
      name   VARCHAR(255) NOT NULL,
      grouping   VARCHAR(255) DEFAULT NULL,
      fav   VARCHAR(255) NOT NULL DEFAULT 0
    );
  `);
}
