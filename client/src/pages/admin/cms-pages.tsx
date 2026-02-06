import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { FileText, Plus, Search, Pencil, Trash2, Loader2 } from "lucide-react";
import AdminLayout from "@/components/admin/admin-layout";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface CmsPage {
  id: string;
  title: string;
  slug: string;
  status: string;
  pageType: string;
  updatedAt: string | null;
}

function formatDate(d: string | Date | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function CmsPages() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  const queryParams = new URLSearchParams();
  if (statusFilter !== "all") queryParams.set("status", statusFilter);
  if (typeFilter !== "all") queryParams.set("pageType", typeFilter);
  if (search) queryParams.set("search", search);

  const filterKey = queryParams.toString();
  const queryString = filterKey ? `?${filterKey}` : "";

  const { data: pages = [], isLoading } = useQuery<CmsPage[]>({
    queryKey: ["/api/admin/cms/pages", queryString],
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/cms/pages/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/cms/pages"] });
      toast({ title: "Page deleted" });
    },
    onError: () => {
      toast({ title: "Failed to delete page", variant: "destructive" });
    },
  });

  return (
    <AdminLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold" data-testid="text-cms-pages-title">Pages</h1>
          </div>
          <Link href="/admin/cms/pages/new">
            <Button className="gap-2" data-testid="button-new-page">
              <Plus className="h-4 w-4" /> New Page
            </Button>
          </Link>
        </div>

        <div className="flex flex-wrap gap-3 mb-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search pages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
              data-testid="input-search-pages"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]" data-testid="select-status-filter">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[140px]" data-testid="select-type-filter">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="page">Page</SelectItem>
              <SelectItem value="service">Service</SelectItem>
              <SelectItem value="landing">Landing</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" data-testid="loader-pages" />
              </div>
            ) : pages.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground" data-testid="text-no-pages">
                No pages found. Create your first page to get started.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm" data-testid="table-pages">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left px-4 py-3 font-medium">Title</th>
                      <th className="text-left px-4 py-3 font-medium">Slug</th>
                      <th className="text-left px-4 py-3 font-medium">Status</th>
                      <th className="text-left px-4 py-3 font-medium">Page Type</th>
                      <th className="text-left px-4 py-3 font-medium">Updated</th>
                      <th className="text-right px-4 py-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pages.map((page) => (
                      <tr key={page.id} className="border-b last:border-0" data-testid={`row-page-${page.id}`}>
                        <td className="px-4 py-3 font-medium" data-testid={`text-page-title-${page.id}`}>
                          {page.title}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">/{page.slug}</td>
                        <td className="px-4 py-3">
                          <Badge
                            variant={page.status === "published" ? "default" : "secondary"}
                            data-testid={`badge-page-status-${page.id}`}
                          >
                            {page.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground capitalize">{page.pageType}</td>
                        <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                          {formatDate(page.updatedAt)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Link href={`/admin/cms/pages/${page.id}`}>
                              <Button variant="ghost" size="icon" data-testid={`button-edit-page-${page.id}`}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                if (confirm("Are you sure you want to delete this page?")) {
                                  deleteMutation.mutate(page.id);
                                }
                              }}
                              data-testid={`button-delete-page-${page.id}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
