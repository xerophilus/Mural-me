import "server-only";
import {createHmac,timingSafeEqual,randomUUID} from "node:crypto";
import {cookies} from "next/headers";
export function sign(value:string){const key=process.env.UPLOAD_SIGNING_SECRET||process.env.ADMIN_SESSION_SECRET;if(!key||key.length<32)throw new Error("Server signing secret must contain at least 32 characters.");return createHmac("sha256",key).update(value).digest("hex")}
export function equal(a:string,b:string){const x=Buffer.from(a),y=Buffer.from(b);return x.length===y.length&&timingSafeEqual(x,y)}
export function ticket(){const value=`${randomUUID()}.${Date.now()+3600000}`;return `${value}.${sign(value)}`}
export function verifyTicket(t:string){const parts=t.split(".");if(parts.length!==3)return null;const [id,expires,sig]=parts;try{if(Number(expires)<Date.now()||!equal(sign(`${id}.${expires}`),sig))return null;return id}catch{return null}}
export async function isAdmin(){const c=(await cookies()).get("marc-admin")?.value;if(!c||!process.env.ADMIN_SESSION_SECRET)return false;const [expires,sig]=c.split(".");return Number(expires)>Date.now()&&equal(adminSign(expires),sig||"")}
export function adminSign(v:string){return createHmac("sha256",process.env.ADMIN_SESSION_SECRET!).update(v).digest("hex")}
export function sameOrigin(req:Request){return req.headers.get("origin")===new URL(req.url).origin}
