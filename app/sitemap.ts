import type {MetadataRoute} from "next";
import {site,landingPages,projects} from "@/lib/content";
export default function sitemap():MetadataRoute.Sitemap{return ["",...Object.keys(landingPages),...projects.map(p=>`work/${p.slug}`),"about","request","privacy"].map(p=>({url:`${site.url}/${p}`,changeFrequency:"monthly",priority:p===""?1:0.7}))}
