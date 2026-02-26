export type ObligationStatus = "Completed" | "In Progress" | "At Risk" | "Not Started"
export type Authority = "RCS" | "AED" | "ACD" | "RBE" | "Other"
export type DocCategory = "Corporate" | "Tax" | "Accounting" | "UBO"
export type KBCategory = "Corporate" | "Tax" | "VAT" | "UBO" | "Accounting"

export interface ChecklistItem {
  id: string
  label: string
  completed: boolean
}

export interface Task {
  id: string
  title: string
  assignee: string
  dueDate: string
  status: "Pending" | "In Progress" | "Done"
}

export interface Document {
  id: string
  name: string
  category: DocCategory
  linkedObligation: string | null
  lastUpdated: string
  owner: string
  tags: string[]
  size: string
}

export interface Note {
  id: string
  text: string
  author: string
  date: string
}

export interface ActivityItem {
  id: string
  text: string
  date: string
  actor: string
}

export interface Obligation {
  id: string
  name: string
  dueDate: string | null
  status: ObligationStatus
  owner: string
  authority: Authority
  frequency: string
  category: string
  description: string
  evidenceRequired: string
  atRiskReason?: string
  checklist: ChecklistItem[]
  tasks: Task[]
  documents: Document[]
  notes: Note[]
  activity: ActivityItem[]
}

export interface KBArticle {
  id: string
  title: string
  category: KBCategory
  lastReviewed: string
  summary: string
  content: string[]
  relatedObligations: string[]
  templates: string[]
}

