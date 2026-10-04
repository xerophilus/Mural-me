import "server-only";
import {createClient} from "@supabase/supabase-js";
export function configured(){return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL&&process.env.SUPABASE_SERVICE_ROLE_KEY)}
export function db(){if(!configured())throw new Error("Lead storage has not been configured.");return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.SUPABASE_SERVICE_ROLE_KEY!,{auth:{persistSession:false,autoRefreshToken:false}})}
export const bucket="request-images";
