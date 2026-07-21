"use client";

import { useMemo, useRef, useState } from "react";
import {
  FileText,
  Upload,
  Download,
  Trash2,
  Eye,
  MoreVertical,
  Share2,
  FolderOpen,
  HardDrive,
  Layers,
  UploadCloud,
} from "lucide-react";
import { StatCard, PageHeader } from "@/components/ui/stat-card";
import { Card, Badge, Button } from "@/components/ui/primitives";
import { SearchInput, FilterChips, EmptyState } from "@/components/ui/misc";
import { Modal, ConfirmDialog } from "@/components/ui/modal";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { useToast } from "@/components/ui/toast";
import { documents, properties, type DocItem } from "@/lib/data";
import { colorFromString } from "@/lib/utils";

type DocFilter = "All" | "Property" | "Tenant" | "Other";
type SortKey = "newest" | "oldest" | "name";

const FILTERS: { value: DocFilter; label: string }[] = [
  { value: "All", label: "All" },
  { value: "Property", label: "Property" },
  { value: "Tenant", label: "Tenant" },
  { value: "Other", label: "Other" },
];

const FILTER_TYPES: Record<DocFilter, string[] | null> = {
  All: null,
  Property: ["Mortgage", "Leases"],
  Tenant: ["Leases"],
  Other: ["Other", "Insurance", "Inspections"],
};

const DOC_TYPES = [
  "Property Document",
  "Tenant Document",
  "Leases",
  "Inspection Report",
  "Insurance Policy",
  "Mortgage Doc",
  "Other",
];

// Map a form doc-type label to the stored short type used across the app.
function normalizeType(label: string): string {
  switch (label) {
    case "Mortgage Doc":
      return "Mortgage";
    case "Insurance Policy":
      return "Insurance";
    case "Inspection Report":
      return "Inspections";
    case "Leases":
      return "Leases";
    case "Property Document":
    case "Tenant Document":
    case "Other":
    default:
      return "Other";
  }
}

// Parse "3.2 MB" / "812 KB" into KB for sizing math.
function sizeToKb(size: string): number {
  const [rawNum, unit] = size.split(" ");
  const n = parseFloat(rawNum) || 0;
  return unit === "MB" ? n * 1024 : n;
}

function totalStorageLabel(docs: DocItem[]): string {
  const totalKb = docs.reduce((s, d) => s + sizeToKb(d.size), 0);
  if (totalKb >= 1024) return `${(totalKb / 1024).toFixed(1)} MB`;
  return `${Math.round(totalKb)} KB`;
}

// Approximate a numeric order for the mock date strings (also handles "Just now").
function dateRank(date: string): number {
  if (date === "Just now") return Number.MAX_SAFE_INTEGER;
  const parsed = Date.parse(date);
  return Number.isNaN(parsed) ? 0 : parsed;
}

