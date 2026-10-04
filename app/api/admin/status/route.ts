import {NextResponse} from "next/server";
import {isAdmin,sameOrigin} from "@/lib/security";
import {statuses} from "@/lib/schema";
import {db} from "@/lib/supabase";
import {z} from "zod";
export async function POST(req:Request){if(!sameOrigin(req)||!await isAdmin())return new Response("Forbidden",{status:403});const f=await req.formData();const parsed=z.object({id:z.uuid(),status:z.enum(statuses)}).safeParse(Object.fromEntries(f));if(!parsed.success)return new Response("Invalid status",{status:400});const {error}=await db().from("project_requests").update({status:parsed.data.status}).eq("id",parsed.data.id);if(error)return new Response("Could not update lead",{status:503});return NextResponse.redirect(new URL("/admin",req.url),303)}
