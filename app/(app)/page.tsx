"use client"

import { useState } from "react"
import Link from "next/link"
import { format, parseISO } from "date-fns"
import { toast } from "sonner"
import {
  Plus, ChevronRight, FileText, BookOpen, Upload,
  ArrowUpDown, AlertTriangle, Clock, ShieldCheck, CalendarDays,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { StatusBadge } from "@/components/status-badge"
import { OBLIGATIONS, AUTHORITIES, USERS, type ObligationStatus, type Authority } from "@/lib/data"

const DASHBOARD_OBLIGATIONS = OBLIGATIONS.filter((o) =>
  ["annual-accounts", "vat-q1", "ubo-register", "corporate-tax", "rcs-update"].includes(o.id)
)

const KPI = [
  { label: "Total Obligations", value: 12, icon: ShieldCheck, color: "text-primary" },
  { label: "Completed", value: 5, icon: ShieldCheck, color: "text-emerald-600" },
  { label: "At Risk", value: 2, icon: AlertTriangle, color: "text-amber-600" },
  { label: "Next Deadline", value: "10 Mar", icon: CalendarDays, color: "text-primary" },
]

const RECENT_UPDATES = [
  { icon: BookOpen, label: "Knowledge article updated", detail: "UBO reporting basics", time: "2h ago" },
  { icon: FileText, label: "Template added", detail: "Annual accounts checklist", time: "Yesterday" },
  { icon: Upload, label: "Document uploaded", detail: "Filing Confirmation 2024.pdf", time: "3 days ago" },
]

function formatDue(date: string | null) {
  if (!date) return "—"
  return format(parseISO(date), "d MMM yyyy")
}

type SortKey = "dueDate" | "risk"

const RISK_ORDER: Record<ObligationStatus, number> = {
  "At Risk": 0,
  "In Progress": 1,
  "Not Started": 2,
  Completed: 3,
}

export default function DashboardPage() {
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [ownerFilter, setOwnerFilter] = useState<string>("all")
  const [sortKey, setSortKey] = useState<SortKey>("dueDate")
  const [addOpen, setAddOpen] = useState(false)

  // Add obligation form state
  const [form, setForm] = useState({
    name: "",
    authority: "" as Authority | "",
    dueDate: "",
    owner: "" as string,
    status: "" as ObligationStatus | "",
  })

  const filtered = DASHBOARD_OBLIGATIONS.filter((o) => {
    if (statusFilter !== "all" && o.status !== statusFilter) return false
    if (ownerFilter !== "all" && o.owner !== ownerFilter) return false
    return true
  }).sort((a, b) => {
    if (sortKey === "dueDate") {
      if (!a.dueDate) return 1
      if (!b.dueDate) return -1
      return a.dueDate.localeCompare(b.dueDate)
    }
    return RISK_ORDER[a.status] - RISK_ORDER[b.status]
  })

  function handleSave() {
    if (!form.name.trim()) {
      toast.error("Please enter an obligation name.")
      return
    }
    toast.success("Obligation created (demo)")
    setAddOpen(false)
    setForm({ name: "", authority: "", dueDate: "", owner: "", status: "" })
  }

  return (
    <div className="px-8 py-7 max-w-screen-xl">
      {/* Page header */}
      <div className="flex items-start justify-between mb-7">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            ABC Consulting SARL — compliance overview
          </p>
        </div>
        <Button onClick={() => setAddOpen(true)} className="gap-1.5 h-8 text-sm">
          <Plus className="size-3.5" aria-hidden />
          Add obligation
        </Button>
      </div>

      {/* KPI cards */}
      <section aria-label="Compliance overview" className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {KPI.map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="border-border">
            <CardContent className="p-5">
              <p className="text-xs text-muted-foreground font-medium mb-1">{label}</p>
              <p className={`text-2xl font-semibold ${color}`}>{value}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Upcoming Deadlines */}
      <section aria-label="Upcoming deadlines" className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-foreground">Upcoming Deadlines</h2>
          <Link
            href="/obligations"
            className="text-xs text-primary hover:underline flex items-center gap-0.5 focus-visible:outline-2 focus-visible:outline-ring"
          >
            View all <ChevronRight className="size-3" aria-hidden />
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-7 w-[140px] text-xs">
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

          <Select value={ownerFilter} onValueChange={setOwnerFilter}>
            <SelectTrigger className="h-7 w-[130px] text-xs">
              <SelectValue placeholder="Owner" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All owners</SelectItem>
              {USERS.map((u) => (
                <SelectItem key={u} value={u}>{u}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="ml-auto flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground">Sort by:</span>
            <button
              onClick={() => setSortKey("dueDate")}
              className={`text-xs px-2.5 py-1 rounded border transition-colors focus-visible:outline-2 focus-visible:outline-ring ${
                sortKey === "dueDate"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:bg-accent"
              }`}
            >
              Due date
            </button>
            <button
              onClick={() => setSortKey("risk")}
              className={`text-xs px-2.5 py-1 rounded border transition-colors focus-visible:outline-2 focus-visible:outline-ring ${
                sortKey === "risk"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:bg-accent"
              }`}
            >
              Risk
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="border border-border rounded overflow-hidden bg-card">
          {filtered.length === 0 ? (
            <div className="py-16 text-center">
              <Clock className="size-8 text-muted-foreground mx-auto mb-3" aria-hidden />
              <p className="text-sm font-medium text-foreground mb-1">No obligations match your filters</p>
              <p className="text-xs text-muted-foreground mb-4">Adjust your filters or add a new obligation.</p>
              <Button size="sm" onClick={() => setAddOpen(true)} className="gap-1.5">
                <Plus className="size-3" aria-hidden /> Add obligation
              </Button>
            </div>
          ) : (
            <table className="w-full text-sm" role="grid">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground w-[30%]">
                    <button
                      className="flex items-center gap-1 hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
                      onClick={() => setSortKey("dueDate")}
                    >
                      Obligation <ArrowUpDown className="size-3" aria-hidden />
                    </button>
                  </th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">Due date</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">Status</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">Owner</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">Authority</th>
                  <th className="text-right px-4 py-2.5 text-xs font-semibold text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((obl, idx) => (
                  <tr
                    key={obl.id}
                    className={`border-b border-border last:border-0 hover:bg-accent/50 transition-colors ${
                      idx % 2 === 1 ? "bg-muted/20" : ""
                    }`}
                  >
                    <td className="px-4 py-3 font-medium text-foreground">
                      <Link
                        href={`/obligations/${obl.id}`}
                        className="hover:text-primary hover:underline focus-visible:outline-2 focus-visible:outline-ring"
                      >
                        {obl.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground tabular-nums">
                      {formatDue(obl.dueDate)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={obl.status} atRiskReason={obl.atRiskReason} />
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{obl.owner}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-secondary text-xs font-medium text-secondary-foreground border border-border">
                        {obl.authority}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button asChild size="sm" className="h-6 text-xs px-2">
                          <Link href={`/obligations/${obl.id}`}>View</Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-6 text-xs px-2"
                          onClick={() => toast.info(`Update status for "${obl.name}" (demo)`)}
                        >
                          Update status
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {/* Recent Updates */}
      <section aria-label="Recent updates">
        <h2 className="text-sm font-semibold text-foreground mb-3">Recent Updates</h2>
        <Card className="border-border">
          <CardContent className="p-0">
            {RECENT_UPDATES.map(({ icon: Icon, label, detail, time }, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-3 px-5 py-3.5 ${
                  idx < RECENT_UPDATES.length - 1 ? "border-b border-border" : ""
                }`}
              >
                <div className="size-7 rounded bg-accent flex items-center justify-center shrink-0">
                  <Icon className="size-3.5 text-primary" aria-hidden />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="text-sm font-medium text-foreground truncate">{detail}</p>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">{time}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      {/* Add Obligation Modal */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base">Add obligation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-1">
            <div className="space-y-1.5">
              <Label htmlFor="obl-name" className="text-xs font-medium">Name</Label>
              <Input
                id="obl-name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Annual accounts filing"
                className="h-8 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="obl-authority" className="text-xs font-medium">Authority</Label>
              <Select
                value={form.authority}
                onValueChange={(v) => setForm((f) => ({ ...f, authority: v as Authority }))}
              >
                <SelectTrigger id="obl-authority" className="h-8 text-sm">
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
              <Label htmlFor="obl-due" className="text-xs font-medium">Due date</Label>
              <Input
                id="obl-due"
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
                className="h-8 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="obl-owner" className="text-xs font-medium">Owner</Label>
              <Select
                value={form.owner}
                onValueChange={(v) => setForm((f) => ({ ...f, owner: v }))}
              >
                <SelectTrigger id="obl-owner" className="h-8 text-sm">
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
              <Label htmlFor="obl-status" className="text-xs font-medium">Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) => setForm((f) => ({ ...f, status: v as ObligationStatus }))}
              >
                <SelectTrigger id="obl-status" className="h-8 text-sm">
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
