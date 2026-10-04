import {NextResponse} from "next/server";
import {sameOrigin} from "@/lib/security";
export async function POST(req:Request){if(!sameOrigin(req))return new Response("Forbidden",{status:403});const r=NextResponse.redirect(new URL("/admin/login",req.url),303);r.cookies.delete("marc-admin");return r}
