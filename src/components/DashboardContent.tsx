"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Shell } from "@/components/Shell";
import { ToolCard } from "@/components/ToolCard";
import { AddToolForm } from "@/components/AddToolForm";
import { EditToolModal } from "@/components/EditToolModal";
import type { Tool, Category, SubCategory } from "@/types/database";
import { 
  FolderPlus, 
  Search, 
  Filter, 
  Loader2,
  FolderOpen,
  Sparkles
} from "lucide-react";
import confetti from "canvas-confetti";

export function DashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isAddingParam = searchParams.get("add") === "true";

  // Data states
  const [tools, setTools] = useState<Tool[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  
  // Filter/Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("all");
  async function fetchData() {
    try {
      setLoading(true);
      const [toolsRes, catRes, subRes] = await Promise.all([
        fetch("/api/tools"),
        fetch("/api/categories"),
        fetch("/api/sub-categories")
      ]);

      if (toolsRes.ok) setTools(await toolsRes.json());
      if (catRes.ok) setCategories(await catRes.json());
      if (subRes.ok) setSubCategories(await subRes.json());
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this tool?")) return;
    try {
      const res = await fetch(`/api/tools?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setTools((prev) => prev.filter((t) => t.id !== id));
      }
    } catch (err) {
      console.error("Error deleting tool:", err);
    }
  }

  // Filter tools based on search query and category filters
  const filteredTools = tools.filter((tool) => {
    const matchesSearch = 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tool.description && tool.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      tool.url.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = 
      selectedCategory === "all" || tool.category_id === selectedCategory;

    const matchesSubCategory = 
      selectedSubCategory === "all" || tool.sub_category_id === selectedSubCategory;

    return matchesSearch && matchesCategory && matchesSubCategory;
  });

  // Get subcategories of currently selected category
  const filteredSubCategories = subCategories.filter(
    (sub) => selectedCategory === "all" || sub.category_id === selectedCategory
  );

  return (
    <Shell>
      <div className="max-w-[1600px] w-full mx-auto px-4 md:px-6 py-8 flex-1 flex flex-col">
        {/* Dashboard Title & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Your Digital Toolbox</h1>
            <p className="text-muted-foreground text-sm">
              Keep track of web pages, developer utilities, designs, and resources.
            </p>
          </div>
          
          {!isAddingParam && (
            <button
              onClick={() => router.push("/dashboard?add=true")}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold shadow-md shadow-primary/20 hover:bg-primary/95 transition-all hover:translate-y-[-1px] active:translate-y-[0px] self-start md:self-auto"
            >
              <FolderPlus className="h-4.5 w-4.5" />
              Add Web Tool
            </button>
          )}
        </div>

        {isAddingParam ? (
          <div className="my-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <AddToolForm
              categories={categories}
              subCategories={subCategories}
              onSuccess={() => {
                fetchData();
                router.push("/dashboard");
                // Celebrate!
                confetti({
                  particleCount: 100,
                  spread: 70,
                  origin: { y: 0.6 }
                });
              }}
              onCancel={() => router.push("/dashboard")}
              onRefreshCategories={async () => {
                const [catRes, subRes] = await Promise.all([
                  fetch("/api/categories"),
                  fetch("/api/sub-categories")
                ]);
                if (catRes.ok) setCategories(await catRes.json());
                if (subRes.ok) setSubCategories(await subRes.json());
              }}
            />
          </div>
        ) : (
          <div className="flex-1 flex flex-col lg:flex-row gap-8 items-start">
            {/* Left Sidebar Filter Section */}
            <aside className="w-full lg:w-[280px] shrink-0 bg-card border border-border p-5 rounded-2xl shadow-sm space-y-6">
              <div className="flex items-center gap-2 pb-3 border-b border-border">
                <Filter className="h-4.5 w-4.5 text-primary" />
                <h2 className="font-bold text-base">Filter Library</h2>
              </div>

              {/* Search */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Keywords, links..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-xs"
                  />
                </div>
              </div>

              {/* Category selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setSelectedSubCategory("all");
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                >
                  <option value="all">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sub-category selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Sub-Category</label>
                <select
                  value={selectedSubCategory}
                  onChange={(e) => setSelectedSubCategory(e.target.value)}
                  disabled={selectedCategory === "all"}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:opacity-50"
                >
                  <option value="all">All Sub-Categories</option>
                  {filteredSubCategories.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Reset button */}
              {(searchQuery || selectedCategory !== "all" || selectedSubCategory !== "all") && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                    setSelectedSubCategory("all");
                  }}
                  className="w-full py-2 rounded-xl border border-border bg-background hover:bg-accent/10 text-xs font-medium transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </aside>

            {/* Content view with Groups (if Category Filter is ALL) */}
            <div className="flex-1 w-full">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
                  <p className="text-muted-foreground text-sm font-medium">Loading your tools...</p>
                </div>
              ) : filteredTools.length > 0 ? (
                <div className="space-y-10">
                  {/* Case 1: Filter is "ALL" -> Group and separate by Category for cleaner UX */}
                  {selectedCategory === "all" ? (
                    categories.map((cat) => {
                      const toolsInCat = filteredTools.filter((t) => t.category_id === cat.id);
                      if (toolsInCat.length === 0) return null;
                      return (
                        <div key={cat.id} className="space-y-4">
                          <div className="flex items-center gap-4">
                            <h2 className="text-lg font-bold tracking-tight text-foreground bg-accent/10 px-3 py-1 rounded-lg border border-accent/25">
                              {cat.name}
                            </h2>
                            <div className="flex-1 h-px bg-border/60" />
                            <span className="text-xs font-semibold text-muted-foreground bg-muted px-2.5 py-0.5 rounded-full border border-border">
                              {toolsInCat.length} {toolsInCat.length === 1 ? "tool" : "tools"}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                            {toolsInCat.map((tool) => (
                              <ToolCard
                                key={tool.id}
                                tool={tool}
                                onDelete={handleDelete}
                                onEdit={(t) => setEditingTool(t)}
                              />
                            ))}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    /* Case 2: Filter is a specific Category -> Simple grid display */
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                      {filteredTools.map((tool) => (
                        <ToolCard
                          key={tool.id}
                          tool={tool}
                          onDelete={handleDelete}
                          onEdit={(t) => setEditingTool(t)}
                        />
                      ))}
                    </div>
                  )}
                  
                  {/* Show items that somehow don't have a category (fallback) */}
                  {selectedCategory === "all" && filteredTools.filter(t => !categories.some(c => c.id === t.category_id)).length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <h2 className="text-lg font-bold tracking-tight text-foreground bg-accent/10 px-3 py-1 rounded-lg border border-accent/25">
                          Uncategorized
                        </h2>
                        <div className="flex-1 h-px bg-border/60" />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                        {filteredTools
                          .filter(t => !categories.some(c => c.id === t.category_id))
                          .map((tool) => (
                            <ToolCard
                              key={tool.id}
                              tool={tool}
                              onDelete={handleDelete}
                              onEdit={(t) => setEditingTool(t)}
                            />
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center border border-dashed border-border rounded-2xl p-12 text-center bg-card/20 py-24">
                  <FolderOpen className="h-16 w-16 text-muted-foreground/30 mb-4" />
                  <h3 className="text-xl font-bold mb-2">No tools found</h3>
                  <p className="text-muted-foreground text-sm max-w-sm mb-6 leading-relaxed">
                    {tools.length === 0 
                      ? "Get started by cataloging your first resource to build your personal toolkit."
                      : "No tools match your current search queries or filter categories."}
                  </p>
                  {tools.length === 0 ? (
                    <button
                      onClick={() => router.push("/dashboard?add=true")}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold shadow-md hover:bg-primary/95 transition-all"
                    >
                      <FolderPlus className="h-4.5 w-4.5" />
                      Add Your First Tool
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedCategory("all");
                        setSelectedSubCategory("all");
                      }}
                      className="px-4 py-2 rounded-xl border border-border bg-card text-sm font-medium hover:bg-accent/10 transition-colors"
                    >
                      Reset Filters
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {editingTool && (
        <EditToolModal
          tool={editingTool}
          categories={categories}
          subCategories={subCategories}
          onClose={() => setEditingTool(null)}
          onSuccess={() => {
            setEditingTool(null);
            fetchData();
          }}
        />
      )}
    </Shell>
  );
}
