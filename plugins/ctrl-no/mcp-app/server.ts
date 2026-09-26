import {registerAppResource,registerAppTool,RESOURCE_MIME_TYPE} from "@modelcontextprotocol/ext-apps/server";
import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import {z} from "zod";
import fs from "node:fs/promises";
import path from "node:path";
const URI="ui://ctrl-no/decision.html";const DIST=path.resolve(process.cwd(),"dist");
const schema=z.object({haveTo:z.enum(["YES","NO","UNCLEAR"]),haveToReason:z.string(),haveToNow:z.enum(["YES","NO","UNCLEAR"]),haveToNowReason:z.string(),pressure:z.string(),move:z.enum(["PAY","SIGN","AGREE","WAIT","VERIFY","WALK AWAY","OTHER"]),sayThis:z.string(),keep:z.string()});
export function createServer(){const server=new McpServer({name:"ctrl+no",version:"0.1.0"});registerAppTool(server,"render_ctrl_no",{title:"Render ctrl+no decision check",description:"Render the final ctrl+no decision check after the ctrl-no skill has judged the evidence. Pass the completed fields exactly.",inputSchema:schema,outputSchema:schema,_meta:{ui:{resourceUri:URI}}},async(input)=>({content:[{type:"text",text:`ctrl+no: ${input.move}. ${input.haveTo}/${input.haveToNow}`}],structuredContent:input}));registerAppResource(server,"ctrl+no decision surface",URI,{mimeType:RESOURCE_MIME_TYPE},async()=>({contents:[{uri:URI,mimeType:RESOURCE_MIME_TYPE,text:await fs.readFile(path.join(DIST,"mcp-app.html"),"utf8")}]}));return server;}