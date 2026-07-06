"use client";

import { useState, useEffect } from "react";
import { X, Loader2, Save } from "lucide-react";
import type { Tool, Category, SubCategory } from "@/types/database";

interface EditToolModalProps {
  tool: Tool;
  categories: Category[];
  subCategories: SubCategory[];
  onClose: () => void;
  onSuccess: () => void;
}

export function EditToolModal({
  tool,
  categories,
  subCategories,
  onClose,
  onSuccess
}: EditToolModalProps) {
  const [name, setName] = useState(tool.name);
  const [url, setUrl] = useState(tool.url);
  const [description, setDescription] = useState(tool.description || "");
  const [selectedCategoryId, setSelectedCategoryId] = useState(tool.category_id);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(tool.sub_category_id || "");
  const [logoUrl, setLogoUrl] = useState(tool.logo_url || "");
  const [imageUrl, setImageUrl] = useState(tool.image_url || "");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Filter subcategories based on selected category
  const filteredSubCategories = subCategories.filter(
    (sub) => sub.category_id === selectedCategoryId
  );

  // If category changes, check if the selected subcategory is still valid, if not reset it
  useEffect(() => {
    const isValid = filteredSubCategories.some((sub) => sub.id === selectedSubCategoryId);
    if (!isValid && selectedSubCategoryId !== "") {
      setSelectedSubCategoryId("");
    }
  }, [selectedCategoryId, filteredSubCategories, selectedSubCategoryId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !url || !selectedCategoryId) {
      setError("Please fill in Name, URL, and Category");
      return;
    }

    let sanitizedUrl = url.trim();
    if (sanitizedUrl && !/^https?:\/\//i.test(sanitizedUrl)) {
      sanitizedUrl = `https://${sanitizedUrl}`;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/tools", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: tool.id,
          name,
          url: sanitizedUrl,
          description: description || null,
          category_id: selectedCategoryId,
          sub_category_id: selectedSubCategoryId || null,
          logo_url: logoUrl || null,
          image_url: imageUrl || null
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || "Failed to update tool");
      }

      onSuccess();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-card border border-border rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border bg-muted/20">
          <div>
            <h2 className="font-bold text-lg">Edit Tool</h2>
            <p className="text-muted-foreground text-xs">Update your tool credentials and details.</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {error && (
            <div className="p-3 text-xs bg-destructive/10 border border-destructive/20 text-destructive rounded-xl">
              {error}
            </div>
          )}

          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Tool Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Supabase, Tailwind, DevDocs"
              className="w-full px-3 py-2 rounded-xl border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
            />
          </div>

          {/* URL */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              URL / Link *
            </label>
            <input
              type="text"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="e.g. https://supabase.com"
              className="w-full px-3 py-2 rounded-xl border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the tool/bookmark..."
              rows={3}
              className="w-full px-3 py-2 rounded-xl border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm resize-none"
            />
          </div>

          {/* Category Select */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Category *
              </label>
              <select
                required
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              >
                <option value="" disabled>Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sub Category Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Sub-Category
              </label>
              <select
                value={selectedSubCategoryId}
                onChange={(e) => setSelectedSubCategoryId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              >
                <option value="">None</option>
                {filteredSubCategories.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Custom Logo & Image Overrides */}
          <div className="border-t border-border/60 pt-4 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Visual Assets (Optional)</h3>
            
            {/* Logo URL */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">
                Logo Image URL
              </label>
              <input
                type="text"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="Custom favicon or logo icon URL"
                className="w-full px-3 py-2 rounded-xl border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-xs"
              />
            </div>

            {/* Image Preview URL */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">
                Thumbnail Image URL
              </label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Custom preview card image URL"
                className="w-full px-3 py-2 rounded-xl border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-xs"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border bg-muted/10 -mx-6 -mb-6 p-6">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border border-border text-sm font-semibold rounded-xl bg-background hover:bg-accent/10 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold shadow-md shadow-primary/20 hover:bg-primary/95 transition-all disabled:opacity-50 text-sm"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
