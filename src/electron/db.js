const { Database } = require('sqlite3').verbose();
const { join } = require('path');
const { app } = require('electron');

const db = new Database(join(app.getPath('userData'), './mydb.db'));

function prepareDatabase() {
  db.run(
    `CREATE TABLE IF NOT EXISTS buttons (
      id INTEGER NOT NULL,
      commandType TEXT,
      command TEXT,
      image BLOB,
      PRIMARY KEY (id)
    );`,
    [],
    (error) => {
      if (!error) {
        for (let i = 0; i < 18; i++) {
          db.all('SELECT id FROM buttons WHERE id = ?', [i], (err, rows) => {
            if (rows.length === 0) {
              db.run('INSERT INTO buttons (id) VALUES(?)', [i]);
            }
          });
        }
      }
    },
  );
}

module.exports = {
  db,
  prepareDatabase,
};