export const OBLIGATIONS: Obligation[] = [
  {
    id: "annual-accounts",
    name: "Annual Accounts Filing",
    dueDate: "2026-06-30",
    status: "At Risk",
    owner: "Marie K.",
    authority: "RCS",
    frequency: "Annual",
    category: "Corporate",
    description:
      "Annual accounts must be filed with the Luxembourg Register of Commerce and Companies (RCS) within seven months of the end of the financial year. This obligation applies to all S.à r.l. and S.A. entities incorporated in Luxembourg.",
    evidenceRequired: "Filing confirmation receipt",
    atRiskReason: "Draft accounts pending management approval. Deadline is in 4 months with outstanding sign-offs.",
    checklist: [
      { id: "c1", label: "Prepare financial statements", completed: true },
      { id: "c2", label: "Management approval", completed: false },
      { id: "c3", label: "File with RCS portal", completed: false },
      { id: "c4", label: "Archive confirmation receipt", completed: false },
    ],
    tasks: [
      { id: "t1", title: "Finalise balance sheet", assignee: "Luca P.", dueDate: "2026-06-01", status: "In Progress" },
      { id: "t2", title: "Board sign-off meeting", assignee: "Marie K.", dueDate: "2026-06-10", status: "Pending" },
      { id: "t3", title: "Submit to RCS portal", assignee: "Emma S.", dueDate: "2026-06-25", status: "Pending" },
    ],
    documents: [
      {
        id: "d-aa1",
        name: "2025 Draft Accounts.pdf",
        category: "Accounting",
        linkedObligation: "Annual Accounts Filing",
        lastUpdated: "2026-02-12",
        owner: "Luca P.",
        tags: ["draft", "accounts"],
        size: "2.4 MB",
      },
      {
        id: "d-aa2",
        name: "Filing Confirmation 2024.pdf",
        category: "Corporate",
        linkedObligation: "Annual Accounts Filing",
        lastUpdated: "2026-01-03",
        owner: "Emma S.",
        tags: ["confirmation", "RCS"],
        size: "0.8 MB",
      },
    ],
    notes: [
      { id: "n1", text: "Awaiting management approval before filing.", author: "Marie K.", date: "2026-02-20" },
    ],
    activity: [
      { id: "a1", text: "Status changed to At Risk", date: "2026-02-15", actor: "System" },
      { id: "a2", text: "Document attached: 2025 Draft Accounts.pdf", date: "2026-02-12", actor: "Luca P." },
      { id: "a3", text: "Note added by Marie K.", date: "2026-02-20", actor: "Marie K." },
    ],
  },
  {
    id: "vat-q1",
    name: "VAT Return Q1",
    dueDate: "2026-04-15",
    status: "In Progress",
    owner: "Luca P.",
    authority: "AED",
    frequency: "Quarterly",
    category: "Tax",
    description:
      "Quarterly VAT return to be submitted to the Administration de l'Enregistrement, des Domaines et de la TVA (AED). The return covers output and input VAT for the period January–March 2026.",
    evidenceRequired: "Submitted VAT declaration and payment confirmation",
    checklist: [
      { id: "c1", label: "Reconcile VAT ledger", completed: true },
      { id: "c2", label: "Prepare VAT return form", completed: true },
      { id: "c3", label: "Review and approve with CFO", completed: false },
      { id: "c4", label: "Submit via MyGuichet", completed: false },
    ],
    tasks: [
      { id: "t1", title: "Reconcile Q1 transactions", assignee: "Luca P.", dueDate: "2026-04-05", status: "Done" },
      { id: "t2", title: "CFO review", assignee: "Marie K.", dueDate: "2026-04-10", status: "Pending" },
    ],
    documents: [
      {
        id: "d-vat1",
        name: "VAT Workings Q1 2026.xlsx",
        category: "Tax",
        linkedObligation: "VAT Return Q1",
        lastUpdated: "2026-02-18",
        owner: "Luca P.",
        tags: ["VAT", "workings"],
        size: "1.1 MB",
      },
    ],
    notes: [],
    activity: [
      { id: "a1", text: "Status changed to In Progress", date: "2026-02-01", actor: "Luca P." },
    ],
  },
  {
    id: "ubo-register",
    name: "UBO Register Update",
    dueDate: null,
    status: "Completed",
    owner: "Emma S.",
    authority: "RBE",
    frequency: "Event-based",
    category: "UBO",
    description:
      "The Ultimate Beneficial Owner (UBO) register must be updated within one month of any change to the company's beneficial ownership structure. This obligation is event-driven rather than calendar-based.",
    evidenceRequired: "RBE filing confirmation",
    checklist: [
      { id: "c1", label: "Identify ownership change", completed: true },
      { id: "c2", label: "Prepare updated UBO data", completed: true },
      { id: "c3", label: "File with RBE", completed: true },
      { id: "c4", label: "Archive confirmation", completed: true },
    ],
    tasks: [],
    documents: [
      {
        id: "d-ubo1",
        name: "RBE Filing Confirmation.pdf",
        category: "Corporate",
        linkedObligation: "UBO Register Update",
        lastUpdated: "2026-01-14",
        owner: "Emma S.",
        tags: ["UBO", "RBE"],
        size: "0.3 MB",
      },
    ],
    notes: [{ id: "n1", text: "Completed following shareholder change in December 2025.", author: "Emma S.", date: "2026-01-15" }],
    activity: [
      { id: "a1", text: "Status changed to Completed", date: "2026-01-15", actor: "Emma S." },
    ],
  },
  {
    id: "corporate-tax",
    name: "Corporate Tax Return",
    dueDate: "2026-05-31",
    status: "Not Started",
    owner: "Marie K.",
    authority: "ACD",
    frequency: "Annual",
    category: "Tax",
    description:
      "Annual corporate income tax return (IRC) to be filed with the Administration des Contributions Directes (ACD). Covers the fiscal year ended 31 December 2025.",
    evidenceRequired: "Filed return acknowledgement",
    checklist: [
      { id: "c1", label: "Compile tax pack", completed: false },
      { id: "c2", label: "Reconcile to annual accounts", completed: false },
      { id: "c3", label: "External advisor review", completed: false },
      { id: "c4", label: "Submit to ACD", completed: false },
    ],
    tasks: [
      { id: "t1", title: "Engage tax advisor", assignee: "Marie K.", dueDate: "2026-03-15", status: "Pending" },
    ],
    documents: [],
    notes: [],
    activity: [],
  },
  {
    id: "rcs-update",
    name: "RCS Update (Company Changes)",
    dueDate: "2026-03-10",
    status: "At Risk",
    owner: "Emma S.",
    authority: "RCS",
    frequency: "Event-based",
    category: "Corporate",
    description:
      "Following the appointment of a new manager in February 2026, the RCS record must be updated within one month. Failure to update may result in administrative penalties.",
    evidenceRequired: "RCS update confirmation",
    atRiskReason: "Deadline within 14 days and required notarial deed not yet received.",
    checklist: [
      { id: "c1", label: "Obtain notarial deed", completed: false },
      { id: "c2", label: "Prepare RCS update form", completed: false },
      { id: "c3", label: "Submit to RCS", completed: false },
    ],
    tasks: [
      { id: "t1", title: "Follow up with notary", assignee: "Emma S.", dueDate: "2026-03-01", status: "In Progress" },
    ],
    documents: [],
    notes: [],
    activity: [
      { id: "a1", text: "Status changed to At Risk", date: "2026-02-22", actor: "System" },
    ],
  },
  {
    id: "vat-q4",
    name: "VAT Return Q4 2025",
    dueDate: "2026-01-20",
    status: "Completed",
    owner: "Luca P.",
    authority: "AED",
    frequency: "Quarterly",
    category: "Tax",
    description: "Quarterly VAT return for October–December 2025. Filed and confirmed.",
    evidenceRequired: "Submitted VAT declaration",
    checklist: [
      { id: "c1", label: "Reconcile VAT ledger", completed: true },
      { id: "c2", label: "Submit via MyGuichet", completed: true },
    ],
    tasks: [],
    documents: [],
    notes: [],
    activity: [{ id: "a1", text: "Status changed to Completed", date: "2026-01-18", actor: "Luca P." }],
  },
  {
    id: "payroll-dec",
    name: "Payroll Declaration Dec 2025",
    dueDate: "2026-01-15",
    status: "Completed",
    owner: "Emma S.",
    authority: "ACD",
    frequency: "Monthly",
    category: "Accounting",
    description: "Monthly payroll withholding tax declaration for December 2025.",
    evidenceRequired: "Declaration receipt",
    checklist: [
      { id: "c1", label: "Run payroll", completed: true },
      { id: "c2", label: "Submit declaration", completed: true },
    ],
    tasks: [],
    documents: [],
    notes: [],
    activity: [],
  },
  {
    id: "trade-license",
    name: "Trade License Renewal",
    dueDate: "2026-07-01",
    status: "Not Started",
    owner: "Marie K.",
    authority: "RCS",
    frequency: "Annual",
    category: "Corporate",
    description: "Annual renewal of the business operating license issued by the Ministry of the Middle Classes.",
    evidenceRequired: "Renewed license certificate",
    checklist: [
      { id: "c1", label: "Review license conditions", completed: false },
      { id: "c2", label: "Prepare renewal application", completed: false },
      { id: "c3", label: "Submit application", completed: false },
    ],
    tasks: [],
    documents: [],
    notes: [],
    activity: [],
  },
  {
    id: "intrastat",
    name: "Intrastat Declaration Q1",
    dueDate: "2026-04-20",
    status: "Not Started",
    owner: "Luca P.",
    authority: "AED",
    frequency: "Quarterly",
    category: "Tax",
    description: "Quarterly Intrastat statistical declaration for intra-EU trade flows.",
    evidenceRequired: "Submitted declaration",
    checklist: [
      { id: "c1", label: "Compile trade data", completed: false },
      { id: "c2", label: "Submit declaration", completed: false },
    ],
    tasks: [],
    documents: [],
    notes: [],
    activity: [],
  },
  {
    id: "social-security",
    name: "Social Security Annual Filing",
    dueDate: "2026-03-31",
    status: "In Progress",
    owner: "Emma S.",
    authority: "ACD",
    frequency: "Annual",
    category: "Accounting",
    description: "Annual social security declaration submitted to the CCSS covering all employees.",
    evidenceRequired: "Filed declaration confirmation",
    checklist: [
      { id: "c1", label: "Compile employee data", completed: true },
      { id: "c2", label: "Review with HR", completed: false },
      { id: "c3", label: "Submit to CCSS", completed: false },
    ],
    tasks: [
      { id: "t1", title: "HR data reconciliation", assignee: "Emma S.", dueDate: "2026-03-10", status: "In Progress" },
    ],
    documents: [],
    notes: [],
    activity: [],
  },
  {
    id: "data-protection",
    name: "Data Protection Register",
    dueDate: "2026-05-01",
    status: "Not Started",
    owner: "Marie K.",
    authority: "Other",
    frequency: "Annual",
    category: "Corporate",
    description: "Annual review and update of the internal data processing register as required under GDPR/CNPD guidance.",
    evidenceRequired: "Updated register",
    checklist: [
      { id: "c1", label: "Review current register", completed: false },
      { id: "c2", label: "Update processing activities", completed: false },
      { id: "c3", label: "DPO sign-off", completed: false },
    ],
    tasks: [],
    documents: [],
    notes: [],
    activity: [],
  },
  {
    id: "transfer-pricing",
    name: "Transfer Pricing Documentation",
    dueDate: "2026-06-30",
    status: "In Progress",
    owner: "Luca P.",
    authority: "ACD",
    frequency: "Annual",
    category: "Tax",
    description: "Annual transfer pricing documentation file to be maintained in support of intercompany transactions.",
    evidenceRequired: "TP documentation file",
    checklist: [
      { id: "c1", label: "Identify intercompany transactions", completed: true },
      { id: "c2", label: "Prepare benchmarking analysis", completed: false },
      { id: "c3", label: "Finalise TP documentation", completed: false },
    ],
    tasks: [
      { id: "t1", title: "Engage TP specialist", assignee: "Luca P.", dueDate: "2026-04-01", status: "Pending" },
    ],
    documents: [],
    notes: [],
    activity: [],
  },
]

