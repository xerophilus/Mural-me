// Regenerates public/brand/logo*.svg with Montserrat outlined to paths (no font needed at render time).
// Run: npm i --no-save opentype.js @fontsource/montserrat && node scripts/generate-logos.mjs
// Montserrat is SIL Open Font License; outlining is permitted.
import opentype from "opentype.js";
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
const root=path.join(path.dirname(fileURLToPath(import.meta.url)),"..");
const dir=path.join(root,"node_modules/@fontsource/montserrat/files/");
const buf=f=>{const b=fs.readFileSync(dir+f);return b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength)};
const bold=opentype.parse(buf("montserrat-latin-800-normal.woff")),reg=opentype.parse(buf("montserrat-latin-400-normal.woff"));
const n=v=>{if(!Number.isFinite(v))throw new Error("bad coord");return +v.toFixed(2)};
const pd=path=>path.commands.map(c=>c.type==="M"||c.type==="L"?`${c.type}${n(c.x)} ${n(c.y)}`:c.type==="Q"?`Q${n(c.x1)} ${n(c.y1)} ${n(c.x)} ${n(c.y)}`:c.type==="C"?`C${n(c.x1)} ${n(c.y1)} ${n(c.x2)} ${n(c.y2)} ${n(c.x)} ${n(c.y)}`:"Z").join("");
const CAP=100, cap=f=>f.tables.os2.sCapHeight/f.unitsPerEm, size=CAP/cap(bold);
const OUT=path.join(root,"public/brand/");
const C={ink:"#1F2326",teal:"#1B8A9A",orange:"#F26B2A",white:"#FFFFFF"};
const markPaths=(stem)=>[[stem,"M40 40H88V188L40 216Z"],[C.teal,"M88 40L128 80V136L88 96Z"],[C.orange,"M128 80L168 40H216V216L168 188V96L128 136Z"]];
// text paths, baseline y given
// Manual per-glyph layout with kerning + tracking (opentype.js letterSpacing drops glyphs).
function word(font,str,x,y,track){const p=new opentype.Path();const g=font.stringToGlyphs(str);const sc=size/font.unitsPerEm;
 g.forEach((gl,i)=>{p.extend(gl.getPath(x,y,size));x+=gl.advanceWidth*sc+track*size;if(g[i+1])x+=font.getKerningValue(gl,g[i+1])*sc});return p}
function build({stem,text,stacked}){
  const markH=CAP*1.45, s=markH/176; // mark content box is 176 units (40..216)
  let parts=[],w,h;
  if(!stacked){
    const mx=0,my=0; const textX=176*s+CAP*0.42, base=my+markH/2+CAP/2;
    const m=word(bold,"MURAL",textX,base,-0.01); const mb=m.getBoundingBox();
    const e=word(reg,"ME",mb.x2+size*0.24,base,0); const eb=e.getBoundingBox();
    parts.push(`<g transform="translate(${mx-40*s} ${my-40*s}) scale(${s})">${markPaths(stem).map(([f,d])=>`<path fill="${f}" d="${d}"/>`).join("")}</g>`);
    parts.push(`<path fill="${text}" d="${pd(m)}"/><path fill="${text}" d="${pd(e)}"/>`);
    w=eb.x2; h=markH;
  } else {
    const m=word(bold,"MURAL",0,0,-0.01),mb=m.getBoundingBox(); const e=word(reg,"ME",mb.x2+size*0.24,0,0),eb=e.getBoundingBox();
    const tw=eb.x2-mb.x1, big=CAP*2.6, s2=big/176, gap=CAP*0.55;
    w=Math.max(tw,big); const tx=(w-tw)/2-mb.x1, ty=big+gap+CAP;
    const m2=word(bold,"MURAL",tx,ty,-0.01), e2=word(reg,"ME",tx+mb.x2+size*0.24,ty,0);
    parts.push(`<g transform="translate(${(w-big)/2-40*s2} ${-40*s2}) scale(${s2})">${markPaths(stem).map(([f,d])=>`<path fill="${f}" d="${d}"/>`).join("")}</g>`);
    parts.push(`<path fill="${text}" d="${pd(m2)}"/><path fill="${text}" d="${pd(e2)}"/>`);
    h=ty;
  }
  const pad=CAP*0.1, r=n=>Math.round(n*100)/100;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${r(-pad)} ${r(-pad)} ${r(w+2*pad)} ${r(h+2*pad)}" role="img" aria-label="Mural Me">${parts.join("")}</svg>\n`;
}
fs.writeFileSync(OUT+"logo.svg",build({stem:C.ink,text:C.ink}));
fs.writeFileSync(OUT+"logo-reverse.svg",build({stem:C.white,text:C.white}));
fs.writeFileSync(OUT+"logo-stacked.svg",build({stem:C.ink,text:C.ink,stacked:true}));
fs.writeFileSync(OUT+"logo-stacked-reverse.svg",build({stem:C.white,text:C.white,stacked:true}));
console.log("size",size.toFixed(1));
