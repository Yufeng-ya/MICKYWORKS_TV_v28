"use client";

import { useCallback, useEffect, useRef } from "react";
import "./LineSidebar.css";

const curves={
  linear:value=>value,
  smooth:value=>value*value*(3-2*value),
  sharp:value=>value*value*value,
};

export default function LineSidebar({items,activeIndex=0,onItemClick,ariaLabel="页面导航",accentColor="#c8ff35",proximityRadius=92,maxShift=12,markerLength=38,itemGap=17,smoothing=150,className=""}){
  const listRef=useRef(null),itemRefs=useRef([]),targetsRef=useRef([]),currentRef=useRef([]),frameRef=useRef(null),lastRef=useRef(0),activeRef=useRef(activeIndex);

  const runFrame=useCallback(function tick(now){
    const dt=Math.min((now-lastRef.current)/1000,.05),tau=Math.max(smoothing,1)/1000,k=1-Math.exp(-dt/tau);
    lastRef.current=now;let moving=false;
    itemRefs.current.forEach((item,index)=>{
      if(!item)return;
      const target=Math.max(targetsRef.current[index]||0,activeRef.current===index?1:0),current=currentRef.current[index]||0,next=current+(target-current)*k,settled=Math.abs(target-next)<.0015,value=settled?target:next;
      currentRef.current[index]=value;item.style.setProperty("--effect",value.toFixed(4));if(!settled)moving=true;
    });
    frameRef.current=moving?requestAnimationFrame(tick):null;
  },[smoothing]);

  const start=useCallback(()=>{if(frameRef.current!==null)return;lastRef.current=performance.now();frameRef.current=requestAnimationFrame(runFrame)},[runFrame]);
  const move=useCallback(event=>{
    const list=listRef.current;if(!list)return;const rect=list.getBoundingClientRect(),pointerY=event.clientY-rect.top;
    itemRefs.current.forEach((item,index)=>{if(!item)return;const distance=Math.abs(pointerY-(item.offsetTop+item.offsetHeight/2)),proximity=Math.max(0,1-distance/proximityRadius);targetsRef.current[index]=curves.smooth(proximity)});start();
  },[proximityRadius,start]);
  const leave=useCallback(()=>{targetsRef.current=targetsRef.current.map(()=>0);start()},[start]);

  useEffect(()=>{activeRef.current=activeIndex;start();return()=>{if(frameRef.current!==null)cancelAnimationFrame(frameRef.current)}},[activeIndex,start]);

  return <aside className={`lineSidebarShell ${className}`.trim()} aria-label={ariaLabel}>
    <nav className="lineSidebar" style={{"--accent-color":accentColor,"--marker-length":`${markerLength}px`,"--max-shift":`${maxShift}px`,"--item-gap":`${itemGap}px`}}>
      <ul ref={listRef} onPointerMove={move} onPointerLeave={leave}>
        {items.map((item,index)=><li ref={element=>{itemRefs.current[index]=element}} key={item.id} style={{"--effect":activeIndex===index?1:0}}>
          <span className="lineSidebarMarker" aria-hidden="true"/>
          <button type="button" aria-current={activeIndex===index?"page":undefined} onClick={()=>onItemClick?.(index,item)}><span>{String(index+1).padStart(2,"0")}</span>{item.label}</button>
        </li>)}
      </ul>
    </nav>
  </aside>;
}
