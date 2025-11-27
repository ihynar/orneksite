const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.PGSSLMODE === "require" ? { rejectUnauthorized: false } : undefined,
});

async function runMigrations() {
  const migrationsDir = path.join(__dirname, "..", "db", "migrations");
  const files = fs
    .readdirSync(migrationsDir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  for (const file of files) {
    const sql = fs.readFileSync(path.join(migrationsDir, file), "utf8");
    console.log(`> Running migration: ${file}`);
    await pool.query(sql);
  }
}

if (require.main === module) {
  runMigrations()
    .then(() => {
      console.log("Migrations tamamlandı");
      process.exit(0);
    })
    .catch((err) => {
      console.error("Migration hatası", err);
      process.exit(1);
    });
}

module.exports = runMigrations;
