import "server-only";
import {createHmac} from "node:crypto";
import {db} from "@/lib/supabase";
export async function allow(req:Request,scope:string,max:number,seconds:number){const secret=process.env.UPLOAD_SIGNING_SECRET||process.env.ADMIN_SESSION_SECRET;if(!secret)return false;const ip=req.headers.get("x-vercel-forwarded-for")||req.headers.get("x-forwarded-for")?.split(",")[0]||"local";const key=scope+":"+createHmac("sha256",secret).update(ip).digest("hex");const {data,error}=await db().rpc("consume_rate_limit",{rate_key:key,max_hits:max,window_seconds:seconds});if(error)throw error;return data===true}
