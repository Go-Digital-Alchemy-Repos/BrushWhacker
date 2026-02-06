import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BookOpen, Loader2, ChevronRight, ChevronDown, Search, Tag, Plus,
  Pencil, Trash2, ArrowLeft, Eye, ShieldCheck, AlertTriangle, CheckCircle2,
  X, Clock, User
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/admin-layout";

const DOC_CATEGORIES = [
  "Getting Started", "APIs", "Architecture", "CMS", "CRM", "Database",
  "Deployment", "Integrations", "Media", "Performance", "Routing",
  "Security", "SEO", "Theming",
];

const REQUIRED_SECTIONS = [
  "Overview", "Architecture", "Database", "APIs",
  "Frontend Integration", "Security Considerations", "Related Docs",
];

interface DocsEntryFull {
  id: string;
  category: string;
  title: string;
  slug: string;
  bodyMarkdown: string;
  tags: string[];
  related: string[];
  version: string;
  author: string;
  createdAt: string;
  updatedAt: string;
}

interface DocsResponse {
  categories: string[];
  entries: DocsEntryFull[];
}

interface ValidationReport {
  total: number;
  issueCount: number;
  issues: { id: string; title: string; problems: string[] }[];
}

function slugify(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function renderMarkdown(md: string) {
  const lines = md.split("\n");
  const elements: JSX.Element[] = [];
  let inCodeBlock = false;
  let codeLines: string[] = [];
  let inTable = false;
  let tableRows: string[][] = [];

  const flushTable = () => {
    if (tableRows.length > 0) {
      const headerRow = tableRows[0];
      const dataRows = tableRows.slice(2);
      elements.push(
        <div key={`table-${elements.length}`} className="overflow-x-auto my-3">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b bg-muted/50">
                {headerRow.map((cell, i) => (
                  <th key={i} className="text-left px-3 py-1.5 font-medium">{cell.trim()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dataRows.map((row, ri) => (
                <tr key={ri} className="border-b last:border-0">
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-3 py-1.5 text-muted-foreground">
                      {cell.trim().startsWith("`") && cell.trim().endsWith("`") ? (
                        <code className="text-xs bg-muted px-1 py-0.5 rounded">{cell.trim().slice(1, -1)}</code>
                      ) : cell.trim()}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableRows = [];
      inTable = false;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith("```")) {
      if (inCodeBlock) {
        elements.push(
          <pre key={`code-${i}`} className="bg-muted rounded-md p-3 text-xs overflow-x-auto my-2 font-mono">
            {codeLines.join("\n")}
          </pre>
        );
        codeLines = [];
        inCodeBlock = false;
      } else {
        flushTable();
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      continue;
    }

    if (line.startsWith("|") && line.includes("|")) {
      inTable = true;
      const cells = line.split("|").filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
      tableRows.push(cells);
      continue;
    } else if (inTable) {
      flushTable();
    }

    if (line.trim() === "") {
      elements.push(<div key={`sp-${i}`} className="h-2" />);
      continue;
    }

    if (line.startsWith("### ")) {
      elements.push(<h4 key={`h3-${i}`} className="text-sm font-semibold mt-4 mb-1">{line.slice(4)}</h4>);
    } else if (line.startsWith("## ")) {
      elements.push(<h3 key={`h2-${i}`} className="text-base font-semibold mt-4 mb-1">{line.slice(3)}</h3>);
    } else if (line.startsWith("# ")) {
      elements.push(<h2 key={`h1-${i}`} className="text-lg font-bold mt-4 mb-2">{line.slice(2)}</h2>);
    } else if (line.startsWith("- ")) {
      elements.push(
        <div key={`li-${i}`} className="flex items-start gap-2 ml-2 text-sm text-muted-foreground">
          <span className="mt-1.5 h-1 w-1 rounded-full bg-muted-foreground shrink-0" />
          <span dangerouslySetInnerHTML={{ __html: inlineFormat(line.slice(2)) }} />
        </div>
      );
    } else {
      elements.push(
        <p key={`p-${i}`} className="text-sm text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: inlineFormat(line) }} />
      );
    }
  }

  flushTable();
  return <div className="space-y-0.5">{elements}</div>;
}

function inlineFormat(text: string): string {
  return text
    .replace(/`([^`]+)`/g, '<code class="text-xs bg-muted px-1 py-0.5 rounded font-mono">$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>');
}

function getMissingSections(bodyMarkdown: string): string[] {
  return REQUIRED_SECTIONS.filter(section => !bodyMarkdown.includes(`## ${section}`));
}

function DocEditor({
  initial,
  allEntries,
  onSave,
  onCancel,
  isPending,
}: {
  initial?: DocsEntryFull;
  allEntries: DocsEntryFull[];
  onSave: (data: any) => void;
  onCancel: () => void;
  isPending: boolean;
}) {
  const [title, setTitle] = useState(initial?.title || "");
  const [slug, setSlug] = useState(initial?.slug || "");
  const [category, setCategory] = useState(initial?.category || "Getting Started");
  const [bodyMarkdown, setBodyMarkdown] = useState(initial?.bodyMarkdown || "");
  const [tagsInput, setTagsInput] = useState(initial?.tags?.join(", ") || "");
  const [version, setVersion] = useState(initial?.version || "1.0");
  const [author, setAuthor] = useState(initial?.author || "system");
  const [relatedSlugs, setRelatedSlugs] = useState<string[]>(initial?.related || []);
  const [showPreview, setShowPreview] = useState(false);
  const [autoSlug, setAutoSlug] = useState(!initial);

  const missing = getMissingSections(bodyMarkdown);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (autoSlug) setSlug(slugify(val));
  };

  const handleSubmit = () => {
    const tags = tagsInput.split(",").map(t => t.trim()).filter(Boolean);
    onSave({
      title,
      slug,
      category,
      bodyMarkdown,
      tags,
      related: relatedSlugs,
      version,
      author,
    });
  };

  const otherEntries = allEntries.filter(e => e.id !== initial?.id);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Title</Label>
          <Input
            value={title}
            onChange={e => handleTitleChange(e.target.value)}
            data-testid="input-doc-title"
          />
        </div>
        <div className="space-y-2">
          <Label>Slug</Label>
          <div className="flex items-center gap-2">
            <Input
              value={slug}
              onChange={e => { setSlug(e.target.value); setAutoSlug(false); }}
              data-testid="input-doc-slug"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger data-testid="select-doc-category">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DOC_CATEGORIES.map(c => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Version</Label>
          <Input value={version} onChange={e => setVersion(e.target.value)} data-testid="input-doc-version" />
        </div>
        <div className="space-y-2">
          <Label>Author</Label>
          <Input value={author} onChange={e => setAuthor(e.target.value)} data-testid="input-doc-author" />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Tags (comma-separated)</Label>
        <Input
          value={tagsInput}
          onChange={e => setTagsInput(e.target.value)}
          placeholder="e.g. cms, builder, blocks"
          data-testid="input-doc-tags"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Body (Markdown)</Label>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
            data-testid="button-toggle-preview"
          >
            <Eye className="h-4 w-4 mr-1" />
            {showPreview ? "Edit" : "Preview"}
          </Button>
        </div>

        {missing.length > 0 && (
          <div className="flex items-start gap-2 p-2 rounded-md bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 text-xs">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
            <div>
              <span className="font-medium">Missing sections:</span>{" "}
              {missing.join(", ")}
            </div>
          </div>
        )}

        {showPreview ? (
          <Card>
            <CardContent className="p-4 min-h-[300px]">
              {renderMarkdown(bodyMarkdown)}
            </CardContent>
          </Card>
        ) : (
          <Textarea
            value={bodyMarkdown}
            onChange={e => setBodyMarkdown(e.target.value)}
            className="min-h-[300px] font-mono text-sm"
            data-testid="textarea-doc-body"
          />
        )}
      </div>

      {otherEntries.length > 0 && (
        <div className="space-y-2">
          <Label>Related Docs</Label>
          <div className="flex flex-wrap gap-1.5">
            {otherEntries.map(entry => {
              const isSelected = relatedSlugs.includes(entry.slug);
              return (
                <Badge
                  key={entry.id}
                  variant={isSelected ? "default" : "outline"}
                  className="cursor-pointer toggle-elevate"
                  onClick={() => {
                    setRelatedSlugs(prev =>
                      isSelected ? prev.filter(s => s !== entry.slug) : [...prev, entry.slug]
                    );
                  }}
                  data-testid={`badge-related-${entry.slug}`}
                >
                  {entry.title}
                </Badge>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 pt-2">
        <Button onClick={handleSubmit} disabled={isPending || !title || !slug} data-testid="button-doc-save">
          {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
          {initial ? "Update" : "Create"}
        </Button>
        <Button variant="outline" onClick={onCancel} data-testid="button-doc-cancel">
          Cancel
        </Button>
      </div>
    </div>
  );
}

export default function AdminDocs() {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [selectedEntry, setSelectedEntry] = useState<DocsEntryFull | null>(null);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [mode, setMode] = useState<"list" | "view" | "create" | "edit">("list");
  const [showValidation, setShowValidation] = useState(false);
  const { toast } = useToast();

  const toggleCategory = (cat: string) => {
    setExpandedCategories((prev) => ({ ...prev, [cat]: !(prev[cat] ?? true) }));
  };

  const { data: docs, isLoading } = useQuery<DocsResponse>({
    queryKey: ["/api/admin/docs"],
  });

  const { data: validationReport, refetch: refetchValidation, isFetching: isValidating } = useQuery<ValidationReport>({
    queryKey: ["/api/admin/docs/validate/all"],
    enabled: false,
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/admin/docs", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/docs"] });
      setMode("list");
      toast({ title: "Doc created successfully" });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await apiRequest("PATCH", `/api/admin/docs/${id}`, data);
      return res.json();
    },
    onSuccess: (updated: DocsEntryFull) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/docs"] });
      setSelectedEntry(updated);
      setMode("view");
      toast({ title: "Doc updated successfully" });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/docs/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/docs"] });
      setSelectedEntry(null);
      setMode("list");
      toast({ title: "Doc deleted" });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const allEntries = docs?.entries ?? [];
  const filteredEntries = useMemo(() => {
    return allEntries.filter(e => {
      if (filterCategory && e.category !== filterCategory) return false;
      if (search) {
        const q = search.toLowerCase();
        return e.title.toLowerCase().includes(q) ||
          e.tags.some(t => t.toLowerCase().includes(q)) ||
          e.bodyMarkdown.toLowerCase().includes(q);
      }
      return true;
    });
  }, [allEntries, search, filterCategory]);

  const categorizedEntries = useMemo(() => {
    const map = new Map<string, DocsEntryFull[]>();
    for (const cat of DOC_CATEGORIES) {
      const catEntries = filteredEntries.filter(e => e.category === cat);
      if (catEntries.length > 0) map.set(cat, catEntries);
    }
    const uncategorized = filteredEntries.filter(e => !DOC_CATEGORIES.includes(e.category));
    if (uncategorized.length > 0) map.set("Other", uncategorized);
    return map;
  }, [filteredEntries]);

  const handleRunValidation = () => {
    setShowValidation(true);
    refetchValidation();
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <BookOpen className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold" data-testid="text-admin-docs-title">Docs Library</h1>
          {docs && (
            <Badge variant="secondary" className="ml-1">{allEntries.length} articles</Badge>
          )}
          <div className="ml-auto flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRunValidation}
              disabled={isValidating}
              data-testid="button-validate-docs"
            >
              {isValidating ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <ShieldCheck className="h-4 w-4 mr-1" />}
              Validate Docs
            </Button>
            <Button
              size="sm"
              onClick={() => { setSelectedEntry(null); setMode("create"); }}
              data-testid="button-create-doc"
            >
              <Plus className="h-4 w-4 mr-1" />
              Create Doc
            </Button>
          </div>
        </div>

        {showValidation && validationReport && (
          <Card className="mb-4">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  <span className="font-semibold text-sm">Doc Quality Report</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setShowValidation(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-4 mb-3 text-sm">
                <span>{validationReport.total} total docs</span>
                {validationReport.issueCount === 0 ? (
                  <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                    <CheckCircle2 className="h-4 w-4" />All docs pass
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
                    <AlertTriangle className="h-4 w-4" />{validationReport.issueCount} docs with issues
                  </span>
                )}
              </div>
              {validationReport.issues.length > 0 && (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {validationReport.issues.map(issue => (
                    <div key={issue.id} className="p-2 rounded-md bg-muted/50 text-sm">
                      <span className="font-medium">{issue.title}</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {issue.problems.map((p, i) => (
                          <Badge key={i} variant="outline" className="text-xs text-yellow-600 dark:text-yellow-400">{p}</Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {mode === "create" && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Button variant="ghost" onClick={() => setMode("list")} data-testid="button-docs-back">
                <ArrowLeft className="h-4 w-4 mr-1" />Back
              </Button>
              <h2 className="text-lg font-semibold">Create New Doc</h2>
            </div>
            <Card>
              <CardContent className="p-6">
                <DocEditor
                  allEntries={allEntries}
                  onSave={(data) => createMutation.mutate(data)}
                  onCancel={() => setMode("list")}
                  isPending={createMutation.isPending}
                />
              </CardContent>
            </Card>
          </div>
        )}

        {mode === "edit" && selectedEntry && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Button variant="ghost" onClick={() => setMode("view")} data-testid="button-docs-back">
                <ArrowLeft className="h-4 w-4 mr-1" />Back
              </Button>
              <h2 className="text-lg font-semibold">Edit: {selectedEntry.title}</h2>
            </div>
            <Card>
              <CardContent className="p-6">
                <DocEditor
                  initial={selectedEntry}
                  allEntries={allEntries}
                  onSave={(data) => updateMutation.mutate({ id: selectedEntry.id, data })}
                  onCancel={() => setMode("view")}
                  isPending={updateMutation.isPending}
                />
              </CardContent>
            </Card>
          </div>
        )}

        {mode === "view" && selectedEntry && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Button variant="ghost" onClick={() => { setSelectedEntry(null); setMode("list"); }} data-testid="button-docs-back">
                <ArrowLeft className="h-4 w-4 mr-1" />Back to list
              </Button>
            </div>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <Badge variant="outline">{selectedEntry.category}</Badge>
                  <Badge variant="secondary" className="text-xs">v{selectedEntry.version}</Badge>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <User className="h-3 w-3" />{selectedEntry.author}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />{new Date(selectedEntry.updatedAt).toLocaleDateString()}
                  </span>
                  <div className="ml-auto flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setMode("edit")}
                      data-testid="button-edit-doc"
                    >
                      <Pencil className="h-4 w-4 mr-1" />Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (confirm("Delete this doc?")) deleteMutation.mutate(selectedEntry.id);
                      }}
                      data-testid="button-delete-doc"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />Delete
                    </Button>
                  </div>
                </div>
                <h2 className="text-xl font-bold mb-4" data-testid="text-doc-title">{selectedEntry.title}</h2>
                {renderMarkdown(selectedEntry.bodyMarkdown)}

                {selectedEntry.related.length > 0 && (
                  <div className="mt-6 pt-4 border-t">
                    <h3 className="text-sm font-semibold mb-2">Related Docs</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedEntry.related.map(slug => {
                        const relEntry = allEntries.find(e => e.slug === slug);
                        return (
                          <Badge
                            key={slug}
                            variant="outline"
                            className="cursor-pointer hover-elevate"
                            onClick={() => {
                              if (relEntry) {
                                setSelectedEntry(relEntry);
                                setMode("view");
                              }
                            }}
                          >
                            {relEntry?.title || slug}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-1.5 flex-wrap mt-6 pt-4 border-t">
                  {selectedEntry.tags.map((t) => (
                    <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {mode === "list" && docs && (
          <div className="flex gap-6">
            <aside className="w-56 shrink-0 space-y-1" data-testid="docs-category-nav">
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search docs..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                  data-testid="input-docs-search"
                />
              </div>

              <div className="mb-3">
                <Select value={filterCategory} onValueChange={val => setFilterCategory(val === "all" ? "" : val)}>
                  <SelectTrigger data-testid="select-filter-category">
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    {DOC_CATEGORIES.map(c => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {Array.from(categorizedEntries.entries()).map(([cat, catEntries]) => {
                const isExpanded = expandedCategories[cat] ?? true;
                return (
                  <div key={cat}>
                    <button
                      className="w-full flex items-center gap-2 px-2 py-2 text-sm font-semibold rounded-md hover-elevate"
                      onClick={() => toggleCategory(cat)}
                      data-testid={`button-docs-cat-${cat.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      {isExpanded ? <ChevronDown className="h-3.5 w-3.5 shrink-0" /> : <ChevronRight className="h-3.5 w-3.5 shrink-0" />}
                      <span>{cat}</span>
                      <Badge variant="secondary" className="ml-auto text-xs">{catEntries.length}</Badge>
                    </button>
                    {isExpanded && (
                      <div className="ml-5 space-y-0.5 mb-2">
                        {catEntries.map((entry) => (
                          <Button
                            key={entry.id}
                            variant="ghost"
                            className="w-full justify-start text-sm h-auto py-1.5 px-2 text-muted-foreground"
                            onClick={() => { setSelectedEntry(entry); setMode("view"); }}
                            data-testid={`button-doc-${entry.slug}`}
                          >
                            <span className="truncate">{entry.title}</span>
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </aside>

            <div className="flex-1 min-w-0 space-y-3">
              {filteredEntries.length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center text-muted-foreground">
                    No documentation entries found.
                  </CardContent>
                </Card>
              )}

              {filteredEntries.map((entry) => (
                <Card
                  key={entry.id}
                  className="hover-elevate cursor-pointer"
                  onClick={() => { setSelectedEntry(entry); setMode("view"); }}
                  data-testid={`card-doc-${entry.slug}`}
                >
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <Badge variant="outline" className="text-xs">{entry.category}</Badge>
                        <h3 className="font-medium text-sm">{entry.title}</h3>
                        <Badge variant="secondary" className="text-xs">v{entry.version}</Badge>
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {entry.tags.slice(0, 4).map((t) => (
                          <span key={t} className="text-xs text-muted-foreground flex items-center gap-0.5">
                            <Tag className="h-3 w-3" />{t}
                          </span>
                        ))}
                        <span className="text-xs text-muted-foreground ml-auto flex items-center gap-1">
                          <User className="h-3 w-3" />{entry.author}
                          <span className="mx-1">-</span>
                          {new Date(entry.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
