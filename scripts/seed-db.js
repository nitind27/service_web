const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

async function runSeed() {
  console.log('--- Connecting to MySQL Database ---');
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true,
  });

  console.log('Connected! Reading database.sql...');
  const sqlPath = path.join(__dirname, '..', 'database.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');

  console.log('Executing SQL schema and seed queries...');
  await connection.query(sql);

  console.log('SUCCESS! Database allservice_db created and seeded successfully.');
  await connection.end();
}

runSeed().catch(err => {
  console.error('Database seed error:', err);
  process.exit(1);
});
