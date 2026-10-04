"use client";
export default function Error({reset}:{reset:()=>void}){return <section className="section article"><h1>Something didn’t load.</h1><p>Please try again.</p><button className="button" onClick={reset}>Try again</button></section>}