export default function DocumentsPage() {
  const toast = useToast();
  const [docs, setDocs] = useState<DocItem[]>(() => [...documents]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<DocFilter>("All");
  const [sort, setSort] = useState<SortKey>("newest");

  const [uploadOpen, setUploadOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<DocItem | null>(null);
  const [deleteDoc, setDeleteDoc] = useState<DocItem | null>(null);
  const [menuId, setMenuId] = useState<string | null>(null);

  // Upload form state
  const [fName, setFName] = useState("");
  const [fProperty, setFProperty] = useState("");
  const [fType, setFType] = useState(DOC_TYPES[0]);
  const [fFile, setFFile] = useState("");
  const [fNotes, setFNotes] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const allowed = FILTER_TYPES[filter];
    const q = query.trim().toLowerCase();
    const list = docs.filter((d) => {
      if (allowed && !allowed.includes(d.type)) return false;
      if (!q) return true;
      return (
        d.name.toLowerCase().includes(q) || d.type.toLowerCase().includes(q)
      );
    });
    const sorted = [...list];
    if (sort === "name") sorted.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === "oldest")
      sorted.sort((a, b) => dateRank(a.date) - dateRank(b.date));
    else sorted.sort((a, b) => dateRank(b.date) - dateRank(a.date));
    return sorted;
  }, [docs, filter, query, sort]);

  const sharedCount = docs.filter((d) => d.shared).length;
  const categoryCount = new Set(docs.map((d) => d.type)).size;

  function resetForm() {
    setFName("");
    setFProperty("");
    setFType(DOC_TYPES[0]);
    setFFile("");
    setFNotes("");
  }

  function handleUpload() {
    if (!fName.trim()) {
      toast("Please enter a document name", "warning");
      return;
    }
    const sizes = ["512 KB", "780 KB", "1.1 MB", "1.6 MB", "2.3 MB", "3.4 MB"];
    const newDoc: DocItem = {
      id: `doc_${Date.now()}`,
      name: fName.trim(),
      type: normalizeType(fType),
      size: sizes[Math.floor(Math.random() * sizes.length)],
      date: "Just now",
      landlord: "Platform",
      property: fProperty || undefined,
      shared: normalizeType(fType) === "Leases",
    };
    setDocs((d) => [newDoc, ...d]);
    setUploadOpen(false);
    resetForm();
    toast("Document uploaded successfully");
  }

  function handleDownload(doc: DocItem) {
    setMenuId(null);
    toast(`Downloading "${doc.name}"…`, "info");
  }

  function confirmDelete() {
    if (!deleteDoc) return;
    setDocs((d) => d.filter((x) => x.id !== deleteDoc.id));
    toast("Document deleted", "success");
  }

  return (
    <div className="animate-in">
      <PageHeader
        title="Documents"
        subtitle="All your important documents in one place"
        actions={
          <Button onClick={() => setUploadOpen(true)}>
            <Upload className="h-4 w-4" />
            Upload Document
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard label="Total Documents" value={String(docs.length)} icon={FileText} accent="#007aff" />
        <StatCard label="Shared" value={String(sharedCount)} sub="with tenants" icon={Share2} accent="#10b981" />
        <StatCard label="Storage Used" value={totalStorageLabel(docs)} icon={HardDrive} accent="#7c3aed" />
        <StatCard label="Categories" value={String(categoryCount)} icon={Layers} accent="#f59e0b" />
      </div>

      {/* Toolbar */}
      <div className="mt-6 flex flex-col gap-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Search by name or type…"
            className="flex-1"
          />
          <Select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="sm:w-44"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name">Name A–Z</option>
          </Select>
        </div>
        <FilterChips chips={FILTERS} value={filter} onChange={setFilter} />
      </div>

      {/* Documents grid */}
      {filtered.length === 0 ? (
        <Card className="mt-6">
          <EmptyState
            icon={FolderOpen}
            title="No documents found"
            message="Try adjusting your search or filters, or upload a new document."
            action={
              <Button variant="outline" onClick={() => setUploadOpen(true)}>
                <Upload className="h-4 w-4" />
                Upload Document
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((doc) => {
            const accent = colorFromString(doc.type);
            return (
              <Card key={doc.id} className="group relative flex flex-col p-5">
                <div className="flex items-start justify-between gap-3">
                  <span
                    className="flex h-12 w-12 items-center justify-center rounded-xl"
                    style={{ background: `${accent}1a`, color: accent }}
                  >
                    <FileText className="h-6 w-6" />
                  </span>
                  <div className="relative">
                    <button
                      onClick={() => setMenuId(menuId === doc.id ? null : doc.id)}
                      className="rounded-lg p-1.5 text-text-faint transition hover:bg-surface-2 hover:text-text"
                      aria-label="Options"
                    >
                      <MoreVertical className="h-5 w-5" />
                    </button>
                    {menuId === doc.id && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setMenuId(null)}
                        />
                        <div className="animate-in absolute right-0 top-9 z-20 w-40 overflow-hidden rounded-xl border border-border bg-surface py-1 shadow-float">
                          <button
                            onClick={() => handleDownload(doc)}
                            className="flex w-full items-center gap-2 px-3 py-2 text-sm font-medium hover:bg-surface-2"
                          >
                            <Download className="h-4 w-4 text-text-muted" />
                            Download
                          </button>
                          <button
                            onClick={() => {
                              setMenuId(null);
                              setDeleteDoc(doc);
                            }}
                            className="flex w-full items-center gap-2 px-3 py-2 text-sm font-medium text-danger hover:bg-danger/10"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <h3 className="mt-4 line-clamp-2 text-[15px] font-bold leading-snug">
                  {doc.name}
                </h3>

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <Badge tone="neutral">{doc.type}</Badge>
                  {doc.shared && (
                    <Badge tone="success">
                      <Share2 className="h-3 w-3" />
                      Shared with Tenant
                    </Badge>
                  )}
                </div>

                {doc.property && (
                  <p className="mt-2 flex items-center gap-1.5 text-sm text-text-muted">
                    <FolderOpen className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{doc.property}</span>
                  </p>
                )}

                <p className="mt-3 text-xs text-text-faint">
                  {doc.type} · {doc.size} · Uploaded on {doc.date}
                </p>

                <div className="mt-4 flex items-center gap-2 border-t border-border pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => setPreviewDoc(doc)}
                  >
                    <Eye className="h-4 w-4" />
                    Preview
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleDownload(doc)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Upload modal */}
      <Modal
        open={uploadOpen}
        onClose={() => {
          setUploadOpen(false);
          resetForm();
        }}
        title="Upload Document"
        subtitle="Add a new document to your library"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setUploadOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleUpload}>Save Document</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Document Name">
            <Input
              value={fName}
              onChange={(e) => setFName(e.target.value)}
              placeholder="e.g. Lease Agreement - Unit 2"
            />
          </Field>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Property">
              <Select value={fProperty} onChange={(e) => setFProperty(e.target.value)}>
                <option value="">No property</option>
                {properties.map((p) => (
                  <option key={p.id} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Type">
              <Select value={fType} onChange={(e) => setFType(e.target.value)}>
                {DOC_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
          <Field label="File">
            <button
              type="button"
              onClick={() => {
                const names = [
                  "agreement.pdf",
                  "policy_2026.pdf",
                  "report_q2.docx",
                  "certificate.png",
                  "statement.pdf",
                ];
                setFFile(names[Math.floor(Math.random() * names.length)]);
              }}
              className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border-strong bg-surface-2 px-4 py-8 text-center transition hover:border-primary hover:bg-primary/5"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <UploadCloud className="h-6 w-6" />
              </span>
              {fFile ? (
                <span className="text-sm font-semibold text-text">{fFile}</span>
              ) : (
                <>
                  <span className="text-sm font-semibold">Click to choose a file</span>
                  <span className="text-xs text-text-faint">PDF, DOC, DOCX, JPG or PNG</span>
                </>
              )}
            </button>
            {/* hidden real input kept for completeness; not required for the mock */}
            <input ref={fileInputRef} type="file" className="hidden" />
          </Field>
          <Field label="Notes">
            <Textarea
              value={fNotes}
              onChange={(e) => setFNotes(e.target.value)}
              placeholder="Add any notes about this document…"
            />
          </Field>
        </div>
      </Modal>

      {/* Preview modal */}
      <Modal
        open={!!previewDoc}
        onClose={() => setPreviewDoc(null)}
        title={previewDoc?.name}
        subtitle={previewDoc ? `${previewDoc.type} · ${previewDoc.size}` : undefined}
        footer={
          previewDoc && (
            <>
              <Button
                variant="secondary"
                onClick={() => toast("Share link copied", "info")}
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
              <Button onClick={() => handleDownload(previewDoc)}>
                <Download className="h-4 w-4" />
                Download
              </Button>
            </>
          )
        }
      >
        {previewDoc && (
          <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-border bg-surface-2 px-6 py-12 text-center">
            <span className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <FileText className="h-10 w-10" />
            </span>
            <div>
              <p className="text-base font-bold">{previewDoc.name}</p>
              <p className="mt-1 text-sm text-text-muted">
                {previewDoc.property ?? "No property"} · Uploaded on {previewDoc.date}
              </p>
            </div>
            <p className="max-w-sm text-xs text-text-faint">
              Preview is not available in this demo. Use Download to save a copy.
            </p>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleteDoc}
        onClose={() => setDeleteDoc(null)}
        onConfirm={confirmDelete}
        title="Delete Document"
        message={`Are you sure you want to delete "${deleteDoc?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        danger
      />
    </div>
  );
}
