import type {Metadata,Viewport} from "next";
import {Bricolage_Grotesque,Instrument_Serif} from "next/font/google";
import { site, primaryArtist as a } from "@/lib/content";
import {Header,Footer} from "@/components/shell";
import "./globals.css";
const sans=Bricolage_Grotesque({subsets:["latin"],variable:"--font-sans",display:"swap"});
const serif=Instrument_Serif({subsets:["latin"],weight:"400",style:["normal","italic"],variable:"--font-serif",display:"swap"});
export const viewport:Viewport={themeColor:"#20241f"};
export const metadata: Metadata = {metadataBase:new URL(site.url),title:{default:`${a.name} | Custom ${a.role} in ${a.region}`,template:`%s | ${a.name}`},description:`Transform your wall with a custom mural by ${a.region} artist ${a.name}. Share a wall photo to start a commercial, residential, or public art project.`,alternates:{canonical:"/"},openGraph:{type:"website",siteName:site.name,title:"Transform your wall into something people remember.",description:site.subheading,images:[{url:site.heroImage.src,width:site.heroImage.width,height:site.heroImage.height,alt:site.heroImage.alt}]},twitter:{card:"summary_large_image"}};
export default function RootLayout({children}:{children:React.ReactNode}) {return <html lang="en" className={`${sans.variable} ${serif.variable}`}><body><a className="skip" href="#main">Skip to content</a><Header/><main id="main">{children}</main><Footer/></body></html>}