export const ALL_DOCUMENTS: Document[] = [
  {
    id: "d-aa1",
    name: "2025 Draft Accounts.pdf",
    category: "Accounting",
    linkedObligation: "Annual Accounts Filing",
    lastUpdated: "2026-02-12",
    owner: "Luca P.",
    tags: ["draft", "accounts"],
    size: "2.4 MB",
  },
  {
    id: "d-aa2",
    name: "Filing Confirmation 2024.pdf",
    category: "Corporate",
    linkedObligation: "Annual Accounts Filing",
    lastUpdated: "2026-01-03",
    owner: "Emma S.",
    tags: ["confirmation", "RCS"],
    size: "0.8 MB",
  },
  {
    id: "d-vat1",
    name: "VAT Workings Q1 2026.xlsx",
    category: "Tax",
    linkedObligation: "VAT Return Q1",
    lastUpdated: "2026-02-18",
    owner: "Luca P.",
    tags: ["VAT", "workings"],
    size: "1.1 MB",
  },
  {
    id: "d-ubo1",
    name: "RBE Filing Confirmation.pdf",
    category: "UBO",
    linkedObligation: "UBO Register Update",
    lastUpdated: "2026-01-14",
    owner: "Emma S.",
    tags: ["UBO", "RBE"],
    size: "0.3 MB",
  },
  {
    id: "d-corp1",
    name: "Certificate of Incorporation.pdf",
    category: "Corporate",
    linkedObligation: null,
    lastUpdated: "2024-06-01",
    owner: "Marie K.",
    tags: ["incorporation", "RCS"],
    size: "1.2 MB",
  },
  {
    id: "d-tax1",
    name: "Corporate Tax 2024 — ACD Receipt.pdf",
    category: "Tax",
    linkedObligation: "Corporate Tax Return",
    lastUpdated: "2025-06-02",
    owner: "Marie K.",
    tags: ["tax", "ACD"],
    size: "0.5 MB",
  },
  {
    id: "d-acc1",
    name: "Annual Accounts Checklist Template.docx",
    category: "Accounting",
    linkedObligation: "Annual Accounts Filing",
    lastUpdated: "2026-02-01",
    owner: "Luca P.",
    tags: ["template", "checklist"],
    size: "0.1 MB",
  },
]

