"use client";

import { useState } from "react";
import { Plus, X, Loader2 } from "lucide-react";
import type { Category, SubCategory } from "@/types/database";

interface AddToolFormProps {
  categories: Category[];
  subCategories: SubCategory[];
  onSuccess: () => void;
  onCancel: () => void;
  onRefreshCategories: () => Promise<void>;
}

export function AddToolForm({
  categories,
  subCategories,
  onSuccess,
  onCancel,
  onRefreshCategories
}: AddToolFormProps) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState("");
  
  // Custom category / sub-category addition states
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  
  const [isAddingSubCategory, setIsAddingSubCategory] = useState(false);
  const [newSubCategoryName, setNewSubCategoryName] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Filter subcategories based on selected category
  const filteredSubCategories = subCategories.filter(
    (sub) => sub.category_id === selectedCategoryId
  );

  async function handleAddCategory() {
    if (!newCategoryName.trim()) return;
    try {
      setLoading(true);
      setError("");
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryName.trim() }),
      });
      if (!response.ok) {
        throw new Error(await response.text() || "Failed to create category");
      }
      const data = await response.json();
      await onRefreshCategories();
      setSelectedCategoryId(data.id);
      setIsAddingCategory(false);
      setNewCategoryName("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  async function handleAddSubCategory() {
    if (!newSubCategoryName.trim() || !selectedCategoryId) return;
    try {
      setLoading(true);
      setError("");
      const response = await fetch("/api/sub-categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: newSubCategoryName.trim(),
          category_id: selectedCategoryId
        }),
      });
      if (!response.ok) {
        throw new Error(await response.text() || "Failed to create subcategory");
      }
      const data = await response.json();
      await onRefreshCategories();
      setSelectedSubCategoryId(data.id);
      setIsAddingSubCategory(false);
      setNewSubCategoryName("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !url || !selectedCategoryId) {
      setError("Please fill in Name, URL, and Category");
      return;
    }

    // Auto-prepend https:// if URL does not start with http:// or https://
    let sanitizedUrl = url.trim();
    if (sanitizedUrl && !/^https?:\/\//i.test(sanitizedUrl)) {
      sanitizedUrl = `https://${sanitizedUrl}`;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          url: sanitizedUrl,
          description,
          category_id: selectedCategoryId,
          sub_category_id: selectedSubCategoryId || null,
        }),
      });
      if (!response.ok) {
        throw new Error(await response.text() || "Failed to add tool");
      }

      onSuccess();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-6 md:p-8 max-w-2xl mx-auto shadow-lg relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary" />
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Add New Web Tool</h2>
          <p className="text-sm text-muted-foreground">Keep your discovered web links organized and categorized.</p>
        </div>
        <button
          onClick={onCancel}
          className="p-2 hover:bg-muted rounded-full transition-colors"
          type="button"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl border border-destructive/20 bg-destructive/10 text-destructive text-sm font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name & URL */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Tool Name</label>
            <input
              type="text"
              placeholder="e.g. Supabase, Tailwind Play"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Web Link / URL</label>
            <input
              type="text"
              placeholder="e.g. supabase.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
              required
            />
          </div>
        </div>

        {/* Category selector */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Category</label>
            {!isAddingCategory && (
              <button
                type="button"
                onClick={() => setIsAddingCategory(true)}
                className="text-xs text-primary font-medium hover:underline flex items-center gap-1"
              >
                <Plus className="h-3 w-3" /> Add New Category
              </button>
            )}
          </div>

          {isAddingCategory ? (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="New category name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
              />
              <button
                type="button"
                onClick={handleAddCategory}
                disabled={loading}
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/95 text-sm transition-colors"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setIsAddingCategory(false)}
                className="px-3 py-2 rounded-xl border border-border hover:bg-muted text-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <select
              value={selectedCategoryId}
              onChange={(e) => {
                setSelectedCategoryId(e.target.value);
                setSelectedSubCategoryId("");
              }}
              className="px-4 py-2.5 rounded-xl border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm appearance-none"
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Sub-category selector */}
        {selectedCategoryId && (
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Sub-Category (Optional)</label>
              {!isAddingSubCategory && (
                <button
                  type="button"
                  onClick={() => setIsAddingSubCategory(true)}
                  className="text-xs text-primary font-medium hover:underline flex items-center gap-1"
                >
                  <Plus className="h-3 w-3" /> Add New Sub-Category
                </button>
              )}
            </div>

            {isAddingSubCategory ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="New subcategory name"
                  value={newSubCategoryName}
                  onChange={(e) => setNewSubCategoryName(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={handleAddSubCategory}
                  disabled={loading}
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/95 text-sm transition-colors"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingSubCategory(false)}
                  className="px-3 py-2 rounded-xl border border-border hover:bg-muted text-sm transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <select
                value={selectedSubCategoryId}
                onChange={(e) => setSelectedSubCategoryId(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm appearance-none"
              >
                <option value="">Select Sub-Category (None)</option>
                {filteredSubCategories.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Description</label>
          <textarea
            placeholder="A short description of the tool..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="px-4 py-2.5 rounded-xl border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl border border-border hover:bg-muted text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 text-sm shadow-md shadow-primary/20 transition-all hover:scale-102 active:scale-98 disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Save Tool
          </button>
        </div>
      </form>
    </div>
  );
}
