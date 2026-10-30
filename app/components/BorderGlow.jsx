"use client";

import { useCallback, useEffect, useRef } from "react";
import "./BorderGlow.css";

function parseHSL(value){
  const match=value.match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/);
  return match?{h:+match[1],s:+match[2],l:+match[3]}:{h:78,s:100,l:60};
}

function buildGlowVars(color,intensity){
  const {h,s,l}=parseHSL(color),vars={};
  const values=[100,60,50,40,30,20,10],keys=["","-60","-50","-40","-30","-20","-10"];
  values.forEach((opacity,index)=>{vars[`--glow-color${keys[index]}`]=`hsl(${h}deg ${s}% ${l}% / ${Math.min(opacity*intensity,100)}%)`;});
  return vars;
}

const POSITIONS=["80% 55%","69% 34%","8% 6%","41% 38%","86% 85%","82% 18%","51% 4%"];
const KEYS=["--gradient-one","--gradient-two","--gradient-three","--gradient-four","--gradient-five","--gradient-six","--gradient-seven"];
const COLOR_MAP=[0,1,2,0,1,2,1];

function buildGradientVars(colors){
  const vars={};
  for(let i=0;i<7;i++) vars[KEYS[i]]=`radial-gradient(at ${POSITIONS[i]}, ${colors[Math.min(COLOR_MAP[i],colors.length-1)]} 0px, transparent 50%)`;
  vars["--gradient-base"]=`linear-gradient(${colors[0]} 0 100%)`;
  return vars;
}

const easeOut=x=>1-Math.pow(1-x,3);
const easeIn=x=>x*x*x;
function animateValue({start=0,end=100,duration=1000,delay=0,ease=easeOut,onUpdate,onEnd}){
  const begin=performance.now()+delay;let timer=0,frame=0,cancelled=false;
  const tick=()=>{if(cancelled)return;const t=Math.min(Math.max((performance.now()-begin)/duration,0),1);onUpdate(start+(end-start)*ease(t));if(t<1)frame=requestAnimationFrame(tick);else onEnd?.();};
  timer=window.setTimeout(()=>{frame=requestAnimationFrame(tick);},delay);
  return()=>{cancelled=true;window.clearTimeout(timer);if(frame)cancelAnimationFrame(frame);};
}

export default function BorderGlow({
  children,className="",edgeSensitivity=30,glowColor="78 100 60",backgroundColor="#111311",borderRadius=28,glowRadius=40,glowIntensity=1,coneSpread=25,animated=false,colors=["#c8ff35","#38bdf8","#8b5cf6"],fillOpacity=.4
}){
  const cardRef=useRef(null);
  const handlePointerMove=useCallback(event=>{
    const card=cardRef.current;if(!card)return;
    const rect=card.getBoundingClientRect(),x=event.clientX-rect.left,y=event.clientY-rect.top,cx=rect.width/2,cy=rect.height/2,dx=x-cx,dy=y-cy;
    const kx=dx===0?Infinity:cx/Math.abs(dx),ky=dy===0?Infinity:cy/Math.abs(dy);
    const edge=Math.min(Math.max(1/Math.min(kx,ky),0),1);
    let angle=dx===0&&dy===0?0:Math.atan2(dy,dx)*180/Math.PI+90;if(angle<0)angle+=360;
    card.style.setProperty("--edge-proximity",(edge*100).toFixed(3));
    card.style.setProperty("--cursor-angle",`${angle.toFixed(3)}deg`);
  },[]);

  const handlePointerLeave=useCallback(()=>{const card=cardRef.current;if(card&&!card.classList.contains("sweep-active"))card.style.setProperty("--edge-proximity","0");},[]);

  useEffect(()=>{
    if(!animated||!cardRef.current||window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;
    const card=cardRef.current,start=110,end=465;card.classList.add("sweep-active");card.style.setProperty("--cursor-angle",`${start}deg`);
    const stop=[
      animateValue({duration:500,onUpdate:v=>card.style.setProperty("--edge-proximity",v)}),
      animateValue({ease:easeIn,duration:1500,end:50,onUpdate:v=>card.style.setProperty("--cursor-angle",`${(end-start)*(v/100)+start}deg`)}),
      animateValue({ease:easeOut,delay:1500,duration:2250,start:50,end:100,onUpdate:v=>card.style.setProperty("--cursor-angle",`${(end-start)*(v/100)+start}deg`)}),
      animateValue({ease:easeIn,delay:2500,duration:1500,start:100,end:0,onUpdate:v=>card.style.setProperty("--edge-proximity",v),onEnd:()=>card.classList.remove("sweep-active")}),
    ];
    return()=>{stop.forEach(cancel=>cancel());card.classList.remove("sweep-active");};
  },[animated]);

  return <div ref={cardRef} onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave} className={`border-glow-card ${className}`.trim()} style={{"--card-bg":backgroundColor,"--edge-sensitivity":edgeSensitivity,"--border-radius":`${borderRadius}px`,"--glow-padding":`${glowRadius}px`,"--cone-spread":coneSpread,"--fill-opacity":fillOpacity,...buildGlowVars(glowColor,glowIntensity),...buildGradientVars(colors)}}><span className="edge-light"/><div className="border-glow-inner">{children}</div></div>;
}
