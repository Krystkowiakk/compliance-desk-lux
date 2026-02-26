"use client"

import { useState } from "react"
import { format, parseISO } from "date-fns"
import { toast } from "sonner"
import {
  Search, Upload, FileText, Folder, X, Tag, Link2, Download, Pencil,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { ALL_DOCUMENTS, OBLIGATIONS, type Document, type DocCategory } from "@/lib/data"

const FOLDERS: { label: string; value: DocCategory | "All" }[] = [
  { label: "All documents", value: "All" },
  { label: "Corporate", value: "Corporate" },
  { label: "Tax", value: "Tax" },
  { label: "Accounting", value: "Accounting" },
  { label: "UBO", value: "UBO" },
]

function formatDate(date: string) {
  return format(parseISO(date), "d MMM yyyy")
}

const CATEGORY_ICONS: Record<DocCategory | "All", React.ElementType> = {
  All: Folder,
  Corporate: Folder,
  Tax: Folder,
  Accounting: Folder,
  UBO: Folder,
}

export default function DocumentsPage() {
  const [docs, setDocs] = useState<Document[]>(ALL_DOCUMENTS)
  const [activeFolder, setActiveFolder] = useState<DocCategory | "All">("All")
  const [search, setSearch] = useState("")
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null)
  const [uploadOpen, setUploadOpen] = useState(false)
  const [uploadForm, setUploadForm] = useState({ name: "", category: "" as DocCategory | "", tag: "" })

  const filtered = docs.filter((d) => {
    if (activeFolder !== "All" && d.category !== activeFolder) return false
    if (search && !d.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const folderCounts = FOLDERS.map((f) => ({
    ...f,
    count: f.value === "All" ? docs.length : docs.filter((d) => d.category === f.value).length,
  }))

  function handleUpload() {
    if (!uploadForm.name.trim()) { toast.error("Enter a document name."); return }
    const newDoc: Document = {
      id: `d-${Date.now()}`,
      name: uploadForm.name,
      category: (uploadForm.category as DocCategory) || "Corporate",
      linkedObligation: null,
      lastUpdated: new Date().toISOString().slice(0, 10),
      owner: "Marie K.",
      tags: uploadForm.tag ? [uploadForm.tag] : [],
      size: "—",
    }
    setDocs((prev) => [newDoc, ...prev])
    toast.success("Document uploaded (demo)")
    setUploadOpen(false)
    setUploadForm({ name: "", category: "", tag: "" })
  }

  return (
    <div className="px-8 py-7 max-w-screen-xl">
      {/* Page header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Documents</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Repository for all compliance-related files
          </p>
        </div>
        <Button className="gap-1.5 h-8 text-sm" onClick={() => setUploadOpen(true)}>
          <Upload className="size-3.5" aria-hidden /> Upload document
        </Button>
      </div>

      <div className="flex gap-6">
        {/* Folder navigation */}
        <nav className="w-44 shrink-0" aria-label="Document folders">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-2 px-2">
            Folders
          </p>
          <ul className="space-y-0.5">
            {folderCounts.map(({ label, value, count }) => (
              <li key={value}>
                <button
                  onClick={() => setActiveFolder(value)}
                  className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded text-sm transition-colors focus-visible:outline-2 focus-visible:outline-ring ${
                    activeFolder === value
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                  aria-current={activeFolder === value ? "true" : undefined}
                >
                  <span className="flex items-center gap-2">
                    <Folder className="size-3.5 shrink-0" aria-hidden />
                    {label}
                  </span>
                  <span className="text-[11px] bg-muted border border-border text-muted-foreground rounded px-1.5 py-0.5 tabular-nums">
                    {count}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Main area */}
        <div className="flex-1 min-w-0">
          {/* Search + filter bar */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <div className="relative">
              <label htmlFor="doc-search" className="sr-only">Search documents</label>
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" aria-hidden />
              <input
                id="doc-search"
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search documents…"
                className="h-8 pl-8 pr-3 text-sm bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground w-48"
              />
            </div>
            <Select>
              <SelectTrigger className="h-8 w-[160px] text-xs">
                <SelectValue placeholder="Linked obligation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All obligations</SelectItem>
                {OBLIGATIONS.slice(0, 5).map((o) => (
                  <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Table + preview */}
          <div className="flex gap-4">
            {/* Documents table */}
            <div className={`border border-border rounded overflow-hidden bg-card ${selectedDoc ? "flex-1 min-w-0" : "w-full"}`}>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">Document</th>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">Category</th>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">Linked obligation</th>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">Updated</th>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">Owner</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center">
                        <FileText className="size-8 text-muted-foreground mx-auto mb-2" aria-hidden />
                        <p className="text-sm text-muted-foreground">No documents found.</p>
                      </td>
                    </tr>
                  ) : (
                    filtered.map((doc, idx) => (
                      <tr
                        key={doc.id}
                        onClick={() => setSelectedDoc(selectedDoc?.id === doc.id ? null : doc)}
                        className={`border-b border-border last:border-0 cursor-pointer hover:bg-accent/40 transition-colors ${
                          selectedDoc?.id === doc.id ? "bg-primary/5" : idx % 2 === 1 ? "bg-muted/20" : ""
                        }`}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <FileText className="size-3.5 text-muted-foreground shrink-0" aria-hidden />
                            <span className="font-medium text-foreground truncate max-w-[160px]">{doc.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs bg-secondary text-secondary-foreground border border-border px-2 py-0.5 rounded">
                            {doc.category}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground truncate max-w-[140px]">
                          {doc.linkedObligation ?? "—"}
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground tabular-nums">
                          {formatDate(doc.lastUpdated)}
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">{doc.owner}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              <div className="px-4 py-2 border-t border-border bg-muted/30">
                <p className="text-xs text-muted-foreground">{filtered.length} document{filtered.length !== 1 ? "s" : ""}</p>
              </div>
            </div>

            {/* Preview panel */}
            {selectedDoc && (
              <aside
                className="w-64 shrink-0 border border-border rounded bg-card overflow-hidden"
                aria-label="Document preview"
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                  <p className="text-xs font-semibold text-foreground">Document details</p>
                  <button
                    onClick={() => setSelectedDoc(null)}
                    className="text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
                    aria-label="Close preview"
                  >
                    <X className="size-3.5" aria-hidden />
                  </button>
                </div>

                <div className="p-4 space-y-4">
                  {/* File icon */}
                  <div className="w-full aspect-[4/3] bg-muted border border-border rounded flex items-center justify-center">
                    <div className="text-center">
                      <FileText className="size-10 text-muted-foreground mx-auto mb-1.5" aria-hidden />
                      <p className="text-[10px] text-muted-foreground">Preview not available</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-foreground break-words">{selectedDoc.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{selectedDoc.size}</p>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Category</span>
                      <span className="font-medium text-foreground">{selectedDoc.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Owner</span>
                      <span className="font-medium text-foreground">{selectedDoc.owner}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last updated</span>
                      <span className="font-medium text-foreground tabular-nums">{formatDate(selectedDoc.lastUpdated)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Linked obligation</span>
                      <span className="font-medium text-foreground text-right max-w-[100px] truncate">
                        {selectedDoc.linkedObligation ?? "—"}
                      </span>
                    </div>
                  </div>

                  {selectedDoc.tags.length > 0 && (
                    <div>
                      <p className="text-[11px] text-muted-foreground mb-1.5">Tags</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedDoc.tags.map((t) => (
                          <span key={t} className="flex items-center gap-0.5 text-[10px] bg-secondary text-secondary-foreground border border-border px-1.5 py-0.5 rounded">
                            <Tag className="size-2.5" aria-hidden /> {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-1.5 pt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled
                      className="w-full h-7 text-xs gap-1.5"
                      aria-label="Download (demo only)"
                    >
                      <Download className="size-3" aria-hidden /> Download (demo)
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full h-7 text-xs gap-1.5"
                      onClick={() => toast.info("Rename document (demo)")}
                    >
                      <Pencil className="size-3" aria-hidden /> Rename
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full h-7 text-xs gap-1.5"
                      onClick={() => toast.info("Link to obligation (demo)")}
                    >
                      <Link2 className="size-3" aria-hidden /> Link to obligation
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full h-7 text-xs gap-1.5"
                      onClick={() => toast.info("Add tag (demo)")}
                    >
                      <Tag className="size-3" aria-hidden /> Add tag
                    </Button>
                  </div>
                </div>
              </aside>
            )}
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base">Upload document</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-1">
            <div className="border-2 border-dashed border-border rounded p-4 text-center mb-2">
              <Upload className="size-7 text-muted-foreground mx-auto mb-1.5" aria-hidden />
              <p className="text-xs text-muted-foreground">Drag & drop or click to select (demo)</p>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Document name</Label>
              <Input
                value={uploadForm.name}
                onChange={(e) => setUploadForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Annual report 2025.pdf"
                className="h-8 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Category</Label>
              <Select
                value={uploadForm.category}
                onValueChange={(v) => setUploadForm((f) => ({ ...f, category: v as DocCategory }))}
              >
                <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="Select category…" /></SelectTrigger>
                <SelectContent>
                  {(["Corporate", "Tax", "Accounting", "UBO"] as DocCategory[]).map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Tag</Label>
              <Input
                value={uploadForm.tag}
                onChange={(e) => setUploadForm((f) => ({ ...f, tag: e.target.value }))}
                placeholder="e.g. draft"
                className="h-8 text-sm"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" className="h-8 text-sm" onClick={() => setUploadOpen(false)}>Cancel</Button>
            <Button className="h-8 text-sm" onClick={handleUpload}>Upload</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
