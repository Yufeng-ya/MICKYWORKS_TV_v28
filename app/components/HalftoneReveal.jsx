"use client";

import { useCallback, useEffect, useRef } from "react";
import "./HalftoneReveal.css";

export default function HalftoneReveal({children,className="",dotDensity=82,revealRadius=24,follow=.18,inkColor="6 12 10",borderRadius="28px"}){
  const rootRef=useRef(null),frameRef=useRef(0),currentRef=useRef({x:50,y:50}),targetRef=useRef({x:50,y:50});

  const animate=useCallback(()=>{
    if(frameRef.current)return;
    function tick(){
      const root=rootRef.current;if(!root){frameRef.current=0;return;}
      const current=currentRef.current,target=targetRef.current;
      const ease=Math.min(.34,Math.max(.08,1/(Math.max(follow,.05)*42)));
      current.x+=(target.x-current.x)*ease;current.y+=(target.y-current.y)*ease;
      root.style.setProperty("--halftone-x",`${current.x.toFixed(2)}%`);
      root.style.setProperty("--halftone-y",`${current.y.toFixed(2)}%`);
      if(Math.abs(target.x-current.x)>.04||Math.abs(target.y-current.y)>.04)frameRef.current=requestAnimationFrame(tick);else frameRef.current=0;
    }
    frameRef.current=requestAnimationFrame(tick);
  },[follow]);

  const move=useCallback(event=>{
    const root=rootRef.current;if(!root)return;
    const rect=root.getBoundingClientRect();targetRef.current={x:((event.clientX-rect.left)/rect.width)*100,y:((event.clientY-rect.top)/rect.height)*100};
    root.style.setProperty("--halftone-radius-live",`${revealRadius}%`);root.style.setProperty("--halftone-loupe-opacity",".72");
    animate();
  },[animate,revealRadius]);
  const leave=useCallback(()=>{const root=rootRef.current;if(root){root.style.setProperty("--halftone-radius-live","0%");root.style.setProperty("--halftone-loupe-opacity","0");}},[]);
  useEffect(()=>()=>{if(frameRef.current)cancelAnimationFrame(frameRef.current);},[]);

  const cell=Math.max(5,Math.min(11,720/dotDensity));
  return <div ref={rootRef} className={`halftone-reveal ${className}`.trim()} onPointerMove={move} onPointerEnter={move} onPointerLeave={leave} style={{"--halftone-cell":`${cell}px`,"--halftone-radius-live":"0%","--halftone-loupe-opacity":"0","--halftone-ink":inkColor,"--halftone-border-radius":borderRadius}}>{children}<span className="halftone-screen" aria-hidden="true"/><span className="halftone-loupe" aria-hidden="true"/></div>;
}
