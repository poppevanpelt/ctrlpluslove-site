import { realityMemoryForOrder } from "../../../../lib/valhalla/reality-memory";
export const runtime="nodejs";
export const dynamic="force-dynamic";
const headers={"Cache-Control":"private, no-store","Referrer-Policy":"no-referrer"};
export async function POST(request:Request){
 if(process.env.VALHALLA_MEMORY_ENABLED!=="true")return Response.json({error:"Unavailable"},{status:503,headers});
 const body=await request.json().catch(()=>null);
 const id=body?.orderId,token=body?.privateToken;
 if(typeof id!=="string"||!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)||typeof token!=="string"||!/^[a-f0-9]{64}$/.test(token))
  return Response.json({error:"Invalid request"},{status:400,headers});
 try{
  const result=await realityMemoryForOrder(id,token);
  return result?Response.json(result,{headers}):Response.json({error:"Not found"},{status:404,headers});
 }catch{return Response.json({error:"Unavailable"},{status:503,headers});}
}
