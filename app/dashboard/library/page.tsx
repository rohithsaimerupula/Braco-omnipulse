"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Plus,
  Search,
  ShieldCheck,
  FileText,
  CheckCircle2,
  Database,
  X,
} from "lucide-react";
import {
  getBrandLibraryItems,
  addBrandLibraryItem,
} from "@/app/actions/campaignActions";

interface LibraryItem {
  id: string;
  item_type: string;
  title: string;
  content: string;
  tokens: string[];
  source: string;
  created_at: string;
}

export default function BrandLibraryPage() {
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [showModal, setShowModal] = useState(false);

  // New item form state
  const [itemType, setItemType] = useState<"claim" | "fact" | "rule">("claim");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tokensInput, setTokensInput] = useState("");
  const [source, setSource] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getBrandLibraryItems().then((data) => {
      setItems(data);
    });
  }, []);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    setSaving(true);

    const tokens = tokensInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const created = await addBrandLibraryItem({
      item_type: itemType,
      title: title.trim(),
      content: content.trim(),
      tokens,
      source: source.trim() || "Brand Knowledge Dossier 2026",
    });

    setItems((prev) => [created, ...prev]);
    setSaving(false);
    setShowModal(false);
    setTitle("");
    setContent("");
    setTokensInput("");
    setSource("");
  };

  const filteredItems = items.filter((item) => {
    const matchesType =
      filterType === "all" || item.item_type === filterType;
    const matchesSearch =
      !searchQuery.trim() ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.source.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const claimsAndFacts = filteredItems.filter(
    (i) => i.item_type === "claim" || i.item_type === "fact"
  );
  const rules = filteredItems.filter((i) => i.item_type === "rule");

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-serif text-2xl font-semibold text-forest">
              Brand Knowledge Library
            </h1>
            <Badge variant="success" className="text-2xs">
              <Database size={11} className="inline mr-1" />
              Turso libSQL Synced
            </Badge>
          </div>
          <p className="text-sm text-neutral-500 mt-1">
            Real-time repository of approved clinical claims, locked fact tokens, and ASCI brand compliance rules.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setShowModal(true)}
          iconRight={<Plus size={16} />}
        >
          Add Claim / Fact / Rule
        </Button>
      </div>

      {/* Add Item Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-forest/15 shadow-xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-forest/10 pb-3">
              <h3 className="font-serif text-lg font-semibold text-forest">
                Add to Brand Knowledge Library (Turso DB)
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-neutral-400 hover:text-graphite"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddItem} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-graphite uppercase tracking-wider mb-1">
                  Entry Type
                </label>
                <select
                  value={itemType}
                  onChange={(e) =>
                    setItemType(e.target.value as "claim" | "fact" | "rule")
                  }
                  className="w-full h-10 px-3 rounded-lg border border-forest/20 bg-ivory text-sm"
                >
                  <option value="claim">Approved Claim Atom</option>
                  <option value="fact">Product Fact</option>
                  <option value="rule">Brand / ASCI Compliance Rule</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-graphite uppercase tracking-wider mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Zero Trans Fat Certification"
                  className="w-full h-10 px-3 rounded-lg border border-forest/20 text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-graphite uppercase tracking-wider mb-1">
                  Canonical Statement / Rule Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="e.g., Certified 0g trans fat per 100g serving under FSSAI guidelines."
                  className="w-full p-3 rounded-lg border border-forest/20 text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-graphite uppercase tracking-wider mb-1">
                  Locked Tokens (comma-separated)
                </label>
                <input
                  type="text"
                  value={tokensInput}
                  onChange={(e) => setTokensInput(e.target.value)}
                  placeholder="e.g., 0g trans fat, per 100g"
                  className="w-full h-10 px-3 rounded-lg border border-forest/20 text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-graphite uppercase tracking-wider mb-1">
                  Evidence Source / Dossier
                </label>
                <input
                  type="text"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  placeholder="e.g., FSSAI Lab Certificate #2026-88B"
                  className="w-full h-10 px-3 rounded-lg border border-forest/20 text-sm"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  loading={saving}
                >
                  Save to Turso Database
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex gap-4 mb-8">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search approved facts, claims, or guidelines..."
            className="w-full h-10 pl-10 pr-4 rounded-lg border border-forest/15 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-forest/30"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="h-10 px-4 rounded-lg border border-forest/15 bg-white text-sm text-graphite focus:outline-none"
        >
          <option value="all">All types ({items.length})</option>
          <option value="claim">Approved Claims</option>
          <option value="fact">Product Facts</option>
          <option value="rule">Brand Rules</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Approved Claims & Facts */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-semibold text-graphite mb-2 flex items-center gap-2">
            <CheckCircle2 size={16} className="text-forest" />
            Approved Claims &amp; Product Facts ({claimsAndFacts.length})
          </h2>

          {claimsAndFacts.map((claim) => (
            <div
              key={claim.id}
              className="bg-white rounded-xl border border-forest/10 p-5 shadow-sm"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <Badge variant="success">Approved {claim.item_type}</Badge>
                  <span className="text-xs font-bold text-forest">
                    {claim.title}
                  </span>
                </div>
                <span className="text-2xs text-neutral-400 font-mono">
                  ID: {claim.id}
                </span>
              </div>
              <p className="text-sm text-graphite font-medium mb-4">
                &ldquo;{claim.content}&rdquo;
              </p>

              {claim.tokens && claim.tokens.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-xs text-neutral-500 mr-1">
                    Locked tokens:
                  </span>
                  {claim.tokens.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 bg-forest/5 border border-forest/10 text-forest text-xs rounded-md font-mono"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}

              <div className="pt-3 border-t border-forest/5 flex items-center justify-between text-xs text-neutral-500">
                <div className="flex items-center gap-1.5">
                  <FileText size={14} />
                  <span>Source: {claim.source}</span>
                </div>
                <span>
                  Synced:{" "}
                  {new Date(claim.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Brand Rules */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-graphite mb-2 flex items-center gap-2">
            <ShieldCheck size={16} className="text-forest" />
            Active Guardrail Rules ({rules.length})
          </h2>

          {rules.map((rule) => (
            <div
              key={rule.id}
              className="bg-sage/10 rounded-xl border border-sage-300/50 p-4"
            >
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-bold text-forest">{rule.title}</h3>
                <span className="text-3xs font-mono text-neutral-400">
                  {rule.id}
                </span>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed mb-2">
                {rule.content}
              </p>
              <span className="text-2xs text-forest/70 font-medium">
                Authority: {rule.source}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
