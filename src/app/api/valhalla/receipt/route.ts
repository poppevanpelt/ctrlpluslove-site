import { database } from "../../../../lib/valhalla/database";
import { digest } from "../../../../lib/valhalla/receipt-store";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function POST(request:Request) {
 if(process.env.VALHALLA_DELIVERY_ENABLED!=="true")return Response.json({error:"Unavailable"},{status:503});
 const body=await request.json().catch(()=>null);
 const orderId=body?.orderId, token=body?.privateToken;
 if(typeof orderId!=="string"||!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(orderId)||typeof token!=="string"||!/^[a-f0-9]{64}$/.test(token)){
  return Response.json({error:"Invalid request"},{status:400});
 }
 try{
  const result=await database().query<{receipt_text:string}>(`
    SELECT a.receipt_text FROM valhalla.receipt_artifacts a
    JOIN valhalla.receipt_drafts d ON d.order_id=a.order_id
    JOIN valhalla.orders o ON o.order_id=a.order_id
    JOIN valhalla.deliveries f ON f.order_id=a.order_id
    WHERE a.order_id=$1 AND d.access_hash=$2 AND o.state='fulfilled' AND f.state='complete'
  `,[orderId,digest(token)]);
  if(!result.rowCount)return Response.json({error:"Not found"},{status:404,headers:{"Cache-Control":"no-store"}});
  return new Response(result.rows[0].receipt_text,{headers:{"Content-Type":"text/plain; charset=utf-8","Content-Disposition":"attachment; filename=conviction-receipt.txt","Cache-Control":"private, no-store","X-Content-Type-Options":"nosniff","Referrer-Policy":"no-referrer"}});
 }catch{return Response.json({error:"Unavailable"},{status:503})}
}
