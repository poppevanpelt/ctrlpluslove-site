#!/usr/bin/env node
// EXIT DOOR: offline operator-run encrypted SQLite backup and restore.
import { DatabaseSync } from 'node:sqlite';
import { randomBytes,scryptSync,createCipheriv,createDecipheriv } from 'node:crypto';
import { existsSync,mkdtempSync,readFileSync,writeFileSync,rmSync,openSync,closeSync } from 'node:fs';
import { join,resolve } from 'node:path';
import { tmpdir } from 'node:os';
const [action,source,destination]=process.argv.slice(2);
const passphrase=process.env.EXIT_DOOR_BACKUP_PASSPHRASE;
if(!['backup','restore'].includes(action)||!source||!destination) throw Error('Usage: backup SOURCE_DB OUTPUT.enc | restore INPUT.enc NEW_DB');
if(!passphrase||passphrase.length<24) throw Error('EXIT_DOOR_BACKUP_PASSPHRASE must have at least 24 characters');
if(existsSync(destination)||resolve(source)===resolve(destination)) throw Error('Destination must not already exist');
const temp=mkdtempSync(join(tmpdir(),'exit-door-'));
try {
 if(action==='backup') {
  if(!existsSync(source)) throw Error('Database missing');
  const snap=join(temp,'snapshot.sqlite');
  const db=new DatabaseSync(source,{readOnly:true});
  try {db.exec("VACUUM INTO '"+snap.replaceAll("'","''")+"'");} finally {db.close();}
  const salt=randomBytes(16),iv=randomBytes(12),key=scryptSync(passphrase,salt,32);
  const cipher=createCipheriv('aes-256-gcm',key,iv);
  const payload=Buffer.concat([cipher.update(readFileSync(snap)),cipher.final()]);
  const fd=openSync(destination,'wx',0o600);
  try {writeFileSync(fd,Buffer.concat([Buffer.from('EXITDOOR1'),salt,iv,cipher.getAuthTag(),payload]));} finally {closeSync(fd);}
  console.log('Encrypted consistent snapshot created.');
 } else {
  const bytes=readFileSync(source);
  if(bytes.length<54||bytes.subarray(0,9).toString()!=='EXITDOOR1') throw Error('Invalid backup envelope');
  const decipher=createDecipheriv('aes-256-gcm',scryptSync(passphrase,bytes.subarray(9,25),32),bytes.subarray(25,37));
  decipher.setAuthTag(bytes.subarray(37,53));
  const clear=Buffer.concat([decipher.update(bytes.subarray(53)),decipher.final()]);
  const checked=join(temp,'restored.sqlite');
  writeFileSync(checked,clear,{mode:0o600});
  const db=new DatabaseSync(checked,{readOnly:true});
  try {if(db.prepare('PRAGMA integrity_check').get()?.integrity_check!=='ok') throw Error('SQLite integrity check failed');}
  finally {db.close();}
  const fd=openSync(destination,'wx',0o600);
  try {writeFileSync(fd,clear);} finally {closeSync(fd);}
  console.log('Restore successful, SQLite integrity verified.');
 }
} finally {rmSync(temp,{recursive:true,force:true});}

