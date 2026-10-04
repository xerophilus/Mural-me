import type {Metadata} from "next";
import RequestForm from "@/components/request-form";
import {configured} from "@/lib/supabase";
import {getArtist,primaryArtist} from "@/lib/content";
import {ticket} from "@/lib/security";
export const dynamic="force-dynamic";
export const metadata:Metadata={title:"Show us your wall",description:"Send a wall photo and a few details to begin your custom mural project.",alternates:{canonical:"/request"}};
export default async function RequestPage({searchParams}:{searchParams:Promise<{artist?:string}>}){const a=getArtist((await searchParams).artist)??primaryArtist;let token="";try{if(configured())token=ticket()}catch{}return <RequestForm token={token} artist={{slug:a.slug,firstName:a.firstName}}/>}
