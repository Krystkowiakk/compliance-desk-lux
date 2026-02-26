"use client"

import { useState } from "react"
import Link from "next/link"
import { format, parseISO } from "date-fns"
import { toast } from "sonner"
import { Search, Plus, Filter, ChevronDown, ArrowUpDown, CheckSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { StatusBadge } from "@/components/status-badge"
import { OBLIGATIONS, AUTHORITIES, USERS, type ObligationStatus, type Authority } from "@/lib/data"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

function formatDue(date: string | null) {
  if (!date) return "—"
  return format(parseISO(date), "d MMM yyyy")
}

export default function ObligationsPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [authorityFilter, setAuthorityFilter] = useState("all")
  const [ownerFilter, setOwnerFilter] = useState("all")
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [addOpen, setAddOpen] = useState(false)
  const [form, setForm] = useState({
    name: "",
    authority: "" as Authority | "",
    dueDate: "",
    owner: "" as string,
    status: "" as ObligationStatus | "",
  })

  const filtered = OBLIGATIONS.filter((o) => {
    if (search && !o.name.toLowerCase().includes(search.toLowerCase())) return false
    if (statusFilter !== "all" && o.status !== statusFilter) return false
    if (authorityFilter !== "all" && o.authority !== authorityFilter) return false
    if (ownerFilter !== "all" && o.owner !== ownerFilter) return false
    return true
  })

  const allSelected = filtered.length > 0 && filtered.every((o) => selected.has(o.id))

  function toggleAll() {
    if (allSelected) {
      const next = new Set(selected)
      filtered.forEach((o) => next.delete(o.id))
      setSelected(next)
    } else {
      const next = new Set(selected)
      filtered.forEach((o) => next.add(o.id))
      setSelected(next)
    }
  }

  function toggleOne(id: string) {
    const next = new Set(selected)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelected(next)
  }

  function handleBulkAction(action: string) {
    toast.success(`${action} applied to ${selected.size} obligation(s) (demo)`)
    setSelected(new Set())
  }

  function handleSave() {
    if (!form.name.trim()) { toast.error("Please enter an obligation name."); return }
    toast.success("Obligation created (demo)")
    setAddOpen(false)
    setForm({ name: "", authority: "", dueDate: "", owner: "", status: "" })
  }

  return (
    <div className="px-8 py-7 max-w-screen-xl">
      {/* Page header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Obligations</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Track all compliance obligations for ABC Consulting SARL
          </p>
        </div>
        <Button
          className="gap-1.5 h-8 text-sm"
          onClick={() => setAddOpen(true)}
        >
          <Plus className="size-3.5" aria-hidden />
          Add obligation
        </Button>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="relative">
          <label htmlFor="obl-search" className="sr-only">Search obligations</label>
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" aria-hidden />
          <input
            id="obl-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search obligations…"
            className="h-8 pl-8 pr-3 text-sm bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground w-52"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-8 w-[140px] text-xs">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="At Risk">At Risk</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Not Started">Not Started</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
          </SelectContent>
        </Select>

        <Select value={authorityFilter} onValueChange={setAuthorityFilter}>
          <SelectTrigger className="h-8 w-[120px] text-xs">
            <SelectValue placeholder="Authority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All authorities</SelectItem>
            {AUTHORITIES.map((a) => (
              <SelectItem key={a} value={a}>{a}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={ownerFilter} onValueChange={setOwnerFilter}>
          <SelectTrigger className="h-8 w-[120px] text-xs">
            <SelectValue placeholder="Owner" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All owners</SelectItem>
            {USERS.map((u) => (
              <SelectItem key={u} value={u}>{u}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selected.size > 0 && (
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{selected.size} selected</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                  <CheckSquare className="size-3" aria-hidden />
                  Bulk action <ChevronDown className="size-3" aria-hidden />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleBulkAction("Mark as Completed")}>
                  Mark as Completed
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleBulkAction("Assign owner")}>
                  Assign owner
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="border border-border rounded overflow-hidden bg-card">
        <table className="w-full text-sm" role="grid">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-2.5 w-10">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={toggleAll}
                  aria-label={allSelected ? "Deselect all obligations" : "Select all obligations"}
                  className="mt-0.5"
                />
              </th>
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">
                Obligation
              </th>
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">
                <button className="flex items-center gap-1 hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring">
                  Due date <ArrowUpDown className="size-3" aria-hidden />
                </button>
              </th>
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">Status</th>
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">Owner</th>
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">Authority</th>
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">Category</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-16 text-center">
                  <Filter className="size-8 text-muted-foreground mx-auto mb-3" aria-hidden />
                  <p className="text-sm font-medium text-foreground">No obligations match your filters</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Try adjusting the filters above.</p>
                </td>
              </tr>
            ) : (
              filtered.map((obl, idx) => (
                <tr
                  key={obl.id}
                  className={`border-b border-border last:border-0 hover:bg-accent/40 transition-colors cursor-pointer ${
                    selected.has(obl.id) ? "bg-primary/5" : idx % 2 === 1 ? "bg-muted/20" : ""
                  }`}
                  onClick={() => toggleOne(obl.id)}
                >
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selected.has(obl.id)}
                      onCheckedChange={() => toggleOne(obl.id)}
                      aria-label={`Select ${obl.name}`}
                    />
                  </td>
                  <td
                    className="px-4 py-3 font-medium text-foreground"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Link
                      href={`/obligations/${obl.id}`}
                      className="hover:text-primary hover:underline focus-visible:outline-2 focus-visible:outline-ring"
                    >
                      {obl.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground tabular-nums text-xs">
                    {formatDue(obl.dueDate)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={obl.status} atRiskReason={obl.atRiskReason} />
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{obl.owner}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-secondary text-xs font-medium text-secondary-foreground border border-border">
                      {obl.authority}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{obl.category}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-border bg-muted/30">
          <p className="text-xs text-muted-foreground">
            Showing {filtered.length} of {OBLIGATIONS.length} obligations
          </p>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="mt-4 text-[11px] text-muted-foreground">
        For operational tracking purposes only. Does not constitute legal advice.
      </p>

      {/* Add Obligation Modal */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base">Add obligation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-1">
            <div className="space-y-1.5">
              <Label htmlFor="obl-name-list" className="text-xs font-medium">Name</Label>
              <Input
                id="obl-name-list"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Annual accounts filing"
                className="h-8 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="obl-authority-list" className="text-xs font-medium">Authority</Label>
              <Select
                value={form.authority}
                onValueChange={(v) => setForm((f) => ({ ...f, authority: v as Authority }))}
              >
                <SelectTrigger id="obl-authority-list" className="h-8 text-sm">
                  <SelectValue placeholder="Select authority…" />
                </SelectTrigger>
                <SelectContent>
                  {AUTHORITIES.map((a) => (
                    <SelectItem key={a} value={a}>{a}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="obl-due-list" className="text-xs font-medium">Due date</Label>
              <Input
                id="obl-due-list"
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
                className="h-8 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="obl-owner-list" className="text-xs font-medium">Owner</Label>
              <Select
                value={form.owner}
                onValueChange={(v) => setForm((f) => ({ ...f, owner: v }))}
              >
                <SelectTrigger id="obl-owner-list" className="h-8 text-sm">
                  <SelectValue placeholder="Assign owner…" />
                </SelectTrigger>
                <SelectContent>
                  {USERS.map((u) => (
                    <SelectItem key={u} value={u}>{u}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="obl-status-list" className="text-xs font-medium">Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) => setForm((f) => ({ ...f, status: v as ObligationStatus }))}
              >
                <SelectTrigger id="obl-status-list" className="h-8 text-sm">
                  <SelectValue placeholder="Select status…" />
                </SelectTrigger>
                <SelectContent>
                  {(["Not Started", "In Progress", "At Risk", "Completed"] as ObligationStatus[]).map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" className="h-8 text-sm" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button className="h-8 text-sm" onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
