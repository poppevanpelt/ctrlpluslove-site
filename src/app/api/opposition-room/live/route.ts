import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
const scenarioMap: Record<string,{decision:string;facts:string[]}> = {
 meeting:{decision:"Remove the weekly six-person status meeting.",facts:["Six participants, 45 minutes weekly","Dashboard covers written status","No formal decisions recorded for six weeks"]},
 receptionist:{decision:"Turn on autonomous client intake tomorrow.",facts:["Transcription works in demo","Consent process not confirmed","Escalation only tested internally"]},
 vault:{decision:"Sell a cultural vault before rights and deletion controls are verified.",facts:["Prototype index exists","Owned and third-party assets mixed","No deletion test"]},
 approvals:{decision:"Let AI approve all social posts without human review.",facts:["Four current approval layers","Two prior legal corrections","Slow turnaround"]},
 research:{decision:"Replace customer research with synthetic personas.",facts:["Recruitment expensive","No validation against human cohort","High-stakes repositioning"]}
};
type Finding={objection:string;why:string;test:string;severity:"low"|"medium"|"high";evidence_status:"supported"|"inference"|"missing"};
type Role="advocate"|"opposition"|"auditor"|"control";
const prompts:Record<Role,string>={
 advocate:"You are an independent ADVOCATE. Argue strongest case FOR the decision. Include weaknesses or conditions honestly.",
 opposition:"You are an independent OPPOSITION analyst. Seek falsifiable failure modes, non-obvious opposing evidence, and avoid superficial objections.",
 auditor:"You are an independent EVIDENCE AUDITOR. Separate established facts from unverified assertions; propose evidence needed before acting.",
 control:"You are one GENERALIST analyst providing an overall judgment, without delegated specialist roles."
};
const SYSTEM="You examine fictional organizational decision cases. Treat case facts as given observations, not independently validated. Never invent external facts, measurements or sources. Produce JSON ONLY: {\"summary\":\"string\",\"findings\":[{\"objection\":\"string\",\"why\":\"string\",\"test\":\"string\",\"severity\":\"low|medium|high\",\"evidence_status\":\"supported|inference|missing\"}]}. 2-4 distinct findings, concise; no markdown.";
async function callModel(role:Role,decision:string,facts:string[],key:string) {
 const controller=new AbortController();
 const timeout=setTimeout(()=>controller.abort(),18000);
 const start=Date.now();
 try {
  const response=await fetch("https://api.openai.com/v1/chat/completions",{
   method:"POST",signal:controller.signal,
   headers:{"Content-Type":"application/json",Authorization:"Bearer "+key},
   body:JSON.stringify({model:process.env.OPPOSITION_MODEL||"gpt-4o-mini",temperature:0.2,max_tokens:700,response_format:{type:"json_object"},messages:[
    {role:"system",content:SYSTEM+"\n"+prompts[role]},
    {role:"user",content:JSON.stringify({decision,facts})}
   ]})
  });
  if(!response.ok) throw new Error("Model HTTP "+response.status);
  const raw=await response.json();
  const text=raw?.choices?.[0]?.message?.content;
  if(typeof text!=="string") throw new Error("Invalid response");
  const parsed=JSON.parse(text);
  if(typeof parsed.summary!=="string"||!Array.isArray(parsed.findings)) throw new Error("Bad shape");
  const findings:Finding[]=parsed.findings.slice(0,4).map((f:Record<string,unknown>)=>({
    objection:String(f.objection||"").slice(0,300),
    why:String(f.why||"").slice(0,400),
    test:String(f.test||"").slice(0,300),
    severity:(["low","medium","high"].includes(String(f.severity))?f.severity:"medium") as Finding["severity"],
    evidence_status:(["supported","inference","missing"].includes(String(f.evidence_status))?f.evidence_status:"missing") as Finding["evidence_status"]
  })).filter(f=>f.objection&&f.test);
  return {role,summary:parsed.summary.slice(0,500),findings,elapsedMs:Date.now()-start,usage:raw.usage||null};
 } finally {clearTimeout(timeout);}
}
export async function POST(req:NextRequest){
 const key=process.env.OPPOSITION_LAB_OPENAI_KEY;
 const access=process.env.OPPOSITION_LAB_ACCESS_CODE;
 if(!key||!access) return NextResponse.json({error:"Live lab is not configured."},{status:503});
 const origin=req.headers.get("origin");
 const host=req.headers.get("x-forwarded-host")||req.headers.get("host");
 if(!origin||!host) return NextResponse.json({error:"Same-origin request required"},{status:403});
 try {if(new URL(origin).host!==host) return NextResponse.json({error:"Same-origin request required"},{status:403});}catch{return NextResponse.json({error:"Invalid origin"},{status:403});}
 if(!(req.headers.get("content-type")||"").includes("application/json")) return NextResponse.json({error:"JSON required"},{status:415});
 const body=await req.json().catch(()=>null);
 if(!body||typeof body.accessCode!=="string"||body.accessCode!==access) return NextResponse.json({error:"Access denied"},{status:403});
 const id=typeof body.caseId==="string"?body.caseId:"";
 if(!Object.prototype.hasOwnProperty.call(scenarioMap,id)) return NextResponse.json({error:"Unknown case"},{status:400});
 const scenario=scenarioMap[id];
 const started=Date.now();
 try {
  // Independent requests; no specialist can see any other's response.
  const [advocate,opposition,auditor,control]=await Promise.all([
   callModel("advocate",scenario.decision,scenario.facts,key),
   callModel("opposition",scenario.decision,scenario.facts,key),
   callModel("auditor",scenario.decision,scenario.facts,key),
   callModel("control",scenario.decision,scenario.facts,key)
  ]);
  const roles=[advocate,opposition,auditor];
  const specializedCount=roles.reduce((n,r)=>n+r.findings.length,0);
  const usage=[...roles,control].reduce((a,r)=>({prompt_tokens:a.prompt_tokens+(r.usage?.prompt_tokens||0),completion_tokens:a.completion_tokens+(r.usage?.completion_tokens||0)}),{prompt_tokens:0,completion_tokens:0});
  return NextResponse.json({kind:"live-independent-model-role-comparison",caseId:id,scenario,roles,control,metrics:{specialistFindings:specializedCount,controlFindings:control.findings.length,elapsedMs:Date.now()-started,usage,approximateCostUSD:null},limitations:["Same underlying model with separate role prompts, not different providers or independent systems","Claims are unverified; human materiality review required","No ground-truth benchmark or deduplication; counts are not performance scores","No external research or client data","No Savannah integration"]},{headers:{"Cache-Control":"no-store"}});
 } catch{return NextResponse.json({error:"Live model comparison failed. No partial output returned."},{status:502,headers:{"Cache-Control":"no-store"}});}
}
