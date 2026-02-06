import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Loader2, ChevronRight, ChevronDown, Search, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/admin-layout";

interface DocsEntry {
  category: string;
  title: string;
  bodyMarkdown: string;
  updatedAt: string;
  tags: string[];
}

interface DocsResponse {
  categories: string[];
  entries: DocsEntry[];
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

export default function AdminDocs() {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [selectedEntry, setSelectedEntry] = useState<DocsEntry | null>(null);
  const [search, setSearch] = useState("");

  const toggleCategory = (cat: string) => {
    setExpandedCategories((prev) => ({ ...prev, [cat]: !(prev[cat] ?? true) }));
  };

  const { data: docs, isLoading, error } = useQuery<DocsResponse>({
    queryKey: ["/api/admin/docs"],
  });

  const filteredEntries = docs?.entries.filter((e) => {
    if (search) {
      const q = search.toLowerCase();
      return e.title.toLowerCase().includes(q) || e.tags.some((t) => t.toLowerCase().includes(q)) || e.bodyMarkdown.toLowerCase().includes(q);
    }
    return true;
  }) ?? [];

  return (
    <AdminLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold" data-testid="text-admin-docs-title">Docs Library</h1>
          {docs && (
            <Badge variant="secondary" className="ml-2">{docs.entries.length} articles</Badge>
          )}
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {error && (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              Failed to load documentation. Please try again.
            </CardContent>
          </Card>
        )}

        {docs && !selectedEntry && (
          <div className="flex gap-6">
            <aside className="w-52 shrink-0 space-y-1" data-testid="docs-category-nav">
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

              {search ? (
                <div className="space-y-0.5">
                  <p className="text-xs text-muted-foreground px-2 mb-2">{filteredEntries.length} result(s)</p>
                  {filteredEntries.map((entry, idx) => (
                    <Button
                      key={`${entry.category}-${idx}`}
                      variant="ghost"
                      className="w-full justify-start text-sm h-auto py-1.5 px-2"
                      onClick={() => setSelectedEntry(entry)}
                      data-testid={`button-search-result-${idx}`}
                    >
                      <span className="truncate">{entry.title}</span>
                    </Button>
                  ))}
                </div>
              ) : (
                docs.categories.map((cat) => {
                  const catEntries = docs.entries.filter((e) => e.category === cat);
                  const isExpanded = expandedCategories[cat] ?? true;
                  return (
                    <div key={cat}>
                      <button
                        className="w-full flex items-center gap-2 px-2 py-2 text-sm font-semibold rounded-md hover-elevate"
                        onClick={() => toggleCategory(cat)}
                        data-testid={`button-docs-cat-${cat.toLowerCase()}`}
                      >
                        {isExpanded ? <ChevronDown className="h-3.5 w-3.5 shrink-0" /> : <ChevronRight className="h-3.5 w-3.5 shrink-0" />}
                        <span>{cat}</span>
                        <Badge variant="secondary" className="ml-auto text-xs">{catEntries.length}</Badge>
                      </button>
                      {isExpanded && (
                        <div className="ml-5 space-y-0.5 mb-2">
                          {catEntries.map((entry, idx) => (
                            <Button
                              key={`${cat}-${idx}`}
                              variant="ghost"
                              className="w-full justify-start text-sm h-auto py-1.5 px-2 text-muted-foreground"
                              onClick={() => setSelectedEntry(entry)}
                              data-testid={`button-doc-${cat.toLowerCase()}-${idx}`}
                            >
                              <span className="truncate">{entry.title}</span>
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </aside>

            <div className="flex-1 min-w-0 space-y-4">
              {!search && filteredEntries.length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center text-muted-foreground">
                    No documentation entries found.
                  </CardContent>
                </Card>
              )}

              {!search && filteredEntries.map((entry, idx) => (
                <Card
                  key={`${entry.category}-${entry.title}-${idx}`}
                  className="hover-elevate cursor-pointer"
                  onClick={() => setSelectedEntry(entry)}
                  data-testid={`card-doc-${idx}`}
                >
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <Badge variant="outline" className="text-xs">{entry.category}</Badge>
                        <h3 className="font-medium text-sm">{entry.title}</h3>
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {entry.tags.slice(0, 4).map((t) => (
                          <span key={t} className="text-xs text-muted-foreground flex items-center gap-0.5">
                            <Tag className="h-3 w-3" />{t}
                          </span>
                        ))}
                        <span className="text-xs text-muted-foreground ml-auto">{entry.updatedAt}</span>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  </CardContent>
                </Card>
              ))}

              {search && filteredEntries.length > 0 && (
                <div className="space-y-4">
                  {filteredEntries.map((entry, idx) => (
                    <Card
                      key={`${entry.category}-${entry.title}-${idx}`}
                      className="hover-elevate cursor-pointer"
                      onClick={() => setSelectedEntry(entry)}
                      data-testid={`card-doc-${idx}`}
                    >
                      <CardContent className="p-4 flex items-center gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <Badge variant="outline" className="text-xs">{entry.category}</Badge>
                            <h3 className="font-medium text-sm">{entry.title}</h3>
                          </div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {entry.tags.slice(0, 4).map((t) => (
                              <span key={t} className="text-xs text-muted-foreground flex items-center gap-0.5">
                                <Tag className="h-3 w-3" />{t}
                              </span>
                            ))}
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {search && filteredEntries.length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center text-muted-foreground">
                    No matching documentation found.
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {docs && selectedEntry && (
          <div>
            <Button
              variant="ghost"
              className="mb-4"
              onClick={() => setSelectedEntry(null)}
              data-testid="button-docs-back"
            >
              Back to list
            </Button>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <Badge variant="outline">{selectedEntry.category}</Badge>
                  <span className="text-xs text-muted-foreground">{selectedEntry.updatedAt}</span>
                </div>
                <h2 className="text-xl font-bold mb-4" data-testid="text-doc-title">{selectedEntry.title}</h2>
                {renderMarkdown(selectedEntry.bodyMarkdown)}
                <div className="flex items-center gap-1.5 flex-wrap mt-6 pt-4 border-t">
                  {selectedEntry.tags.map((t) => (
                    <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
