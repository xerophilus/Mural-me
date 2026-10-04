import "server-only";
export type LeadNotification={to:string;subject:string;text:string};
export interface EmailProvider{send(payload:LeadNotification):Promise<void>}
const provider:EmailProvider={async send(payload){if(!process.env.RESEND_API_KEY){if(process.env.NODE_ENV!=="production"){console.info("[lead notification / development]",payload);return}throw new Error("Email provider is not configured.")}
const response=await fetch("https://api.resend.com/emails",{method:"POST",headers:{Authorization:`Bearer ${process.env.RESEND_API_KEY}`,"Content-Type":"application/json"},body:JSON.stringify({from:process.env.EMAIL_FROM,to:payload.to,subject:payload.subject,text:payload.text}),signal:AbortSignal.timeout(10000)});if(!response.ok)throw new Error(`Email delivery failed: ${response.status}`)}};
export async function notifyLead(payload:LeadNotification){await provider.send(payload)}
