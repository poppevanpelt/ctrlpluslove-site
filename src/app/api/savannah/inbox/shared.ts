import { createHmac,timingSafeEqual } from "node:crypto";
import { DatabaseSync } from "node:sqlite";
import type { NextRequest } from "next/server";
export const clientCookie="savannah_inbox_client";
const ownerCookie="savannah_owner_session";
const ownerEmail=()=>String(process.env.SAVANNAH_OWNER_EMAIL||"").toLowerCase().trim();
export function configured(){return Boolean(process.env.SAVANNAH_SESSION_SECRET && process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && ownerEmail() && process.env.SAVANNAH_INBOX_DB);}
export function recipients():Record<string,string>{
  try{
    const parsed=JSON.parse(process.env.SAVANNAH_INBOX_CLIENTS||"{}");
    if(!parsed || typeof parsed!=="object" || Array.isArray(parsed))return {};
    return Object.fromEntries(Object.entries(parsed).filter(([email,room])=>typeof room==="string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)).map(([email,room])=>[email.toLowerCase(),String(room).toLowerCase()]));
  }catch{return {};}
}
export function sign(raw:string){return createHmac("sha256",process.env.SAVANNAH_SESSION_SECRET||"disabled").update(raw).digest("base64url");}
export function readCookie(request:NextRequest,name:string):{email:string;exp:number}|null{
  if(!configured())return null;
  const raw=request.cookies.get(name)?.value||"";
  const index=raw.lastIndexOf(".");
  if(index<1)return null;
  const payload=raw.slice(0,index),actual=Buffer.from(raw.slice(index+1)),expected=Buffer.from(sign(payload));
  if(actual.length!==expected.length || !timingSafeEqual(actual,expected))return null;
  try{
    const data=JSON.parse(Buffer.from(payload,"base64url").toString("utf8"));
    if(typeof data.email!=="string" || data.exp<Date.now())return null;
    return {email:data.email.toLowerCase(),exp:data.exp};
  }catch{return null;}
}
export function isOwner(request:NextRequest){return readCookie(request,ownerCookie)?.email===ownerEmail();}
export function clientEmail(request:NextRequest){
  const email=readCookie(request,clientCookie)?.email;
  return email && recipients()[email]?email:null;
}
export function database(){
  if(!configured())throw Error("Inbox not configured");
  const db=new DatabaseSync(process.env.SAVANNAH_INBOX_DB!);
  db.exec(`CREATE TABLE IF NOT EXISTS messages(
    id TEXT PRIMARY KEY,recipient TEXT NOT NULL,room TEXT NOT NULL,
    headline TEXT NOT NULL,reason TEXT NOT NULL,surprise TEXT,
    next_move TEXT NOT NULL,evidence TEXT NOT NULL,created_at TEXT NOT NULL,
    approved_at TEXT NOT NULL,read_at TEXT
  );CREATE INDEX IF NOT EXISTS message_recipient_idx ON messages(recipient,created_at);`);
  return db;
}
