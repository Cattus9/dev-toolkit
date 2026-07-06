"use client";

import { ExternalLink, Trash2, Globe, Edit3 } from "lucide-react";
import type { Tool } from "@/types/database";

interface ToolCardProps {
  tool: Tool;
  onDelete: (id: string) => void;
  onEdit: (tool: Tool) => void;
}

export function ToolCard({ tool, onDelete, onEdit }: ToolCardProps) {
  // Use a fallback domain name if no title
  const domain = new URL(tool.url).hostname;

  return (
    <div className="group bg-card hover:bg-card/80 border border-border hover:border-primary/30 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full relative">
      {/* Visual Preview / Thumbnail */}
      <div className="relative aspect-video bg-muted border-b border-border overflow-hidden flex items-center justify-center text-muted-foreground group-hover:opacity-90 transition-opacity">
        {tool.image_url ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={tool.image_url}
            alt={tool.name}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              // fallback if url fails
              e.currentTarget.style.display = "none";
              const parent = e.currentTarget.parentElement;
              if (parent) {
                const placeholder = parent.querySelector(".fallback-placeholder");
                if (placeholder) {
                  placeholder.classList.remove("hidden");
                }
              }
            }}
          />
        ) : null}
        
        {/* Fallback layout in case there is no image_url or it fails to load */}
        <div className={`fallback-placeholder absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-accent/5 to-primary/10 p-6 ${tool.image_url ? "hidden" : ""}`}>
          <Globe className="h-10 w-10 text-primary/40 mb-3" />
          <span className="text-xs font-mono text-muted-foreground font-semibold bg-background/80 px-2.5 py-1 rounded-full border border-border shadow-2xs">
            {domain}
          </span>
        </div>

      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            {tool.logo_url ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={tool.logo_url}
                alt={`${tool.name} logo`}
                className="w-5 h-5 rounded-md object-contain bg-white p-0.5 border border-border shrink-0"
                onError={(e) => {
                  // Fallback to Globe icon if the saved logo fails to load
                  e.currentTarget.style.display = "none";
                  const fallback = e.currentTarget.parentElement?.querySelector(".logo-fallback");
                  if (fallback) fallback.classList.remove("hidden");
                }}
              />
            ) : null}
            <div className={`logo-fallback ${tool.logo_url ? "hidden" : ""} shrink-0`}>
              <Globe className="w-4 h-4 text-muted-foreground" />
            </div>
            <h3 className="font-sans font-bold text-base leading-snug group-hover:text-primary transition-colors line-clamp-1 flex-1">
              {tool.name}
            </h3>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {tool.description || "No description provided."}
          </p>
          
          {/* Category and Sub-category labels at bottom of description */}
          <div className="flex flex-wrap gap-1.5 pt-1.5">
            {tool.categories?.name && (
              <span className="text-[9px] font-bold tracking-wide uppercase px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                {tool.categories.name}
              </span>
            )}
            {tool.sub_categories?.name && (
              <span className="text-[9px] font-bold tracking-wide uppercase px-2 py-0.5 rounded bg-accent/20 text-accent-foreground border border-accent/30">
                {tool.sub_categories.name}
              </span>
            )}
          </div>
        </div>
        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 mt-3 border-t border-border/60">
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            Visit Website <ExternalLink className="h-3.5 w-3.5" />
          </a>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(tool)}
              className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
              title="Edit details"
              type="button"
            >
              <Edit3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(tool.id)}
              className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all"
              title="Delete bookmark"
              type="button"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
