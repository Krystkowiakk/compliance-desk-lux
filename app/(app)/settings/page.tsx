"use client"

import { useState } from "react"
import { toast } from "sonner"
import { User, Building2, Bell, Shield, Users, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { USERS } from "@/lib/data"

const SECTIONS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "company", label: "Company", icon: Building2 },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "team", label: "Team", icon: Users },
  { id: "security", label: "Security", icon: Shield },
]

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("profile")

  // Profile state
  const [profile, setProfile] = useState({ name: "Marie K.", email: "marie.k@abcconsulting.lu", role: "CFO" })

  // Company state
  const [company, setCompany] = useState({
    name: "ABC Consulting SARL",
    rcs: "B123456",
    vat: "LU12345678",
    address: "12 Rue de la Liberté, L-1930 Luxembourg",
    fyEnd: "December",
  })

  // Notification state
  const [notifs, setNotifs] = useState({
    deadlineAlerts: true,
    statusChanges: true,
    taskAssignments: true,
    weeklyDigest: false,
    email: true,
    inApp: true,
  })

  function saveProfile() {
    toast.success("Profile saved (demo)")
  }

  function saveCompany() {
    toast.success("Company details saved (demo)")
  }

  return (
    <div className="px-8 py-7 max-w-screen-lg">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Manage your profile, company details, and preferences
        </p>
      </div>

      <div className="flex gap-6">
        {/* Settings nav */}
        <nav className="w-48 shrink-0" aria-label="Settings sections">
          <ul className="space-y-0.5">
            {SECTIONS.map(({ id, label, icon: Icon }) => (
              <li key={id}>
                <button
                  onClick={() => setActiveSection(id)}
                  className={cn(
                    "w-full flex items-center justify-between gap-2.5 px-3 py-2 rounded text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-ring",
                    activeSection === id
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                  aria-current={activeSection === id ? "page" : undefined}
                >
                  <span className="flex items-center gap-2.5">
                    <Icon className="size-4 shrink-0" aria-hidden />
                    {label}
                  </span>
                  <ChevronRight className="size-3.5 opacity-50 shrink-0" aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Settings content */}
        <div className="flex-1 min-w-0">
          {/* Profile */}
          {activeSection === "profile" && (
            <SettingsCard title="Profile" description="Update your personal information.">
              <div className="space-y-4">
                <div className="flex items-center gap-4 pb-4 border-b border-border">
                  <div className="size-14 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-lg font-semibold select-none">
                    MK
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{profile.name}</p>
                    <p className="text-xs text-muted-foreground">{profile.role}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FieldGroup label="Full name">
                    <Input
                      value={profile.name}
                      onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                      className="h-8 text-sm"
                    />
                  </FieldGroup>
                  <FieldGroup label="Role / title">
                    <Input
                      value={profile.role}
                      onChange={(e) => setProfile((p) => ({ ...p, role: e.target.value }))}
                      className="h-8 text-sm"
                    />
                  </FieldGroup>
                  <FieldGroup label="Email address" className="col-span-2">
                    <Input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                      className="h-8 text-sm"
                    />
                  </FieldGroup>
                </div>

                <div className="flex justify-end pt-1">
                  <Button className="h-8 text-sm" onClick={saveProfile}>
                    Save profile
                  </Button>
                </div>
              </div>
            </SettingsCard>
          )}

          {/* Company */}
          {activeSection === "company" && (
            <SettingsCard
              title="Company details"
              description="Corporate registration information for Luxembourg compliance."
            >
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FieldGroup label="Company name" className="col-span-2">
                    <Input
                      value={company.name}
                      onChange={(e) => setCompany((c) => ({ ...c, name: e.target.value }))}
                      className="h-8 text-sm"
                    />
                  </FieldGroup>
                  <FieldGroup label="RCS number">
                    <Input
                      value={company.rcs}
                      onChange={(e) => setCompany((c) => ({ ...c, rcs: e.target.value }))}
                      className="h-8 text-sm font-mono"
                    />
                  </FieldGroup>
                  <FieldGroup label="VAT number">
                    <Input
                      value={company.vat}
                      onChange={(e) => setCompany((c) => ({ ...c, vat: e.target.value }))}
                      className="h-8 text-sm font-mono"
                    />
                  </FieldGroup>
                  <FieldGroup label="Registered address" className="col-span-2">
                    <Input
                      value={company.address}
                      onChange={(e) => setCompany((c) => ({ ...c, address: e.target.value }))}
                      className="h-8 text-sm"
                    />
                  </FieldGroup>
                  <FieldGroup label="Financial year end">
                    <Input
                      value={company.fyEnd}
                      onChange={(e) => setCompany((c) => ({ ...c, fyEnd: e.target.value }))}
                      className="h-8 text-sm"
                    />
                  </FieldGroup>
                </div>

                <div className="p-3 bg-muted/60 border border-border rounded text-xs text-muted-foreground leading-relaxed">
                  These details are used to pre-fill obligation metadata and filings. Changes do not affect any regulatory registrations.
                </div>

                <div className="flex justify-end">
                  <Button className="h-8 text-sm" onClick={saveCompany}>
                    Save company details
                  </Button>
                </div>
              </div>
            </SettingsCard>
          )}

          {/* Notifications */}
          {activeSection === "notifications" && (
            <SettingsCard
              title="Notifications"
              description="Choose which events trigger alerts and where you receive them."
            >
              <div className="space-y-5">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                    Alert types
                  </p>
                  <div className="divide-y divide-border border border-border rounded overflow-hidden">
                    {[
                      {
                        key: "deadlineAlerts" as const,
                        label: "Upcoming deadline alerts",
                        desc: "Receive reminders 30, 14, and 7 days before a due date",
                      },
                      {
                        key: "statusChanges" as const,
                        label: "Status changes",
                        desc: "Notified when an obligation status is updated",
                      },
                      {
                        key: "taskAssignments" as const,
                        label: "Task assignments",
                        desc: "Notified when a task is assigned to you",
                      },
                      {
                        key: "weeklyDigest" as const,
                        label: "Weekly digest",
                        desc: "Summary of open obligations sent every Monday",
                      },
                    ].map(({ key, label, desc }) => (
                      <div key={key} className="flex items-center justify-between px-4 py-3 bg-card">
                        <div>
                          <p className="text-sm font-medium text-foreground">{label}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                        </div>
                        <Switch
                          checked={notifs[key]}
                          onCheckedChange={(v) => setNotifs((n) => ({ ...n, [key]: v }))}
                          aria-label={label}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                    Channels
                  </p>
                  <div className="divide-y divide-border border border-border rounded overflow-hidden">
                    {[
                      {
                        key: "email" as const,
                        label: "Email notifications",
                        desc: "Send alerts to marie.k@abcconsulting.lu",
                      },
                      {
                        key: "inApp" as const,
                        label: "In-app notifications",
                        desc: "Show badge and notification tray in the app",
                      },
                    ].map(({ key, label, desc }) => (
                      <div key={key} className="flex items-center justify-between px-4 py-3 bg-card">
                        <div>
                          <p className="text-sm font-medium text-foreground">{label}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                        </div>
                        <Switch
                          checked={notifs[key]}
                          onCheckedChange={(v) => setNotifs((n) => ({ ...n, [key]: v }))}
                          aria-label={label}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button className="h-8 text-sm" onClick={() => toast.success("Notification preferences saved (demo)")}>
                    Save preferences
                  </Button>
                </div>
              </div>
            </SettingsCard>
          )}

          {/* Team */}
          {activeSection === "team" && (
            <SettingsCard
              title="Team members"
              description="Manage who has access to this company's compliance workspace."
            >
              <div className="space-y-4">
                <div className="border border-border rounded overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">
                          Name
                        </th>
                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">
                          Role
                        </th>
                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">
                          Status
                        </th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: "Marie K.", role: "CFO", status: "Active", you: true },
                        { name: "Luca P.", role: "Finance Manager", status: "Active", you: false },
                        { name: "Emma S.", role: "Legal & Compliance", status: "Active", you: false },
                      ].map((member) => (
                        <tr
                          key={member.name}
                          className="border-b border-border last:border-0"
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2.5">
                              <div className="size-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[11px] font-semibold select-none">
                                {member.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </div>
                              <span className="font-medium text-foreground">{member.name}</span>
                              {member.you && (
                                <span className="text-[10px] text-muted-foreground bg-muted border border-border px-1.5 py-0.5 rounded">
                                  You
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-xs text-muted-foreground">
                            {member.role}
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center gap-1 text-xs">
                              <span className="size-1.5 rounded-full bg-emerald-500" aria-hidden />
                              {member.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-xs text-muted-foreground"
                              disabled={member.you}
                              onClick={() => toast.info("Manage member (demo)")}
                            >
                              Manage
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    className="h-8 text-sm"
                    onClick={() => toast.info("Invite team member (demo)")}
                  >
                    + Invite team member
                  </Button>
                </div>
              </div>
            </SettingsCard>
          )}

          {/* Security */}
          {activeSection === "security" && (
            <SettingsCard
              title="Security"
              description="Manage password, two-factor authentication, and active sessions."
            >
              <div className="space-y-4">
                <div className="divide-y divide-border border border-border rounded overflow-hidden">
                  {[
                    {
                      label: "Change password",
                      desc: "Last changed 3 months ago",
                      action: "Update",
                    },
                    {
                      label: "Two-factor authentication",
                      desc: "Add an extra layer of security to your account",
                      action: "Enable",
                    },
                    {
                      label: "Active sessions",
                      desc: "1 session active — Luxembourg, LU",
                      action: "View all",
                    },
                  ].map(({ label, desc, action }) => (
                    <div
                      key={label}
                      className="flex items-center justify-between px-4 py-3.5 bg-card"
                    >
                      <div>
                        <p className="text-sm font-medium text-foreground">{label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => toast.info(`${action} (demo)`)}
                      >
                        {action}
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="p-3 border border-destructive/30 bg-destructive/5 rounded">
                  <p className="text-xs font-semibold text-destructive mb-0.5">Danger zone</p>
                  <p className="text-xs text-muted-foreground mb-2">
                    Deleting your account is permanent and cannot be undone. All data will be lost.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs text-destructive border-destructive/40 hover:bg-destructive/10"
                    onClick={() => toast.error("Account deletion (demo — no action taken)")}
                  >
                    Delete account
                  </Button>
                </div>
              </div>
            </SettingsCard>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function SettingsCard({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div className="border border-border rounded bg-card overflow-hidden">
      <div className="px-6 py-4 border-b border-border bg-muted/30">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  )
}

function FieldGroup({
  label,
  children,
  className,
}: {
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  )
}
