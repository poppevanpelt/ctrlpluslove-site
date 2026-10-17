import { DatabaseSync } from 'node:sqlite';
import { mkdtempSync,readFileSync,rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import assert from 'node:assert/strict';
const folder=mkdtempSync(join(tmpdir(),'exit-door-test-'));
const src=join(folder,'test.db'),enc=join(folder,'test.enc'),dst=join(folder,'restored.db');
const env={...process.env,EXIT_DOOR_BACKUP_PASSPHRASE:'a-test-only-passphrase-that-is-long-enough-2026'};
try {
 const db=new DatabaseSync(src);db.exec("PRAGMA journal_mode=WAL; CREATE TABLE messages (id INTEGER PRIMARY KEY, text TEXT); INSERT INTO messages(text) VALUES ('sample only');");db.close();
 for(const args of [['backup',src,enc],['restore',enc,dst]]) {
  const r=spawnSync(process.execPath,[new URL('../scripts/exit-door-sqlite-backup.mjs',import.meta.url).pathname,...args],{env,encoding:'utf8'});
  assert.equal(r.status,0,r.stderr);
 }
 const restored=new DatabaseSync(dst,{readOnly:true});
 try {assert.equal(restored.prepare('SELECT text FROM messages').get().text,'sample only');} finally {restored.close();}
 assert(!readFileSync(enc).includes(Buffer.from('sample only')));
 const r=spawnSync(process.execPath,[new URL('../scripts/exit-door-sqlite-backup.mjs',import.meta.url).pathname,'restore',enc,join(folder,'bad.db')],{env:{...env,EXIT_DOOR_BACKUP_PASSPHRASE:'a-wrong-passphrase-that-is-also-long-enough'},encoding:'utf8'});
 assert.notEqual(r.status,0);
 console.log('PASS: consistent snapshot, encrypted payload, restore, wrong-passphrase rejection');
} finally {rmSync(folder,{recursive:true,force:true});}

