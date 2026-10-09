import { NextRequest, NextResponse } from "next/server";
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const COOKIE = "savannah_owner_session";
const STATE = "savannah_oauth_state";
const TTL = 60 * 60 * 8;
const owner = () => (process.env.SAVANNAH_OWNER_EMAIL || "").trim().toLowerCase();
const ready = () => Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.SAVANNAH_SESSION_SECRET && owner());
const secure = (request: NextRequest) => request.nextUrl.protocol === "https:";
const origin = (request: NextRequest) => process.env.SAVANNAH_AUTH_ORIGIN || request.nextUrl.origin;
const cookieOptions = (request: NextRequest) => ({httpOnly:true,secure:secure(request),sameSite:"lax" as const,path:"/"});
function sign(value:string) { return createHmac("sha256",process.env.SAVANNAH_SESSION_SECRET!).update(value).digest("base64url"); }
function valid(request:NextRequest) {
  if(!ready()) return false;
  const cookie=request.cookies.get(COOKIE)?.value || "";
  const [payload,signature]=cookie.split(".");
  if(!payload || !signature) return false;
  const expected=Buffer.from(sign(payload));
  const received=Buffer.from(signature);
  if(expected.length!==received.length || !timingSafeEqual(expected,received)) return false;
  try { const data=JSON.parse(Buffer.from(payload,"base64url").toString("utf8")); return data.email===owner() && data.exp > Date.now(); } catch { return false; }
}
export async function GET(request:NextRequest, context:{params:Promise<{action:string}>}) {
  const {action}=await context.params;
  if(action==="status") return NextResponse.json({authenticated:valid(request),configured:ready()},{headers:{"Cache-Control":"no-store"}});
  if(action==="logout") {
    const response=NextResponse.redirect(new URL("/savannah/",request.url));
    response.cookies.set(COOKIE,"",{...cookieOptions(request),maxAge:0});
    return response;
  }
  if(action==="login") {
    if(!ready()) return NextResponse.json({error:"Google sign-in is not configured yet."},{status:503});
    const state=randomBytes(24).toString("base64url");
    const redirect=origin(request)+"/api/savannah/auth/callback";
    const destination=new URL("https://accounts.google.com/o/oauth2/v2/auth");
    destination.searchParams.set("client_id",process.env.GOOGLE_CLIENT_ID!);
    destination.searchParams.set("redirect_uri",redirect);
    destination.searchParams.set("response_type","code");
    destination.searchParams.set("scope","openid email profile");
    destination.searchParams.set("state",state);
    destination.searchParams.set("prompt","select_account");
    const response=NextResponse.redirect(destination);
    response.cookies.set(STATE,state,{...cookieOptions(request),maxAge:600});
    return response;
  }
  if(action==="callback") {
    const state=request.nextUrl.searchParams.get("state") || "";
    const expected=request.cookies.get(STATE)?.value || "";
    const code=request.nextUrl.searchParams.get("code");
    const failure=NextResponse.redirect(new URL("/savannah/?desk=signin-error",request.url));
    failure.cookies.set(STATE,"",{...cookieOptions(request),maxAge:0});
    if(!ready() || !code || !state || !expected || state!==expected) return failure;
    try {
      const response=await fetch("https://oauth2.googleapis.com/token",{
        method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},
        body:new URLSearchParams({code,client_id:process.env.GOOGLE_CLIENT_ID!,client_secret:process.env.GOOGLE_CLIENT_SECRET!,redirect_uri:origin(request)+"/api/savannah/auth/callback",grant_type:"authorization_code"}),
        cache:"no-store"
      });
      if(!response.ok) return failure;
      const token=await response.json();
      if(typeof token.access_token!=="string") return failure;
      const identity=await fetch("https://www.googleapis.com/oauth2/v3/userinfo",{headers:{Authorization:"Bearer "+token.access_token},cache:"no-store"});
      if(!identity.ok) return failure;
      const profile=await identity.json();
      if(profile.email_verified!==true || String(profile.email||"").toLowerCase()!==owner()) return failure;
      const payload=Buffer.from(JSON.stringify({email:owner(),exp:Date.now()+TTL*1000})).toString("base64url");
      const success=NextResponse.redirect(new URL("/savannah/?desk=open",request.url));
      success.cookies.set(STATE,"",{...cookieOptions(request),maxAge:0});
      success.cookies.set(COOKIE,payload+"."+sign(payload),{...cookieOptions(request),maxAge:TTL});
      return success;
    } catch { return failure; }
  }
  return NextResponse.json({error:"Not found"},{status:404});
}
