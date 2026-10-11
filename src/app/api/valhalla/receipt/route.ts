import { receiptForOrder } from "../../../../lib/valhalla/receipt-store";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function POST(request:Request) {
 if(process.env.VALHALLA_DELIVERY_ENABLED!=="true")return Response.json({error:"Unavailable"},{status:503});
 const body=await request.json().catch(()=>null);
 if(typeof body?.orderId!=="string"||typeof body?.accessToken!=="string")return Response.json({error:"Invalid request"},{status:400});
 try {
  const receipt=await receiptForOrder(body.orderId,body.accessToken);
  if(!receipt)return Response.json({error:"Not found"},{status:404,headers:{"Cache-Control":"no-store"}});
  return new Response(receipt,{headers:{"Content-Type":"text/plain; charset=utf-8","Content-Disposition":"attachment; filename=conviction-receipt.txt","Cache-Control":"no-store","X-Content-Type-Options":"nosniff"}});
 }catch{return Response.json({error:"Unavailable"},{status:503})}
}
