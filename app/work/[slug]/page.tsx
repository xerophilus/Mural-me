import type {Metadata} from "next";
import Link from "next/link";
import {notFound} from "next/navigation";
import {projects,getProject,getArtistById,projectsBy,site} from "@/lib/content";
import {CTA,FinalCTA} from "@/components/shell";
import {ArrowLeft,ArrowRight} from "@/components/icons";
export const dynamicParams=false;
export function generateStaticParams(){return projects.map(p=>({slug:p.slug}))}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const p=getProject((await params).slug);if(!p)return {};const a=getArtistById(p.artistId);return {title:p.title,description:p.description,alternates:{canonical:`/work/${p.slug}`},openGraph:{url:`/work/${p.slug}`,title:`${p.title}${a?` by ${a.name}`:""}`,description:p.description,images:[{url:p.images[0].src,width:p.images[0].width,height:p.images[0].height,alt:p.images[0].alt}]}}}
export default async function ProjectPage({params}:{params:Promise<{slug:string}>}){const p=getProject((await params).slug);if(!p)notFound();const a=getArtistById(p.artistId);if(!a)notFound();
const siblings=projectsBy(a.id);const next=siblings[(siblings.indexOf(p)+1)%siblings.length];
return <><article className="section project">
<Link href="/#work" className="text-link back-link"><ArrowLeft/> All work</Link>
<header className="project-head"><div><p className="eyebrow">{p.category}{p.location&&<> / {p.location}</>}</p><h1>{p.title}</h1></div><div><p className="lede">{p.description}</p><p className="muted">By {a.name}</p></div></header>
<div className={`project-gallery count-${Math.min(p.images.length,3)}`}>{p.images.map((x,i)=><figure key={x.src} className={x.height>x.width?"tall":"wide"}><img src={x.src} alt={x.alt} width={x.width} height={x.height} loading={i?"lazy":"eager"} fetchPriority={i?undefined:"high"}/></figure>)}</div>
<aside className="project-cta"><div><p className="eyebrow">Have a wall like this?</p><h2>Start with a photo.</h2></div><CTA artist={a}/></aside>
{next&&next!==p&&<nav className="project-next" aria-label="Next project"><span className="eyebrow">Next project</span><Link href={`/work/${next.slug}`}>{next.title} <ArrowRight/></Link></nav>}
</article><FinalCTA artist={a}/>
<script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({"@context":"https://schema.org","@type":"VisualArtwork",name:p.title,artform:"Mural",description:p.description,image:p.images.map(x=>new URL(x.src,site.url).href),creator:{"@type":"Person",name:a.name},...(p.location&&{locationCreated:{"@type":"Place",name:p.location}})}).replace(/</g,"\\u003c")}}/>
</>}
