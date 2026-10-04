import type {Metadata} from "next";
import { site } from "@/lib/content";
import {Header,Footer} from "@/components/shell";
import "./globals.css";
export const metadata: Metadata = {metadataBase:new URL(site.url),title:{default:"Marc Phillips | Custom Mural Artist in Western Maryland",template:"%s | Marc Phillips"},description:"Transform your wall with a custom mural by Western Maryland artist Marc Phillips. Share a wall photo to start a commercial, residential, or public art project.",alternates:{canonical:"/"},openGraph:{type:"website",siteName:site.name,title:"Transform Your Wall Into Something People Remember.",description:site.subheading,images:[{url:site.heroImage,width:1536,height:1024,alt:"Concept mural placeholder"}]},twitter:{card:"summary_large_image"}};
export default function RootLayout({children}:{children:React.ReactNode}) {return <html lang="en"><body><a className="skip" href="#main">Skip to content</a><Header/><main id="main">{children}</main><Footer/></body></html>}
