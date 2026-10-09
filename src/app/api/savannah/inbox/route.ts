import { randomUUID } from "node:crypto";
import { NextRequest,NextResponse } from "next/server";
import { clientEmail,configured,database,isOwner,recipients } from "./shared";
export const runtime="nodejs";
export const dynamic="force-dynamic";
const headers={"Cache-Control":"private, no-store"};
export async function GET(request:NextRequest){
  if(!configured())return NextResponse.json({error:"Inbox awaiting private setup"},{status:503,headers});
  const owner=isOwner(request),recipient=owner?null:clientEmail(request);
  if(!owner&&!recipient)return NextResponse.json({error:"Sign in to your inbox"},{status:401,headers});
  let db;
  try{
    db=database();
    const list=owner
      ? db.prepare("SELECT * FROM messages ORDER BY created_at DESC LIMIT 100").all()
      : db.prepare("SELECT id,room,headline,reason,surprise,next_move,evidence,created_at,read_at FROM messages WHERE recipient=? ORDER BY created_at DESC LIMIT 60").all(recipient);
    return NextResponse.json({messages:list,owner,email:recipient},{headers});
  }catch{return NextResponse.json({error:"Inbox unavailable"},{status:503,headers});}
  finally{db?.close();}
}
export async function POST(request:NextRequest){
  if(!isOwner(request))return NextResponse.json({error:"Owner approval required"},{status:403,headers});
  const body=await request.json().catch(()=>null);
  const recipient=String(body?.recipient||"").toLowerCase().trim();
  const room=recipients()[recipient];
  if(!room)return NextResponse.json({error:"Recipient is not in the approved client allowlist"},{status:400,headers});
  if(body?.consent!==true || body?.approved!==true || body?.novelty!==true)return NextResponse.json({error:"Consent, novelty and explicit approval are required"},{status:400,headers});
  const fields=["headline","reason","next_move","evidence"] as const;
  if(fields.some(field=>typeof body?.[field]!=="string" || !body[field].trim() || body[field].length>1500))return NextResponse.json({error:"Complete verifiable signal, relevance, action and evidence"},{status:400,headers});
  const id=randomUUID(),now=new Date().toISOString();let db;
  try{
    db=database();
    db.prepare("INSERT INTO messages(id,recipient,room,headline,reason,surprise,next_move,evidence,created_at,approved_at) VALUES(?,?,?,?,?,?,?,?,?,?)").run(id,recipient,room,body.headline.trim(),body.reason.trim(),String(body.surprise||"").slice(0,1500),body.next_move.trim(),body.evidence.trim(),now,now);
    return NextResponse.json({saved:true,id,delivery:"inbox_only",emailSent:false,pushSent:false},{status:201,headers});
  }catch{return NextResponse.json({error:"Could not save to persistent inbox"},{status:503,headers});}
  finally{db?.close();}
}
export async function PATCH(request:NextRequest){
  const recipient=clientEmail(request);
  if(!recipient)return NextResponse.json({error:"Client sign-in required"},{status:403,headers});
  const body=await request.json().catch(()=>null);
  if(typeof body?.id!=="string" || body.id.length>100)return NextResponse.json({error:"Invalid message"},{status:400,headers});
  let db;
  try{
    db=database();
    const r=db.prepare("UPDATE messages SET read_at=COALESCE(read_at,?) WHERE id=? AND recipient=?").run(new Date().toISOString(),body.id,recipient);
    return NextResponse.json({updated:r.changes===1},{headers});
  }catch{return NextResponse.json({error:"Could not mark read"},{status:503,headers});}
  finally{db?.close();}
}
