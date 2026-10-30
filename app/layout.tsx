import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
const geistSans=Geist({variable:"--font-geist-sans",subsets:["latin"]});
const geistMono=Geist_Mono({variable:"--font-geist-mono",subsets:["latin"]});
export const metadata:Metadata={title:"MICKYWORKS TV — Cinematic Storytelling & AI Film",description:"Cinematic storytelling that brings your vision to life. Visual design, AI filmmaking and brand stories by MICKYWORKS TV. 视觉设计、AI 影像与品牌叙事。",icons:{icon:"/favicon.svg",shortcut:"/favicon.svg"}};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en" suppressHydrationWarning><body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body></html>}
