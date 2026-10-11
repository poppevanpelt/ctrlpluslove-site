import { addMemory, memoryForOrder } from "../../../../lib/valhalla/memory-store";
export const runtime="nodejs";
export const dynamic="force-dynamic";
const headers={"Cache-Control":"private, no-store","Referrer-Policy":"no-referrer"};
export async function POST(request:Request){
 if(process.env.VALHALLA_MEMORY_ENABLED!=="true")return Response.json({error:"Unavailable"},{status:503,headers});
 const raw=await request.text();
 if(raw.length>6000)return Response.json({error:"Too large"},{status:413,headers});
 let body:Record<string,unknown>;
 try{body=JSON.parse(raw)}catch{return Response.json({error:"Invalid JSON"},{status:400,headers})}
 const id=body.orderId,token=body.privateToken;
 if(typeof id!=="string"||!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)||typeof token!=="string"||!/^[a-f0-9]{64}$/.test(token))return Response.json({error:"Invalid access"},{status:400,headers});
 try{
  if(body.action==="read")return Response.json({entries:await memoryForOrder(id,token)},{headers});
  if(body.action==="append"){
   const ok=await addMemory(id,token,body.entry);
   return Response.json({saved:ok},{status:ok?200:403,headers});
  }
  return Response.json({error:"Invalid action"},{status:400,headers});
 }catch{return Response.json({error:"Storage unavailable"},{status:503,headers})}
}
