const fs = require('fs');
const path = require('path');

const target = process.argv[2];
if (target !== 'sqlite' && target !== 'postgresql') {
  console.error('Usage: node switch-db.js [sqlite|postgresql]');
  process.exit(1);
}

const schemaPath = path.join(__dirname, '../prisma/schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf8');

if (target === 'sqlite') {
  console.log('Switching Prisma schema to SQLite mode...');
  // Update datasource provider and url
  schema = schema.replace(/provider\s*=\s*"postgresql"/g, 'provider = "sqlite"');
  schema = schema.replace(/url\s*=\s*env\("DATABASE_URL"\)/g, 'url = "file:./dev.db"');
  
  // Remove native database types specific to PostgreSQL
  schema = schema.replace(/\s*@db\.Uuid/g, '');
  schema = schema.replace(/\s*@db\.Timestamptz/g, '');
  
  fs.writeFileSync(schemaPath, schema, 'utf8');
  console.log('Successfully switched to SQLite! Local dev.db file will be used.');
} else {
  console.log('Switching Prisma schema to PostgreSQL mode...');
  // Update datasource provider and url
  schema = schema.replace(/provider\s*=\s*"sqlite"/g, 'provider = "postgresql"');
  schema = schema.replace(/url\s*=\s*"file:\.\/dev\.db"/g, 'url = env("DATABASE_URL")');
  
  // Restore native PostgreSQL UUID attributes for UUID String fields
  // List of fields that represent UUIDs in our schema:
  // id, tenant_id, user_id, session_id, record_id, changed_by, uploaded_by
  schema = schema.replace(/(id\s+String\s+@id\s+@default\(uuid\(\)\))/g, '$1 @db.Uuid');
  schema = schema.replace(/(tenantId\s+String\??\s+@map\("tenant_id"\))/g, '$1 @db.Uuid');
  schema = schema.replace(/(userId\s+String\s+@map\("user_id"\))/g, '$1 @db.Uuid');
  schema = schema.replace(/(sessionId\s+String\s+@map\("session_id"\))/g, '$1 @db.Uuid');
  schema = schema.replace(/(recordId\s+String\s+@map\("record_id"\))/g, '$1 @db.Uuid');
  schema = schema.replace(/(changedBy\s+String\??\s+@map\("changed_by"\))/g, '$1 @db.Uuid');
  schema = schema.replace(/(uploadedBy\s+String\s+@map\("uploaded_by"\))/g, '$1 @db.Uuid');
  
  fs.writeFileSync(schemaPath, schema, 'utf8');
  console.log('Successfully switched to PostgreSQL! Database URL from .env will be used.');
}
