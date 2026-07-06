"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Shell } from "@/components/Shell";
import { 
  Sparkles, 
  LayoutDashboard, 
  FolderPlus, 
  Globe, 
  Zap, 
  FolderHeart,
  ExternalLink
} from "lucide-react";

interface LogoItem {
  name: string;
  logo_url: string;
}

export default function Home() {
  const [logos, setLogos] = useState<LogoItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLogos() {
      try {
        const res = await fetch("/api/logos");
        if (res.ok) {
          const data = await res.json();
          setLogos(data);
        }
      } catch (err) {
        console.error("Failed to load marquee logos:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLogos();
  }, []);

  // Design Logic for Infinite Loop Marquee:
  // - We fetch up to 15 logos.
  // - If the count is 0, we can show standard tech/mockup fallbacks (Next.js, Supabase, Tailwind, Github, React, etc.)
  // - If the count is small (e.g. 1 to 5), we repeat/duplicate them multiple times to fill the marquee width 
  //   so the continuous animation is seamless.
  // - System selection: Randomly ordered from stored tools that have valid logo_url.
  
  const defaultLogos: LogoItem[] = [
    { name: "React", logo_url: "https://www.google.com/s2/favicons?sz=64&domain=react.dev" },
    { name: "Next.js", logo_url: "https://www.google.com/s2/favicons?sz=64&domain=nextjs.org" },
    { name: "Supabase", logo_url: "https://www.google.com/s2/favicons?sz=64&domain=supabase.com" },
    { name: "Tailwind CSS", logo_url: "https://www.google.com/s2/favicons?sz=64&domain=tailwindcss.com" },
    { name: "GitHub", logo_url: "https://www.google.com/s2/favicons?sz=64&domain=github.com" },
    { name: "Vercel", logo_url: "https://www.google.com/s2/favicons?sz=64&domain=vercel.com" },
    { name: "Figma", logo_url: "https://www.google.com/s2/favicons?sz=64&domain=figma.com" },
    { name: "TypeScript", logo_url: "https://www.google.com/s2/favicons?sz=64&domain=typescriptlang.org" }
  ];

  const displayedLogos = logos.length > 0 ? logos : defaultLogos;

  // Duplicating array elements to make sure a single row is wide enough to fill screen widths
  const getRepeatedLogos = () => {
    let list = [...displayedLogos];
    while (list.length < 12) {
      list = [...list, ...displayedLogos];
    }
    return list;
  };

  const marqueeItems = getRepeatedLogos();

  return (
    <Shell>
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-12 md:pt-32 md:pb-16 flex flex-col items-center justify-center text-center px-4">
        {/* Glow effect backgrounds */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-accent/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="container max-w-4xl mx-auto flex flex-col items-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-card text-xs font-semibold text-accent-foreground mb-6 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-accent animate-pulse" />
            <span>Manage Your Digital Toolbox Better</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-b from-foreground via-foreground/90 to-foreground/75 bg-clip-text text-transparent">
            No More Lost Links.<br />
            Your Ultimate{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Tool Repository.
            </span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-2xl mb-10 leading-relaxed">
            Stop losing awesome libraries, web utilities, and AI helpers you find online.
            Save, categorize, tag, and visually preview them all in a single dashboard.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all hover:scale-105 active:scale-95"
            >
              <LayoutDashboard className="h-5 w-5" />
              Open Dashboard
            </Link>
            <Link
              href="/dashboard?add=true"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-8 py-4 text-base font-semibold text-foreground shadow-sm hover:bg-accent/10 transition-all hover:scale-105 active:scale-95"
            >
              <FolderPlus className="h-5 w-5 text-accent" />
              Add a New Tool
            </Link>
          </div>
        </div>
      </section>

      {/* INFINITE RUNNING LOGO MARQUEE */}
      <div className="w-full py-8 bg-card/20 border-y border-border/60 overflow-hidden relative marquee-container">
        {/* Left/Right fading gradient mask */}
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        
        <div className="w-full overflow-hidden flex relative">
          {/* Main moving track */}
          <div className="animate-marquee flex items-center gap-6 pr-6 shrink-0">
            {marqueeItems.map((item, idx) => (
              <div 
                key={`${item.name}-track1-${idx}`} 
                className="flex items-center gap-3.5 px-6 py-4 rounded-2xl border border-border bg-card/40 hover:border-primary/40 hover:bg-card transition-all duration-300 select-none shrink-0 group/marquee"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.logo_url}
                  alt={item.name}
                  className="w-10 h-10 object-contain rounded-xl bg-white/90 p-1.5 filter grayscale opacity-45 group-hover/marquee:grayscale-0 group-hover/marquee:opacity-100 transition-all duration-300"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                <span className="text-base font-semibold tracking-tight text-muted-foreground/60 group-hover/marquee:text-foreground transition-colors">
                  {item.name}
                </span>
              </div>
            ))}
          </div>

          {/* Sibling duplicate moving track for seamless endless scrolling */}
          <div className="animate-marquee flex items-center gap-6 pr-6 shrink-0" aria-hidden="true">
            {marqueeItems.map((item, idx) => (
              <div 
                key={`${item.name}-track2-${idx}`} 
                className="flex items-center gap-3.5 px-6 py-4 rounded-2xl border border-border bg-card/40 hover:border-primary/40 hover:bg-card transition-all duration-300 select-none shrink-0 group/marquee"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.logo_url}
                  alt={item.name}
                  className="w-10 h-10 object-contain rounded-xl bg-white/90 p-1.5 filter grayscale opacity-45 group-hover/marquee:grayscale-0 group-hover/marquee:opacity-100 transition-all duration-300"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                <span className="text-base font-semibold tracking-tight text-muted-foreground/60 group-hover/marquee:text-foreground transition-colors">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feature Grid */}
      <section className="py-16 bg-card/50 border-b border-border relative">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Designed for Personal Productivity
            </h2>
            <p className="text-muted-foreground">
              Everything you need to organize internet treasures in a beautiful, structured layout.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="flex flex-col p-6 rounded-2xl border border-border bg-background shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 right-0 h-24 w-24 bg-primary/5 rounded-bl-full group-hover:scale-110 transition-transform" />
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-5">
                <Globe className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Visual Previews</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Automatically fetches preview metadata and screenshots/icons of the saved link, making your collection instantly recognizable.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col p-6 rounded-2xl border border-border bg-background shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 right-0 h-24 w-24 bg-accent/5 rounded-bl-full group-hover:scale-110 transition-transform" />
              <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-5">
                <FolderHeart className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Hierarchical Tags</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Sort tools into main categories (e.g. AI Tools, Development) and custom sub-categories (e.g. Image Generators, UI Libraries).
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col p-6 rounded-2xl border border-border bg-background shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 right-0 h-24 w-24 bg-primary/5 rounded-bl-full group-hover:scale-110 transition-transform" />
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-5">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Supabase Powered</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Leverages Supabase DB for instant lookups, real-time sync, and robust data integrity, stored securely for you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Showcase Call-To-Action */}
      <section className="py-20 flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="container max-w-3xl mx-auto relative z-10 flex flex-col items-center">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20 mb-6">
            <ExternalLink className="h-8 w-8" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Ready to catalog your discovered tools?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-lg">
            No limits, no complicated bookmarks folders. Just a clean, searchable dashboard dedicated to your workflow.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-8 py-4 text-base font-semibold text-accent-foreground shadow-lg shadow-accent/25 hover:bg-accent/90 transition-all hover:scale-105 active:scale-95"
          >
            Start Managing Now
          </Link>
        </div>
      </section>
    </Shell>
  );
}
