import { fulfillOne } from "../../../../lib/valhalla/delivery";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function POST(request: Request) {
  const key=process.env.VALHALLA_WORKER_SECRET;
  if (!key || request.headers.get("authorization") !== `Bearer ${key}`) return new Response(null,{status:401});
  if (process.env.VALHALLA_WORKER_ENABLED !== "true") return Response.json({error:"Worker disabled"},{status:503});
  try { return Response.json(await fulfillOne(), {headers:{"Cache-Control":"no-store"}}); }
  catch { return Response.json({error:"Worker failed; retry permitted"},{status:503}); }
}