export const KB_ARTICLES: KBArticle[] = [
  {
    id: "ubo-basics",
    title: "UBO Reporting Basics",
    category: "UBO",
    lastReviewed: "2026-02-10",
    summary:
      "An overview of Luxembourg UBO register obligations, who qualifies as a beneficial owner, and how to file updates.",
    content: [
      "Under the Law of 13 January 2019, all Luxembourg entities (S.à r.l., S.A., etc.) must register their Ultimate Beneficial Owners (UBOs) with the Registre des Bénéficiaires Effectifs (RBE).",
      "A UBO is defined as any natural person who ultimately owns or controls more than 25% of an entity's shares or voting rights, or who otherwise exercises control through other means.",
      "Registrations and updates must be filed within one month of any change. Failure to comply may result in administrative fines of up to EUR 1.25 million.",
      "Updates are submitted electronically via the MyGuichet.lu portal using a LuxTrust or eID credential. The filing must include personal details, nationality, country of residence, and the nature and extent of the beneficial interest held.",
    ],
    relatedObligations: ["ubo-register"],
    templates: ["UBO Update Form Template"],
  },
  {
    id: "annual-accounts-checklist",
    title: "Annual Accounts Filing Checklist",
    category: "Corporate",
    lastReviewed: "2026-01-20",
    summary:
      "Step-by-step guidance on preparing and filing annual accounts with the RCS, including key deadlines and required documents.",
    content: [
      "Luxembourg companies must file approved annual accounts with the RCS within seven months of the financial year-end. For a 31 December year-end, the deadline is 30 June.",
      "The filing package typically includes the balance sheet, profit and loss account, notes to the accounts, and the management report (for qualifying entities).",
      "Prior to filing, accounts must be approved by the shareholders or, in the case of an S.A., by the board of directors and then presented to the annual general meeting.",
      "Filing is performed electronically through the RCS portal (guichet.lu) and requires a valid electronic certificate. A filing fee applies depending on the entity type.",
    ],
    relatedObligations: ["annual-accounts"],
    templates: ["Annual Accounts Checklist Template", "RCS Filing Cover Sheet"],
  },
  {
    id: "vat-quarterly",
    title: "VAT Returns: Quarterly Overview",
    category: "VAT",
    lastReviewed: "2026-02-05",
    summary: "Practical guidance on preparing and submitting quarterly VAT returns to the AED.",
    content: [
      "Businesses registered for VAT in Luxembourg with annual turnover exceeding EUR 112,000 must submit quarterly VAT returns to the Administration de l'Enregistrement, des Domaines et de la TVA (AED).",
      "Returns are due by the 15th of the second month following the end of the quarter (e.g., Q1 return: due 15 April). The return must cover all taxable supplies and acquisitions during the period.",
      "Output VAT must be declared on all taxable sales at the applicable Luxembourg rates (standard: 17%, intermediate: 14%, reduced: 8%, super-reduced: 3%).",
      "Input VAT recovery is available for business-related purchases, subject to pro-rata rules where the entity makes both taxable and exempt supplies. Supporting invoices must be retained for 10 years.",
    ],
    relatedObligations: ["vat-q1", "vat-q4"],
    templates: ["VAT Reconciliation Template"],
  },
]

export const USERS = ["Marie K.", "Luca P.", "Emma S."]
export const AUTHORITIES: Authority[] = ["RCS", "AED", "ACD", "RBE", "Other"]
