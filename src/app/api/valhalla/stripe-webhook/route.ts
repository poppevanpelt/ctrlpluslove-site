import { createHmac, timingSafeEqual } from "node:crypto";
import { fetchVerifiedCheckout } from "../../../../lib/valhalla/stripe";
import { recordPaidOrder } from "../../../../lib/valhalla/ledger";
export const runtime="nodejs";
export const dynamic="force-dynamic";
function verify(raw:string,header:string,secret:string) {
 const parts=header.split(",").map(p=>p.trim().split("="));
 const t=parts.find(([k])=>k==="t")?.[1]||"";
 if (!/^\d{10,}$/.test(t)||Math.abs(Date.now()/1000-Number(t))>300)return false;
 const hash=createHmac("sha256",secret).update(t+"."+raw).digest("hex");
 return parts.filter(([k])=>k==="v1").some(([,v])=>/^[a-f0-9]{64}$/.test(v)&&timingSafeEqual(Buffer.from(v,"hex"),Buffer.from(hash,"hex")));
}
export async function POST(request:Request){
 const secret=process.env.STRIPE_WEBHOOK_SECRET;
 if(!secret)return Response.json({error:"Not configured"},{status:503});
 const raw=await request.text();
 if(raw.length>100000)return Response.json({error:"Too large"},{status:413});
 if(!verify(raw,request.headers.get("stripe-signature")||"",secret))return Response.json({error:"Invalid signature"},{status:400});
 let event:{id?:string;type?:string;data?:{object?:{id?:string}}};
 try{event=JSON.parse(raw)}catch{return Response.json({error:"Bad payload"},{status:400})}
 if(!event.id||!event.type)return Response.json({error:"Bad event"},{status:400});
 if(!["checkout.session.completed","checkout.session.async_payment_succeeded"].includes(event.type))return Response.json({received:true,ignored:true});
 if(!event.data?.object?.id)return Response.json({error:"Missing checkout"},{status:400});
 try{
  const order=await fetchVerifiedCheckout(event.data.object.id);
  const result=await recordPaidOrder(event.id,event.type,order);
  return Response.json({received:true,duplicate:result.duplicate});
 }catch{return Response.json({error:"Verification or persistence failed"},{status:503})}
}
