"use client";
/* eslint-disable @next/next/no-img-element -- the lazy QR code must stay a direct static asset on Sites */

import { useEffect, useRef, useState } from "react";
import BorderGlow from "./components/BorderGlow";
import HalftoneReveal from "./components/HalftoneReveal";
import LineSidebar from "./components/LineSidebar";
import ShinyText from "./components/ShinyText";
import LazyStrands from "./components/LazyStrands";
import BrandLogo from "./components/BrandLogo";
import { socialProfiles, translations } from "./content.mjs";
import useLanguage from "./useLanguage";

const projectAssets = [
  { index:"01", tag:"AI FILM · FC UNIVERSE", subtitle:"The Beginning of an Adventure", link:"https://v.douyin.com/W0hgbDCGeyI/", visual:"pixel" },
  { index:"02", tag:"AI FILM · EPISODE 03", subtitle:"Beyond the 8-bit Frontier", link:"https://v.douyin.com/5c334aqFFTo/", visual:"portal" },
  { index:"03", tag:"AI FILM · FINAL CHAPTER", subtitle:"The Final Chapter", link:"https://v.douyin.com/9NELC3dOP3o/", visual:"finale" },
  { index:"04", tag:"DOCUMENTARY · SHANXI", subtitle:"Rooted in Sanjin", link:"https://v.douyin.com/rtfWg6H8tds/", visual:"shanxi" },
  { index:"05", tag:"AI FILM · PUBLIC WELFARE", subtitle:"A Name Returned After 34 Years", link:"https://v.douyin.com/TSthAJTcShI/", visual:"zhenbao" },
];

const strengthAssets = [
  { no:"A/01", en:"VISUAL SYSTEM" }, { no:"A/02", en:"AI FILM" },
  { no:"A/03", en:"BRAND STORY" }, { no:"A/04", en:"LIVE COMMERCE" },
];

const sectionIds=["top","about","work","strengths","contact"] as const;

const ContactLine=({text,className=""}:{text:string,className?:string})=><span className={`contactLine ${className}`.trim()} aria-hidden="true">{Array.from(text).map((char,index)=><span className="contactChar" key={`${char}-${index}`}>{char}</span>)}</span>;

const LocalTime=()=>{
  const [time,setTime]=useState("");
  useEffect(()=>{
    const update=()=>setTime(new Intl.DateTimeFormat("zh-CN",{hour:"2-digit",minute:"2-digit",hour12:false,timeZone:"Asia/Shanghai"}).format(new Date()));
    update();
    const timer=window.setInterval(update,60000);
    return()=>window.clearInterval(timer);
  },[]);
  return <>{time||"--:--"}</>;
};

