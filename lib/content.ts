// Curated public content. Shapes mirror the artists / projects / project_images tables
// so this file can later be replaced by database reads without touching page components.

export type ProjectImage = {src:string;alt:string;width:number;height:number};
export type Project = {slug:string;artistId:string;title:string;location:string;category:string;featured:boolean;description:string;cover:ProjectImage;images:ProjectImage[]};
export type Artist = {
 id:string;slug:string;name:string;firstName:string;
 /** Short role/location line used under the name, e.g. in the header wordmark. */
 role:string;region:string;
 bio:string;email:string;phone:string;socialLinks:{label:string;url:string}[];profileImage:string;
 serviceAreas:string[];serviceAreaNote:string;
};

export const artists: Artist[] = [{
 id: "b76b7a25-b062-42c8-8dc6-a474bcc2a730", slug: "marc-phillips", name: "Marc Phillips", firstName: "Marc",
 role: "Mural artist", region: "Western Maryland",
 // Draft written from the work shown on the site. Marc should approve or replace it before launch.
 bio: "Marc Phillips paints custom murals around Cumberland and Western Maryland — from postcard-style hometown tributes packed with local landmarks to bold lettering on exterior brick. Every project starts the same way: a wall, a place, and the people who will see it every day.",
 email: "", phone: "", socialLinks: [], profileImage: "",
 serviceAreas: ["Cumberland, MD", "Frostburg, MD", "Hagerstown, MD", "Morgantown, WV"],
 serviceAreaNote: "Surrounding Maryland, West Virginia & Pennsylvania areas.",
}];

const img = {
 greetings: {src:"/greetings-from-cumberland.jpg",alt:"Greetings from Cumberland mural by Marc Phillips, with local landmarks and businesses illustrated inside large postcard-style letters",width:1200,height:673},
 greetingsContext: {src:"/cumberland-mural-in-context.jpg",alt:"Greetings from Cumberland mural by Marc Phillips in its interior setting",width:960,height:683},
 fortHill: {src:"/fort-hill-sentinels.jpg",alt:"Red and white Fort Hill Sentinels mascot and lettering painted by Marc Phillips on an exterior brick wall",width:960,height:1280},
} satisfies Record<string,ProjectImage>;

export const projects: Project[] = [
 {slug:"greetings-from-cumberland",artistId:artists[0].id,title:"Greetings from Cumberland",location:"Cumberland, Maryland",category:"Interior mural",featured:true,description:"A postcard-style mural celebrating Cumberland through local landmarks, businesses, and bold hand-painted lettering.",cover:img.greetingsContext,images:[img.greetings,img.greetingsContext]},
 {slug:"fort-hill-sentinels",artistId:artists[0].id,title:"Fort Hill Sentinels",location:"",category:"Exterior mural",featured:true,description:"Bold red-and-white lettering and a Sentinel mascot, painted directly onto exterior brick.",cover:img.fortHill,images:[img.fortHill]},
];

/** The artist this deployment presents at the site root. When the hub launches, artist pages move under /artists/[slug]. */
export const primaryArtist = artists[0];

export const site = {
 name: primaryArtist.name,
 url: process.env.NEXT_PUBLIC_SITE_URL || (process.env.NODE_ENV === "production" ? "https://mural-me.vercel.app" : "http://localhost:3000"),
 subheading: `Custom murals by ${primaryArtist.region} artist ${primaryArtist.name}.`,
 heroImage: img.greetings,
};

export const getArtist = (slug?:string|null) => artists.find(a=>a.slug===slug);
export const getArtistById = (id:string) => artists.find(a=>a.id===id);
export const projectsBy = (artistId:string) => projects.filter(p=>p.artistId===artistId);
export const getProject = (slug:string) => projects.find(p=>p.slug===slug);
export const ctaLabel = (a:Artist) => `Show ${a.firstName} your wall`;
export const imageAlt = (src:string) => projects.flatMap(p=>p.images).find(i=>i.src===src)?.alt ?? "Mural";

/** Fills {first} / {name} tokens so shared copy can be reused across artists. */
export const fill = (text:string,a:Artist) => text.replaceAll("{first}",a.firstName).replaceAll("{name}",a.name);

export const landingPages: Record<string,{title:string;eyebrow:string;intro:string;image:string;sections:{title:string;text:string}[]}> = {
 "commercial-murals": {title:"Give your business a wall worth remembering.",eyebrow:"Commercial murals",intro:"A custom mural can welcome customers, tell your story, or give a space a distinct identity. Start with a photo of your wall and an idea of what it needs to do.",image:img.greetingsContext.src,sections:[{title:"Make the space work for you",text:"Share how people use the space, your brand guidelines, and where the mural will be seen. A storefront, office, or restaurant each asks for a different approach."},{title:"Plan around your business",text:"Mention opening hours, access restrictions, and your preferred installation window. Surface preparation, wall size, and access all shape the scope and quote."}]},
 "residential-murals": {title:"Make a room unmistakably yours.",eyebrow:"Residential murals",intro:"From a quiet nature-inspired wall to a playful children’s room, a mural can change the feeling of a home. Share the room, the wall, and what you imagine living with.",image:img.greetings.src,sections:[{title:"Think about the whole room",text:"Photos showing furniture, light, and adjacent walls help explain your space. You can include colors or inspiration images, even if your idea is still taking shape."},{title:"A few practical details",text:"Tell {first} whether the wall is indoors or outdoors, its approximate size, and any texture or existing finish. Exact measurements can be discussed later."}]},
 "public-art": {title:"A shared wall. A shared sense of place.",eyebrow:"Public art murals",intro:"Public murals can connect a place with the people who use it. Tell {first} about your community, your site, and the story you want to explore.",image:img.fortHill.src,sections:[{title:"Start with the people and the place",text:"Include the project organizer, intended audience, and themes that matter locally. Community input and approval requirements are helpful to identify early."},{title:"Check permissions and access",text:"Confirm who owns the wall and whether approvals, permits, or access equipment may be needed. Share any funding or scheduling constraints with your inquiry."}]},
 "cumberland-md": {title:"A new story for your Cumberland wall.",eyebrow:"Cumberland, Maryland",intro:"Based around Western Maryland and Cumberland, {name} welcomes custom mural inquiries for businesses, homes, and community spaces.",image:img.greetings.src,sections:[{title:"From an empty wall to an idea",text:"Send photos taken from a few angles. Include the neighborhood or city, whether the wall is inside or outside, and what you would like the mural to bring to the space."},{title:"Plan for your site",text:"Outdoor surface condition, weather exposure, and access can affect a mural project. A photo and approximate dimensions make the first conversation more useful."}]},
 "morgantown-wv": {title:"Something memorable for your Morgantown space.",eyebrow:"Morgantown, West Virginia",intro:"{first} considers mural projects in Morgantown and surrounding West Virginia areas. Share your location and scope so travel and availability can be discussed.",image:img.fortHill.src,sections:[{title:"Show the setting",text:"Whether it is a hospitality space, home, or community wall, include photos of the wall and its surroundings. Explain who will see it and the mood or story you have in mind."},{title:"Talk through the logistics",text:"Include your timeline, approximate size, and any access limitations. Travel, preparation, and scheduling will be considered before a concept and quote are agreed."}]},
};
