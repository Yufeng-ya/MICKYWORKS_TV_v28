"use client";

import { lazy, Suspense, useEffect, useRef, useState } from "react";
import "./Strands.css";

const Strands=lazy(()=>import("./Strands"));

export default function LazyStrands(props){
  const rootRef=useRef(null),[active,setActive]=useState(false);
  useEffect(()=>{
    const root=rootRef.current;if(!root)return;
    if(window.matchMedia("(pointer: coarse), (prefers-reduced-motion: reduce), (max-width: 700px)").matches)return;
    const observer=new IntersectionObserver(([entry])=>{if(entry.isIntersecting){setActive(true);observer.disconnect();}},{rootMargin:"500px"});
    observer.observe(root);return()=>observer.disconnect();
  },[]);
  return <div ref={rootRef} className="lazy-strands-shell">{active?<Suspense fallback={<div className="strands-container strands-fallback strands-static"/>}><Strands {...props}/></Suspense>:<div className="strands-container strands-fallback strands-static"/>}</div>;
}