export default function Home(){
  const [language,setLanguage]=useLanguage();
  const t=translations[language];
  const sideNav=sectionIds.map(id=>({id,label:t.nav[id]}));
  const projects=projectAssets.map((asset,index)=>({...asset,...t.projects[index]}));
  const strengths=strengthAssets.map((asset,index)=>({...asset,...t.strengths.items[index]}));
  const refreshAnimations=useRef<()=>void>(()=>{});
  const [menuOpen,setMenuOpen]=useState(false); const [active,setActive]=useState("top"); const scrollProgressRef=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    document.documentElement.lang=language==="zh"?"zh-CN":"en";
    const frame=requestAnimationFrame(()=>refreshAnimations.current());
    return()=>cancelAnimationFrame(frame);
  },[language]);
  useEffect(()=>{
    if(!menuOpen)return;
    const close=(event:KeyboardEvent)=>{if(event.key==="Escape")setMenuOpen(false);};
    window.addEventListener("keydown",close);
    return()=>window.removeEventListener("keydown",close);
  },[menuOpen]);
  useEffect(()=>{let frame=0;const update=()=>{frame=0;const max=document.documentElement.scrollHeight-innerHeight,progress=max?scrollY/max:0;scrollProgressRef.current?.style.setProperty("transform",`scaleX(${progress})`)};const onScroll=()=>{if(!frame)frame=requestAnimationFrame(update)};update();addEventListener("scroll",onScroll,{passive:true});return()=>{removeEventListener("scroll",onScroll);if(frame)cancelAnimationFrame(frame)}},[]);
  useEffect(()=>{const sections=["top","about","work","strengths","contact"].map(id=>document.getElementById(id)).filter(Boolean) as HTMLElement[];const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting)setActive(entry.target.id)}),{rootMargin:"-35% 0px -55%",threshold:0});sections.forEach(section=>observer.observe(section));return()=>observer.disconnect()},[]);
  useEffect(()=>{
    const hero=document.querySelector<HTMLElement>(".hero");
    const surface=hero?.querySelector<HTMLElement>(".heroSticky");
    if(!hero||!surface||!window.matchMedia("(pointer: fine)").matches||window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;
    let frame=0;
    const current={x:0,y:0,opacity:0};
    const target={x:0,y:0,opacity:0};
    const render=()=>{
      current.x+=(target.x-current.x)*.22;
      current.y+=(target.y-current.y)*.22;
      current.opacity+=(target.opacity-current.opacity)*.18;
      const width=Math.max(surface.clientWidth,1),height=Math.max(surface.clientHeight,1);
      const xPercent=(current.x/width)*100,yPercent=(current.y/height)*100;
      hero.style.setProperty("--spot-x",`${xPercent}%`);
      hero.style.setProperty("--spot-y",`${yPercent}%`);
      hero.style.setProperty("--pointer-x",`${current.x}px`);
      hero.style.setProperty("--pointer-y",`${current.y}px`);
      hero.style.setProperty("--spot-opacity",`${current.opacity}`);
      hero.style.setProperty("--tilt-x",`${(xPercent-50)*.028}deg`);
      hero.style.setProperty("--tilt-y",`${(50-yPercent)*.022}deg`);
      hero.style.setProperty("--motion-x",`${(xPercent-50)*.18}px`);
      hero.style.setProperty("--motion-y",`${(yPercent-50)*.13}px`);
      hero.style.setProperty("--grid-x",`${(50-xPercent)*.07}px`);
      hero.style.setProperty("--grid-y",`${(50-yPercent)*.07}px`);
      const moving=Math.abs(target.x-current.x)+Math.abs(target.y-current.y)+Math.abs(target.opacity-current.opacity)>0.03;
      frame=moving?requestAnimationFrame(render):0;
    };
    const start=()=>{if(!frame)frame=requestAnimationFrame(render)};
    const move=(event:PointerEvent)=>{
      const bounds=surface.getBoundingClientRect(),x=event.clientX-bounds.left,y=event.clientY-bounds.top;
      if(target.opacity===0){current.x=x;current.y=y;}
      target.x=x;target.y=y;target.opacity=1;start();
    };
    const leave=()=>{target.opacity=0;start()};
    surface.addEventListener("pointermove",move,{passive:true});
    surface.addEventListener("pointerleave",leave,{passive:true});
    return()=>{surface.removeEventListener("pointermove",move);surface.removeEventListener("pointerleave",leave);if(frame)cancelAnimationFrame(frame)};
  },[]);
  useEffect(()=>{
    const hero=document.querySelector<HTMLElement>(".hero");
    const videos=Array.from(document.querySelectorAll<HTMLVideoElement>(".heroFeatureVideo,.heroBubbleVideo"));
    if(!hero||!videos.length)return;
    let visible=true;
    const sync=()=>{
      const shouldPlay=visible&&!document.hidden;
      videos.forEach(video=>shouldPlay?video.play().catch(()=>undefined):video.pause());
    };
    const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync()},{threshold:0});
    const onVisibilityChange=()=>sync();
    observer.observe(hero);
    document.addEventListener("visibilitychange",onVisibilityChange);
    return()=>{observer.disconnect();document.removeEventListener("visibilitychange",onVisibilityChange)};
  },[]);
  useEffect(()=>{
    let cancelled=false;let context:{revert:()=>void}|undefined;let openingFailSafe=0;
    const previousOverflow=document.body.style.overflow;
    const releaseOpening=()=>{
      if(openingFailSafe){window.clearTimeout(openingFailSafe);openingFailSafe=0;}
      const opening=document.querySelector<HTMLElement>(".opening");
      if(opening)opening.style.display="none";
      document.body.style.overflow=previousOverflow;
    };
    openingFailSafe=window.setTimeout(releaseOpening,3400);
    const setup=async()=>{
      const [{gsap},{ScrollTrigger}]=await Promise.all([import("gsap"),import("gsap/ScrollTrigger")]);
      if(cancelled)return;gsap.registerPlugin(ScrollTrigger);
      context=gsap.context(()=>{
        const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if(reduced){releaseOpening();return;}

        gsap.set("body",{overflow:"hidden"});
        const introTimeline=gsap.timeline({defaults:{ease:"power4.inOut"},onComplete:releaseOpening});
        introTimeline.fromTo(".openingMark",{yPercent:120,opacity:0},{yPercent:0,opacity:1,duration:.54,ease:"power3.out"})
          .fromTo(".openingRule",{scaleX:0},{scaleX:1,duration:.6,ease:"expo.inOut"},"<.04")
          .fromTo(".openingPanel",{scaleY:1},{scaleY:0,duration:.8,stagger:.07,transformOrigin:"top",ease:"expo.inOut"},"+=.12")
          .to(".openingMark,.openingRule,.openingMeta",{opacity:0,duration:.24},"<.12")
          .call(releaseOpening)
          .fromTo(".heroMediaStage",{scale:1.12,opacity:.68},{scale:1,opacity:1,duration:1.55,ease:"expo.out"},"<-.15")
          .fromTo(".navCapsule",{y:-110,opacity:0,scaleX:.82},{y:0,opacity:1,scaleX:1,duration:1.15,ease:"expo.out"},"<.2")
          .fromTo(".heroEyebrow",{y:30,opacity:0},{y:0,opacity:1,duration:.8,ease:"power3.out"},"<.2")
          .fromTo(".heroBrandEntrance",{y:16,opacity:0},{y:0,opacity:1,duration:.75,ease:"power3.out"},"<")
          .fromTo(".titleLine",{yPercent:130,scaleX:.62,scaleY:1.35,skewY:5,transformOrigin:"left bottom"},{yPercent:0,scaleX:1,scaleY:1,skewY:0,duration:1.45,stagger:.13,ease:"expo.out"},"<.05")
          .fromTo(".heroBottom,.heroMeta",{y:38,opacity:0},{y:0,opacity:1,duration:1,stagger:.1,ease:"power3.out"},"<.45");

        const heroStory=gsap.timeline({scrollTrigger:{trigger:".hero",start:"top top",end:"bottom bottom",scrub:1.35,invalidateOnRefresh:true}});
        heroStory.to(".heroTitleBlock",{
          x:()=>-parseFloat(getComputedStyle(document.querySelector<HTMLElement>(".heroMotion")!).paddingLeft),
          y:()=>{const surface=document.querySelector<HTMLElement>(".heroSticky"),motion=document.querySelector<HTMLElement>(".heroMotion");return (innerWidth<1001?104:126)-((surface?.clientHeight||innerHeight)+8-(motion?.offsetHeight||0))/2;},
          scale:()=>innerWidth<641?.55:.34,transformOrigin:"left top",ease:"power2.inOut"},0)
          .to(".heroBrand",{opacity:0,duration:.4,ease:"power2.out"},0)
          .to(".heroFeatureVideo",{scale:1,ease:"power2.inOut"},0)
          .to(".heroVeil",{opacity:.18,ease:"power2.inOut"},0)
          .to(".heroColorWash",{opacity:.16,ease:"power2.inOut"},0)
          .to(".heroBubbleVideo,.heroGrid,.heroOrb",{opacity:0,ease:"power2.inOut"},0)
          .to(".heroBottom,.heroMeta,.heroReelTag",{opacity:0,y:26,pointerEvents:"none",ease:"power2.in"},0)
          .to(".heroVideoStatus",{opacity:1,y:0,ease:"power3.out"},.38);

        const bindOnce=(trigger:string|HTMLElement,play:()=>void,start="top 86%")=>{
          ScrollTrigger.create({trigger,start,once:true,onEnter:play});
        };
        const revealTitle=(selector:string)=>{
          gsap.killTweensOf(selector);
          gsap.fromTo(selector,{yPercent:118,scaleX:.72,scaleY:1.38,skewY:3.5,letterSpacing:".02em",clipPath:"inset(0 0 100% 0)",transformOrigin:"left bottom"},{yPercent:0,scaleX:1,scaleY:1,skewY:0,letterSpacing:"-.065em",clipPath:"inset(0 0 0% 0)",duration:1.65,ease:"expo.out",overwrite:"auto"});
        };
        const revealItems=(selector:string,delay=.25,stagger=.11)=>{
          const items=gsap.utils.toArray<HTMLElement>(selector);gsap.killTweensOf(items);
          gsap.fromTo(items,{y:66,opacity:0,scaleY:.9,transformOrigin:"center bottom"},{y:0,opacity:1,scaleY:1,duration:1.15,delay,stagger:{each:stagger,from:"start"},ease:"power4.out",overwrite:"auto"});
        };

        bindOnce("#about .aboutCopy h2",()=>{revealTitle("#about .aboutCopy h2");revealItems("#about .sectionLabel,#about .kicker,#about .bio,#about .aboutContact",.28,.1);},"top 84%");
        bindOnce("#about .portrait",()=>{gsap.killTweensOf("#about .portrait");gsap.fromTo("#about .portrait",{clipPath:"inset(0 0 100% 0)",scale:1.12,y:70},{clipPath:"inset(0 0 0% 0)",scale:1,y:0,duration:1.7,ease:"expo.inOut",overwrite:"auto"});},"top 88%");
        gsap.to("#about .portraitType",{yPercent:-8,ease:"none",scrollTrigger:{trigger:"#about",start:"top bottom",end:"bottom top",scrub:1.7}});
        bindOnce("#about .stats",()=>revealItems("#about .stats>div",.05,.16),"top 90%");

        bindOnce("#work .projectIntro",()=>{revealTitle("#work .projectIntro h2");revealItems("#work .sectionLabel,#work .projectIntro>p",.28,.12);},"top 86%");
        const richCardReveal=window.matchMedia("(min-width: 701px) and (prefers-reduced-motion: no-preference)").matches;
        gsap.utils.toArray<HTMLElement>(".projectGlow").forEach(card=>{
          const visual=card.querySelector<HTMLElement>(".projectVisual"),info=card.querySelectorAll(".projectInfo>*");
          bindOnce(card,()=>{
            gsap.killTweensOf([card,...(visual?[visual]:[]),...Array.from(info)]);
            const cardFrom=richCardReveal?{y:155,opacity:0,scale:.88,rotateX:7,rotateZ:-1.2,clipPath:"inset(14% 7% 14% 7% round 72px)",filter:"blur(8px)",transformPerspective:1400,transformOrigin:"center bottom"}:{y:70,opacity:0,scale:.97};
            const cardTo=richCardReveal?{y:0,opacity:1,scale:1,rotateX:0,rotateZ:0,clipPath:"inset(0% 0% 0% 0% round 30px)",filter:"blur(0px)",duration:1.65,ease:"expo.out"}:{y:0,opacity:1,scale:1,duration:.95,ease:"power3.out"};
            gsap.fromTo(card,cardFrom,{...cardTo,overwrite:"auto",onComplete:()=>{gsap.set(card,{clearProps:"clipPath,filter"});}});
            if(visual&&richCardReveal)gsap.fromTo(visual,{clipPath:"circle(7% at 68% 36%)",scale:1.16,filter:"saturate(.35) contrast(1.35) brightness(.48) blur(10px)"},{clipPath:"circle(145% at 68% 36%)",scale:1.035,filter:"saturate(1) contrast(1) brightness(1) blur(0px)",duration:1.8,delay:.08,ease:"expo.inOut",overwrite:"auto",onComplete:()=>{gsap.set(visual,{clearProps:"clipPath,filter"});}});
            gsap.fromTo(info,{y:48,opacity:0,clipPath:"inset(0 0 100% 0)"},{y:0,opacity:1,clipPath:"inset(0 0 0% 0)",duration:1.05,delay:.58,stagger:{each:.12,from:"start"},ease:"power3.out",overwrite:"auto",onComplete:()=>{gsap.set(info,{clearProps:"clipPath"});}});
          },"top 90%");
          if(visual&&window.matchMedia("(min-width: 901px) and (pointer: fine)").matches)gsap.to(visual,{yPercent:-4,ease:"none",scrollTrigger:{trigger:card,start:"top bottom",end:"bottom top",scrub:1.9}});
        });

        bindOnce("#strengths .strengthHead",()=>{revealTitle("#strengths .strengthHead h2");revealItems("#strengths .sectionLabel,#strengths .strengthHead>p",.28,.12);},"top 86%");
        bindOnce(".strengthGrid",()=>{const cards=gsap.utils.toArray<HTMLElement>(".strengthGlow");gsap.killTweensOf(cards);gsap.fromTo(cards,{y:130,xPercent:-7,opacity:0,scaleX:.82,transformOrigin:"left bottom"},{y:0,xPercent:0,opacity:1,scaleX:1,duration:1.45,stagger:{each:.17,from:"start"},ease:"expo.out",overwrite:"auto"});},"top 90%");

        bindOnce("#contact h2",()=>{const chars=gsap.utils.toArray<HTMLElement>("#contact .contactChar");gsap.killTweensOf(chars);gsap.fromTo(chars,{yPercent:135,opacity:0,rotateX:-72,rotateZ:-3,filter:"blur(9px)",transformOrigin:"center bottom",transformPerspective:900},{yPercent:0,opacity:1,rotateX:0,rotateZ:0,filter:"blur(0px)",duration:1.2,stagger:{each:.055,from:"start"},ease:"expo.out",overwrite:"auto",onComplete:()=>{gsap.set(chars,{clearProps:"filter"});}});revealItems("#contact .sectionLabel,#contact .contactLead,#contact .contactRow>p,#contact .contactQr,#contact .contactRow>a,#contact .footerLine",.28,.13);gsap.fromTo(".contactStrands",{scale:.7,opacity:0,rotate:-8},{scale:1,opacity:.9,rotate:0,duration:2.1,ease:"expo.out",overwrite:"auto"});},"top 84%");
        refreshAnimations.current=()=>ScrollTrigger.refresh();
        ScrollTrigger.refresh();
      });
    };
    setup().catch(releaseOpening);return()=>{cancelled=true;refreshAnimations.current=()=>{};if(openingFailSafe)window.clearTimeout(openingFailSafe);context?.revert();document.body.style.overflow=previousOverflow;};
  },[]);
  const go=(id:string)=>{document.getElementById(id)?.scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"});setMenuOpen(false)};
  return <main lang={language==="zh"?"zh-CN":"en"} data-language={language}>
    <span className="srOnly" role="status" aria-live="polite">{t.languageChanged}</span>
    <div ref={scrollProgressRef} className="scrollProgress" aria-hidden="true"/>
    <div className="opening" aria-hidden="true"><div className="openingPanel openingPanelA"/><div className="openingPanel openingPanelB"/><div className="openingCore"><div className="openingMark">MICKYWORKS TV<sup>®</sup></div><div className="openingRule"/><div className="openingMeta"><span>VISUAL / AI / BRAND</span><span>PORTFOLIO · 2026</span></div></div></div>
    <LineSidebar items={sideNav} ariaLabel={language==="zh"?"页面导航":"Page navigation"} activeIndex={Math.max(0,sideNav.findIndex(item=>item.id===active))} onItemClick={(_:number,item:{id:string})=>go(item.id)}/>
    <section className="hero heroEditorial" id="top">
      <div className="heroSticky">
      <div className="heroMediaStage" aria-hidden="true">
        <video className="heroFeatureVideo" autoPlay muted loop playsInline preload="metadata" poster="/hero-poster.jpg">
          <source src="/hero-feature-mobile.mp4" type="video/mp4" media="(max-width: 700px)"/>
          <source src="/hero-feature-full.mp4" type="video/mp4"/>
        </video>
        <video className="heroBubbleVideo" src="/hero-bubbles-fixed.mp4" autoPlay muted loop playsInline preload="auto"/>
      </div>
      <div className="heroColorWash" aria-hidden="true"/><div className="heroVeil"/><div className="heroNoise" aria-hidden="true"/>
      <div className="heroPointerGlow" aria-hidden="true"/>
      <nav className="nav shell" aria-label={language==="zh"?"主导航":"Main navigation"}><div className="navCapsule">
        <button className="wordmark" onClick={()=>go("top")} aria-label={`${t.backHome} · MICKYWORKS TV`}><BrandLogo/><span>MICKYWORKS TV</span></button>
        <div id="primary-navigation" className={`navLinks ${menuOpen?"open":""}`}>
          {(["about","work","strengths"] as const).map(id=><button className={active===id?"active":""} aria-current={active===id?"location":undefined} onClick={()=>go(id)} key={id}><i/>{t.nav[id]}</button>)}
          <button className="navMobileContact" onClick={()=>go("contact")}>{t.nav.contact} ↗</button>
        </div>
        <div className="navActions">
          <button className="languageSwitch" onClick={()=>setLanguage(language==="en"?"zh":"en")} aria-label={t.switchLanguage} title={t.switchLanguage}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c5 5 5 13 0 18-5-5-5-13 0-18Z"/></svg>
            <span className={language==="zh"?"selected":""} lang="zh-CN" aria-hidden="true">中</span><span className="languageDivider" aria-hidden="true">/</span><span className={language==="en"?"selected":""} lang="en" aria-hidden="true">EN</span>
          </button>
          <button className="contactPill" onClick={()=>go("contact")}><i/>{t.available}<span>↗</span></button>
          <button className="menuButton" onClick={()=>setMenuOpen(!menuOpen)} aria-label={menuOpen?t.closeMenu:t.openMenu} aria-expanded={menuOpen} aria-controls="primary-navigation">{menuOpen?"×":"＋"}</button>
        </div>
      </div></nav>
      <div className="heroGrid" aria-hidden="true"/><div className="heroOrb orbA"/><div className="heroOrb orbB"/>
      <div className="heroReelTag" aria-hidden="true"><i/><span>MOTION REEL</span><b>001 / 2026</b></div>
      <div className="heroContent shell"><div className="heroMotion"><div className="heroTitleBlock">
        <div className="heroBrand"><div className="heroBrandEntrance"><BrandLogo/></div></div>
        <div className="heroEyebrow">{t.hero.roles.map(role=><span key={role}>{role}</span>)}</div>
        <h1 className="editorialTitle" aria-label={t.hero.title}><span className="titleMask"><span className="titleLine titleLineA">{t.hero.firstLine}</span></span>{" "}<span className="titleMask titleMaskB"><span className="titleLine">{t.hero.secondPrefix}<ShinyText text={t.hero.accent} className="heroVision" color="#c8ff35" shineColor="#ffffff" speed={4.4} delay={.45}/>{t.hero.secondSuffix}</span></span></h1>
      </div><div className="heroBottom"><p>{t.hero.description[0]}<br/>{t.hero.description[1]}</p><button className="roundArrow" onClick={()=>go("about")} aria-label={t.explore}><span>↓</span></button></div></div></div>
      <div className="heroVideoStatus" aria-hidden="true"><i/><span>{t.hero.film}</span><b>{t.hero.playing}</b></div>
      <div className="heroMeta shell"><span>{t.hero.location}</span><span>{t.hero.localTime} · <LocalTime/></span><span>{t.hero.scroll}</span></div>
      </div>
    </section>

    <section className="about section shell reveal" id="about">
      <div className="sectionLabel"><span>01</span>{t.about.label}</div>
      <div className="aboutGrid"><div className="portrait" aria-label={t.about.portraitLabel}><div className="portraitNoise"/><div className="portraitType">M</div><div className="portraitCaption"><span>MICKYWORKS TV / 2026</span><span>{t.about.studio}</span></div></div>
        <div className="aboutCopy"><p className="kicker">{t.about.kicker}</p><h2>{t.about.heading[0]}<br/><em>{t.about.heading[1]}</em></h2>
          {t.about.paragraphs.map((paragraph,index)=><p className="bio" key={index}>{paragraph}</p>)}
          <div className="aboutContact">
            {socialProfiles.map(profile=><a href={profile.href} target="_blank" rel="noopener noreferrer" aria-label={`${t.openProfile} ${profile.label}`} key={profile.id}>{profile.id==="douyin"&&language==="en"?"Douyin":profile.label}<span aria-hidden="true">↗</span></a>)}
            <button className="contactShortcut" onClick={()=>go("contact")}>{t.contactButton}<span aria-hidden="true">↘</span></button>
          </div>
        </div>
      </div>
      <div className="stats">{[String(projects.length).padStart(2,"0"),"03","∞"].map((value,index)=><div key={index}><strong>{value}</strong><span>{t.about.stats[index]}</span></div>)}</div>
    </section>

    <section className="projects section" id="work">
      <div className="shell">
        <div className="sectionLabel light"><span>02</span>{t.work.label}</div>
        <div className="projectIntro"><h2>{t.work.heading[0]}<br/>{t.work.heading[1]}<span>{t.work.heading[2]}</span></h2><p>{t.work.caption}<br/>2025—2026</p></div>
        <div className="projectList">
          {projects.map((project,index)=><BorderGlow className="projectGlow" edgeSensitivity={17} glowColor="78 100 64" backgroundColor="rgba(13, 17, 15, .68)" borderRadius={30} glowRadius={72} glowIntensity={1.55} coneSpread={31} animated={index===0} colors={["#c8ff35","#5ee7ff","#a78bfa"]} fillOpacity={.58} key={project.index}>
            <a className="projectCard" href={project.link} target="_blank" rel="noopener noreferrer">
              <HalftoneReveal className={`projectVisual ${project.visual}`} dotDensity={index%2===0?88:74} revealRadius={28} follow={.2} inkColor="3 12 9" borderRadius="29px 29px 0 0">
                <div className="scanlines"/><span className="visualIndex">{project.index}</span>
                {project.visual==="pixel"&&<><div className="pixelSun"/><div className="pixelHero">▲</div><div className="blocks">■ ▪ ■ ▪ ■</div></>}
                {project.visual==="portal"&&<><div className="portalRing"><i/><i/><i/></div><div className="runner">◆</div></>}
                {project.visual==="finale"&&<><div className="horizon"/><div className="console">FC<br/><small>1983—FOREVER</small></div></>}
                {project.visual==="shanxi"&&<><div className="mountains m1"/><div className="mountains m2"/><div className="sunDisc"/><div className="shanxiType">晋</div></>}
                {project.visual==="zhenbao"&&<><div className="zhenbaoYears"><span>1992</span><i/><span>2026</span></div><div className="zhenbaoNumber">34</div><div className="zhenbaoTitle">珍宝</div><div className="zhenbaoTruth">A NAME · A HOME · A LIFE RETURNED</div></>}
                <div className="viewProject">{t.viewProject}</div>
              </HalftoneReveal>
              <div className="projectInfo"><div><span className="projectTag">{project.tag}</span><h3>{project.title}</h3><h4>{project.subtitle}</h4></div><div><p>{project.desc}</p><div className="chips">{project.meta.map(item=><span key={item}>{item}</span>)}</div></div></div>
            </a>
          </BorderGlow>)}
        </div>
      </div>
    </section>

    <section className="strengths section shell reveal" id="strengths">
      <div className="sectionLabel"><span>03</span>{t.strengths.label}</div>
      <div className="strengthHead"><h2>{t.strengths.heading[0]}<br/>{t.strengths.heading[1]}<span>{t.strengths.heading[2]}</span></h2><p>{t.strengths.description[0]}<br/>{t.strengths.description[1]}</p></div>
      <div className="strengthGrid">{strengths.map(item=><BorderGlow className="strengthGlow" edgeSensitivity={18} glowColor="78 100 62" backgroundColor="rgba(242, 242, 236, .56)" borderRadius={0} glowRadius={54} glowIntensity={1.35} coneSpread={30} colors={["#c8ff35","#5ee7ff","#a78bfa"]} fillOpacity={.42} key={item.no}><article><span className="strengthNo">{item.no}</span><div className="strengthOrb"/><div><small>{item.en}</small><h3>{item.title}</h3><p>{item.desc}</p></div></article></BorderGlow>)}</div>
    </section>

    <footer className="contact" id="contact"><div className="contactGrid"/><div className="contactGlow"/><div className="contactStrands"><LazyStrands colors={["#c8ff35","#5ee7ff","#a78bfa"]} count={4} speed={.26} amplitude={.9} waviness={.9} thickness={.62} glow={3.2} taper={3.4} spread={1.08} intensity={.58} saturation={1.45} opacity={.9} scale={1.08} glass refraction={.82} dispersion={.72} glassSize={.83}/></div><div className="shell contactInner reveal">
      <div className="sectionLabel light"><span>04</span>{t.contact.label}</div><p className="contactLead">{t.contact.lead}</p>
      <h2 aria-label={t.contact.accessibleHeading}><ContactLine text={t.contact.heading[0]}/><ContactLine text={t.contact.heading[1]} className="contactLineAccent"/></h2>
      <div className="contactRow"><p>{t.contact.description[0]}<br/>{t.contact.description[1]}</p><div className="contactQr"><div className="contactQrFrame"><img src="/wechat-qr.jpg" width="777" height="725" loading="lazy" decoding="async" alt={t.contact.qrAlt}/></div><span>{t.contact.qrCaption}</span></div><a href={socialProfiles[1].href} target="_blank" rel="noopener noreferrer" aria-label={`${t.openProfile} ${language==="zh"?"抖音":"Douyin"}`}>{t.contact.douyin}<span>↗</span></a></div>
      <div className="footerLine"><span>MICKYWORKS TV © 2026</span><span>VISUAL · AI · BRAND</span><button onClick={()=>go("top")}>{t.contact.backTop}</button></div>
    </div></footer>
  </main>
}
