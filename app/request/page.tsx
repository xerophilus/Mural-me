import type {Metadata} from "next";
import RequestForm from "@/components/request-form";
import {configured} from "@/lib/supabase";
import {ticket} from "@/lib/security";
export const dynamic="force-dynamic";
export const metadata:Metadata={title:"Show Marc Your Wall",description:"Send a wall photo and a few details to begin your custom mural project.",alternates:{canonical:"/request"}};
export default function RequestPage(){let token="";try{if(configured())token=ticket()}catch{}return <RequestForm token={token}/>}
