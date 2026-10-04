import {z} from "zod";
export const projectTypes=["Business","Restaurant / Bar","Home","School","Public / Community","Event","Other"] as const;
export const budgets=["Under $1,000","$1,000–$2,500","$2,500–$5,000","$5,000–$10,000","$10,000+","Not sure yet"] as const;
export const timelines=["ASAP","Within a month","1–3 months","3–6 months","Just exploring"] as const;
export const statuses=["new","contacted","quoting","won","lost","archived"] as const;
export const requestSchema=z.object({
 customer_name:z.string().trim().min(2,"Please enter your name.").max(100),customer_email:z.email("Enter a valid email.").max(254),customer_phone:z.string().trim().max(30),preferred_contact:z.enum(["email","phone"]),
 city:z.string().trim().min(2,"Enter your city.").max(100),state:z.string().trim().regex(/^[A-Za-z]{2}$/, "Use a two-letter state abbreviation."),zip:z.string().regex(/^\d{5}(-\d{4})?$/,"Enter a valid ZIP code."),indoor_outdoor:z.enum(["indoor","outdoor"]),
 wall_width:z.string().max(10),wall_height:z.string().max(10),wall_dimensions_unknown:z.boolean(),units:z.enum(["feet","meters"]),wall_material:z.string().max(100),notes:z.string().max(2000),description:z.string().trim().min(10,"Tell us a little more about your idea.").max(5000),project_type:z.enum(projectTypes),budget_range:z.union([z.enum(budgets),z.literal("")]),timeline:z.enum(timelines),website:z.string().max(0),consent:z.boolean().refine(v=>v,{message:"Please agree to sharing your request with Marc."}),
}).superRefine((v,c)=>{if(!v.wall_dimensions_unknown){for(const key of ["wall_width","wall_height"] as const){if(!Number.isFinite(Number(v[key]))||Number(v[key])<=0||Number(v[key])>10000)c.addIssue({code:"custom",path:[key],message:"Enter a positive dimension or choose ‘I don’t know’."})}}if(v.preferred_contact==="phone"&&!v.customer_phone.trim())c.addIssue({code:"custom",path:["customer_phone"],message:"Add a phone number or choose email."})});
export type RequestValues=z.infer<typeof requestSchema>;
export const imageSchema=z.object({path:z.string().regex(/^[a-f0-9-]{36}\/[a-f0-9-]{36}\.(jpg|png|webp)$/),type:z.enum(["wall","inspiration"])});
