const sqlite3 = require('better-sqlite3');
const { join } = require('path');
const { app } = require('electron');

const db = sqlite3(join(app.getPath('userData'), './mydb.db'));

db.prepare(
  `CREATE TABLE IF NOT EXISTS buttons (
    id INTEGER NOT NULL,
    commandType TEXT,
    command TEXT,
    image BLOB,
    PRIMARY KEY (id)
  );`
).run();

for (let i = 0; i < 18; i++) {
  const buttonId = db.prepare('SELECT id FROM buttons WHERE id = ?').bind(i).get()
  if (!buttonId) {
    db.prepare('INSERT INTO buttons (id) VALUES(?)').bind([i]).run()
  }
}

module.exports = {
  db,
};
