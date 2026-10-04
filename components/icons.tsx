// Inline SVG glyphs. Unicode arrows/asterisks render as colour emoji on iOS, so the UI never uses them as text.
type P={className?:string};
const base={fill:"none",stroke:"currentColor",strokeWidth:1.75,strokeLinecap:"square" as const,"aria-hidden":true,focusable:false};
export const ArrowUpRight=({className="icon"}:P)=><svg className={className} viewBox="0 0 16 16" {...base}><path d="M4.5 11.5 11.5 4.5M5.5 4.5h6v6"/></svg>;
export const ArrowDown=({className="icon"}:P)=><svg className={className} viewBox="0 0 16 16" {...base}><path d="M8 2.5v11M3.5 9 8 13.5 12.5 9"/></svg>;
export const ArrowLeft=({className="icon"}:P)=><svg className={className} viewBox="0 0 16 16" {...base}><path d="M13.5 8h-11M7 3.5 2.5 8 7 12.5"/></svg>;
export const ArrowRight=({className="icon"}:P)=><svg className={className} viewBox="0 0 16 16" {...base}><path d="M2.5 8h11M9 3.5 13.5 8 9 12.5"/></svg>;
export const Star=({className="icon"}:P)=><svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" aria-hidden focusable={false}><path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6 5.6 18.4"/></svg>;
