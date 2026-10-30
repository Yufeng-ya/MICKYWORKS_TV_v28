"use client";

import "./ShinyText.css";

export default function ShinyText({text,className="",color="#f6f6f1",shineColor="#c8ff35",speed=4,delay=.4}){
  return <span className={`shinyText ${className}`.trim()} style={{"--shiny-color":color,"--shine-color":shineColor,"--shine-speed":`${speed}s`,"--shine-delay":`${delay}s`}}>{text}</span>;
}
