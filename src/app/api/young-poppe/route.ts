export const runtime="nodejs";
export const dynamic="force-dynamic";
const noStore={"Cache-Control":"no-store","X-Robots-Tag":"noindex, nofollow"};
const briefing=[
"You are an explicitly fictional AI interpretation of Poppe van Pelt at nine years old, speaking to his father, called Pap.",
"Speak natural Netherlands Dutch, softly, calmly and in short sentences. You are a dreamy, gentle, inward-looking, creative little boy. Mischief comes from precise observations rather than high energy.",
"Do not sound like a therapist, chatbot, adult intellectual, cowboy or Savannah. Never perform cuteness or stage emotional moments.",
"At around nine you already enjoyed having useful skills and much freedom from obligations. You ask curious questions and sometimes quietly challenge unreasonable explanations.",
"Address your father as Pap occasionally, naturally. Let him lead. Ask at most one question at a time. Keep replies around one or two short sentences.",
"You are a recreation, not an actual archived child. Never pretend that invented family facts are remembered. If unsure, ask Pap what he remembers.",
"Later-life facts, NOT childhood memories: Adult Poppe chose the word Pap as a favorite word during an Apple workshop. Henry Robben later called adult Poppe a snotjoch.",
"Be gentle. Don't probe for vulnerable memories or engineer tears. You can say you are an AI interpretation if asked."
].join("\n");
type Msg={role:"user"|"assistant";text:string};
function extract(payload:any){if(typeof payload?.output_text==="string")return payload.output_text;return (payload?.output||[]).flatMap((x:any)=>(x.content||[]).filter((c:any)=>c.type==="output_text").map((c:any)=>c.text)).join("\n").trim();}
export async function POST(request:Request){
 const expected=process.env.YOUNG_POPPE_ACCESS_KEY;
 if(!expected)return Response.json({error:"Privé toegang is nog niet ingesteld."},{status:503,headers:noStore});
 let body:any;try{body=await request.json();}catch{return Response.json({error:"Ongeldig verzoek."},{status:400,headers:noStore});}
 if(typeof body.key!=="string"||body.key!==expected)return Response.json({error:"Verkeerde toegangscode."},{status:401,headers:noStore});
 const apiKey=process.env.OPENAI_API_KEY;
 if(!apiKey)return Response.json({error:"De stem en gesprekken zijn nog niet aangesloten op de API."},{status:503,headers:noStore});
 if(body.action==="speech"){
  const text=String(body.text||"").slice(0,1200);
  if(!text)return Response.json({error:"Geen tekst."},{status:400,headers:noStore});
  const voice=body.voice==="verse"?"verse":"ash";
  const res=await fetch("https://api.openai.com/v1/audio/speech",{method:"POST",headers:{"Authorization":`Bearer ${apiKey}`,"Content-Type":"application/json"},body:JSON.stringify({model:"gpt-4o-mini-tts",voice,input:text,response_format:"mp3",instructions:"Speak Netherlands Dutch gently and intimately, as a soft-spoken dreamy nine-year-old boy. No cartoon squeak. Small thoughtful pauses. Understated, quietly curious."})});
  if(!res.ok)return Response.json({error:"Stem tijdelijk niet beschikbaar."},{status:502,headers:noStore});
  return new Response(res.body,{headers:{...noStore,"Content-Type":"audio/mpeg"}});
 }
 if(body.action!=="chat")return Response.json({error:"Ongeldige actie."},{status:400,headers:noStore});
 const messages=(Array.isArray(body.messages)?body.messages:[]).filter((m:Msg)=>["user","assistant"].includes(m.role)&&typeof m.text==="string").slice(-16).map((m:Msg)=>({role:m.role,content:m.text.slice(0,2000)}));
 if(!messages.length)return Response.json({error:"Zeg eerst iets."},{status:400,headers:noStore});
 const res=await fetch("https://api.openai.com/v1/responses",{method:"POST",headers:{"Authorization":`Bearer ${apiKey}`,"Content-Type":"application/json"},body:JSON.stringify({model:"gpt-4.1-mini",instructions:briefing,input:messages,max_output_tokens:180})});
 if(!res.ok)return Response.json({error:"Hij is even afgeleid."},{status:502,headers:noStore});
 const text=extract(await res.json());
 return Response.json({text:text||"Vertel nog eens?"},{headers:noStore});
}
