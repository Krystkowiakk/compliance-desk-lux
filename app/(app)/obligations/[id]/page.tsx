"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { format, parseISO } from "date-fns"
import { toast } from "sonner"
import {
  ChevronRight, BadgeCheck, FileText, Plus, Paperclip, User,
  Calendar, Activity, MessageSquare, CheckCircle2, Clock, Circle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { StatusBadge } from "@/components/status-badge"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { OBLIGATIONS, USERS, type ObligationStatus, type ChecklistItem, type Task } from "@/lib/data"

function formatDue(date: string | null) {
  if (!date) return "—"
  return format(parseISO(date), "d MMM yyyy")
}

const TASK_STATUS_CONFIG: Record<Task["status"], { icon: React.ElementType; className: string }> = {
  Done: { icon: CheckCircle2, className: "text-emerald-600" },
  "In Progress": { icon: Clock, className: "text-blue-600" },
  Pending: { icon: Circle, className: "text-slate-400" },
}

export default function ObligationDetailPage() {
  const params = useParams()
  const id = params?.id as string

  const baseObl = OBLIGATIONS.find((o) => o.id === id)

  // Local editable state
  const [obl, setObl] = useState(baseObl)
  const [activeTab, setActiveTab] = useState("overview")
  const [addTaskOpen, setAddTaskOpen] = useState(false)
  const [attachOpen, setAttachOpen] = useState(false)
  const [addNoteOpen, setAddNoteOpen] = useState(false)
  const [noteText, setNoteText] = useState("")
  const [newTask, setNewTask] = useState({ title: "", assignee: "", dueDate: "" })

  if (!obl) {
    return (
      <div className="px-8 py-16 text-center">
        <p className="text-sm text-muted-foreground">Obligation not found.</p>
        <Button asChild variant="link" className="mt-2">
          <Link href="/obligations">Back to obligations</Link>
        </Button>
      </div>
    )
  }

  const completedChecklist = obl.checklist.filter((c) => c.completed).length
  const totalChecklist = obl.checklist.length
  const progress = totalChecklist > 0 ? Math.round((completedChecklist / totalChecklist) * 100) : 0

  function toggleChecklistItem(itemId: string) {
    setObl((prev) =>
      prev
        ? {
            ...prev,
            checklist: prev.checklist.map((c) =>
              c.id === itemId ? { ...c, completed: !c.completed } : c
            ),
          }
        : prev
    )
  }

  function handleAddTask() {
    if (!newTask.title.trim()) { toast.error("Enter a task title."); return }
    const task: Task = {
      id: `t-${Date.now()}`,
      title: newTask.title,
      assignee: newTask.assignee || "—",
      dueDate: newTask.dueDate,
      status: "Pending",
    }
    setObl((prev) => prev ? { ...prev, tasks: [...prev.tasks, task] } : prev)
    toast.success("Task added (demo)")
    setAddTaskOpen(false)
    setNewTask({ title: "", assignee: "", dueDate: "" })
  }

  function handleAttachDocument() {
    toast.success("Document attached (demo)")
    setAttachOpen(false)
  }

  function handleAddNote() {
    if (!noteText.trim()) { toast.error("Enter a note."); return }
    setObl((prev) =>
      prev
        ? {
            ...prev,
            notes: [
              ...prev.notes,
              { id: `n-${Date.now()}`, text: noteText, author: "Marie K.", date: new Date().toISOString().slice(0, 10) },
            ],
          }
        : prev
    )
    toast.success("Note added")
    setAddNoteOpen(false)
    setNoteText("")
  }

  return (
    <div className="px-8 py-7 max-w-screen-xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-5" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring">Dashboard</Link>
        <ChevronRight className="size-3" aria-hidden />
        <Link href="/obligations" className="hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring">Obligations</Link>
        <ChevronRight className="size-3" aria-hidden />
        <span className="text-foreground font-medium truncate">{obl.name}</span>
      </nav>

      <div className="flex flex-col xl:flex-row gap-7">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="mb-5">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h1 className="text-xl font-semibold text-foreground">{obl.name}</h1>
              <StatusBadge status={obl.status} atRiskReason={obl.atRiskReason} />
              <span className="inline-flex items-center px-2 py-0.5 rounded bg-secondary text-xs font-medium text-secondary-foreground border border-border">
                {obl.authority}
              </span>
              <Badge variant="outline" className="text-xs border-border text-muted-foreground">{obl.frequency}</Badge>
            </div>
            {/* Reviewed by Stéphane Leloup */}
            <div className="flex items-center gap-1.5 mt-1">
              <BadgeCheck className="size-3.5 text-primary shrink-0" aria-hidden />
              <span className="text-xs font-medium text-primary">Reviewed by Stéphane Leloup</span>
              <span className="text-muted-foreground text-xs">·</span>
              <span className="text-[11px] text-muted-foreground">
                For operational tracking purposes only. Does not constitute legal advice.
              </span>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="h-8 bg-muted border border-border mb-5">
              <TabsTrigger value="overview" className="text-xs h-7">Overview</TabsTrigger>
              <TabsTrigger value="checklist" className="text-xs h-7">
                Checklist
                <span className="ml-1.5 text-[10px] bg-primary/10 text-primary rounded-full px-1.5">
                  {completedChecklist}/{totalChecklist}
                </span>
              </TabsTrigger>
              <TabsTrigger value="tasks" className="text-xs h-7">
                Tasks
                <span className="ml-1.5 text-[10px] bg-primary/10 text-primary rounded-full px-1.5">
                  {obl.tasks.length}
                </span>
              </TabsTrigger>
              <TabsTrigger value="documents" className="text-xs h-7">
                Documents
                <span className="ml-1.5 text-[10px] bg-primary/10 text-primary rounded-full px-1.5">
                  {obl.documents.length}
                </span>
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-5 mt-0">
              <div className="bg-card border border-border rounded p-5 space-y-4">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Description</p>
                  <p className="text-sm text-foreground leading-relaxed">{obl.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Typical deadline</p>
                    <p className="text-sm font-medium text-foreground">
                      {obl.frequency === "Annual" ? "7 months after fiscal year end" : obl.frequency}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Evidence required</p>
                    <p className="text-sm font-medium text-foreground">{obl.evidenceRequired}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Authority</p>
                    <p className="text-sm font-medium text-foreground">{obl.authority}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Category</p>
                    <p className="text-sm font-medium text-foreground">{obl.category}</p>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-foreground">Notes</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs gap-1"
                    onClick={() => setAddNoteOpen(true)}
                  >
                    <Plus className="size-3" aria-hidden /> Add note
                  </Button>
                </div>
                {obl.notes.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No notes yet.</p>
                ) : (
                  <div className="space-y-2">
                    {obl.notes.map((note) => (
                      <div key={note.id} className="bg-card border border-border rounded p-3">
                        <p className="text-sm text-foreground leading-relaxed">{note.text}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {note.author} · {formatDue(note.date)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Checklist Tab */}
            <TabsContent value="checklist" className="mt-0">
              <div className="bg-card border border-border rounded p-5">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-semibold text-foreground">
                    Progress — {completedChecklist}/{totalChecklist} completed
                  </p>
                  <span className="text-xs font-semibold text-primary">{progress}%</span>
                </div>
                <Progress value={progress} className="h-1.5 mb-5" />
                <ul className="space-y-3" aria-label="Checklist items">
                  {obl.checklist.map((item) => (
                    <li key={item.id} className="flex items-center gap-3">
                      <Checkbox
                        id={`check-${item.id}`}
                        checked={item.completed}
                        onCheckedChange={() => toggleChecklistItem(item.id)}
                        aria-label={item.label}
                      />
                      <label
                        htmlFor={`check-${item.id}`}
                        className={`text-sm cursor-pointer ${
                          item.completed ? "line-through text-muted-foreground" : "text-foreground"
                        }`}
                      >
                        {item.label}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>

            {/* Tasks Tab */}
            <TabsContent value="tasks" className="mt-0">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-foreground">Tasks ({obl.tasks.length})</p>
                <Button
                  size="sm"
                  className="h-7 text-xs gap-1"
                  onClick={() => setAddTaskOpen(true)}
                >
                  <Plus className="size-3" aria-hidden /> Add task
                </Button>
              </div>
              {obl.tasks.length === 0 ? (
                <div className="bg-card border border-border rounded p-8 text-center">
                  <p className="text-sm text-muted-foreground">No tasks yet.</p>
                </div>
              ) : (
                <div className="bg-card border border-border rounded overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">Task</th>
                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">Assignee</th>
                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">Due date</th>
                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {obl.tasks.map((task, idx) => {
                        const { icon: Icon, className } = TASK_STATUS_CONFIG[task.status]
                        return (
                          <tr
                            key={task.id}
                            className={`border-b border-border last:border-0 ${idx % 2 === 1 ? "bg-muted/20" : ""}`}
                          >
                            <td className="px-4 py-3 font-medium text-foreground">{task.title}</td>
                            <td className="px-4 py-3 text-muted-foreground text-xs">{task.assignee}</td>
                            <td className="px-4 py-3 text-muted-foreground text-xs tabular-nums">
                              {task.dueDate ? formatDue(task.dueDate) : "—"}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`flex items-center gap-1 text-xs ${className}`}>
                                <Icon className="size-3.5" aria-hidden />
                                {task.status}
                              </span>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent value="documents" className="mt-0">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-foreground">Attached Documents ({obl.documents.length})</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs gap-1"
                  onClick={() => setAttachOpen(true)}
                >
                  <Paperclip className="size-3" aria-hidden /> Attach document
                </Button>
              </div>
              {obl.documents.length === 0 ? (
                <div className="bg-card border border-border rounded p-8 text-center">
                  <FileText className="size-8 text-muted-foreground mx-auto mb-2" aria-hidden />
                  <p className="text-sm text-muted-foreground">No documents attached yet.</p>
                </div>
              ) : (
                <div className="bg-card border border-border rounded overflow-hidden">
                  {obl.documents.map((doc, idx) => (
                    <div
                      key={doc.id}
                      className={`flex items-center gap-4 px-4 py-3 ${
                        idx < obl.documents.length - 1 ? "border-b border-border" : ""
                      }`}
                    >
                      <FileText className="size-4 text-muted-foreground shrink-0" aria-hidden />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {doc.category} · Updated {formatDue(doc.lastUpdated)} · {doc.size}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-1 shrink-0">
                        {doc.tags.map((t) => (
                          <span key={t} className="text-[10px] bg-secondary text-secondary-foreground border border-border px-1.5 py-0.5 rounded">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Right panel */}
        <aside className="xl:w-64 shrink-0 space-y-4" aria-label="Obligation details">
          <div className="bg-card border border-border rounded p-4 space-y-4">
            <div>
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Owner</p>
              <Select
                value={obl.owner}
                onValueChange={(v) => {
                  setObl((prev) => prev ? { ...prev, owner: v } : prev)
                  toast.success(`Owner updated to ${v} (demo)`)
                }}
              >
                <SelectTrigger className="h-7 text-xs">
                  <User className="size-3 text-muted-foreground mr-1" aria-hidden />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {USERS.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div>
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Due Date</p>
              <div className="flex items-center gap-1.5 text-sm text-foreground">
                <Calendar className="size-3.5 text-muted-foreground" aria-hidden />
                {formatDue(obl.dueDate)}
              </div>
            </div>

            <div>
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Status</p>
              <Select
                value={obl.status}
                onValueChange={(v) => {
                  setObl((prev) => prev ? { ...prev, status: v as ObligationStatus } : prev)
                  toast.success(`Status updated to ${v} (demo)`)
                }}
              >
                <SelectTrigger className="h-7 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(["Not Started", "In Progress", "At Risk", "Completed"] as ObligationStatus[]).map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Activity log */}
          <div className="bg-card border border-border rounded p-4">
            <div className="flex items-center gap-1.5 mb-3">
              <Activity className="size-3.5 text-muted-foreground" aria-hidden />
              <p className="text-xs font-semibold text-foreground">Activity</p>
            </div>
            {obl.activity.length === 0 ? (
              <p className="text-xs text-muted-foreground">No activity yet.</p>
            ) : (
              <ul className="space-y-2.5">
                {obl.activity.map((item) => (
                  <li key={item.id} className="text-xs">
                    <p className="text-foreground">{item.text}</p>
                    <p className="text-muted-foreground mt-0.5">
                      {item.actor} · {formatDue(item.date)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      </div>

      {/* Add Task Modal */}
      <Dialog open={addTaskOpen} onOpenChange={setAddTaskOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base">Add task</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-1">
            <div className="space-y-1.5">
              <Label className="text-xs">Title</Label>
              <Input
                value={newTask.title}
                onChange={(e) => setNewTask((t) => ({ ...t, title: e.target.value }))}
                placeholder="Task title…"
                className="h-8 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Assignee</Label>
              <Select value={newTask.assignee} onValueChange={(v) => setNewTask((t) => ({ ...t, assignee: v }))}>
                <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="Assign to…" /></SelectTrigger>
                <SelectContent>
                  {USERS.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Due date</Label>
              <Input
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask((t) => ({ ...t, dueDate: e.target.value }))}
                className="h-8 text-sm"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" className="h-8 text-sm" onClick={() => setAddTaskOpen(false)}>Cancel</Button>
            <Button className="h-8 text-sm" onClick={handleAddTask}>Add task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Attach Document Modal */}
      <Dialog open={attachOpen} onOpenChange={setAttachOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base">Attach document</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-1">
            <div className="border-2 border-dashed border-border rounded p-6 text-center">
              <FileText className="size-8 text-muted-foreground mx-auto mb-2" aria-hidden />
              <p className="text-sm text-muted-foreground">Select a document from the repository</p>
              <p className="text-xs text-muted-foreground mt-1">(Demo — no file upload)</p>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" className="h-8 text-sm" onClick={() => setAttachOpen(false)}>Cancel</Button>
            <Button className="h-8 text-sm" onClick={handleAttachDocument}>Attach</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Note Modal */}
      <Dialog open={addNoteOpen} onOpenChange={setAddNoteOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base">Add note</DialogTitle>
          </DialogHeader>
          <div className="py-1">
            <Textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Enter a note…"
              className="text-sm min-h-24"
            />
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" className="h-8 text-sm" onClick={() => setAddNoteOpen(false)}>Cancel</Button>
            <Button className="h-8 text-sm" onClick={handleAddNote}>Add note</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
