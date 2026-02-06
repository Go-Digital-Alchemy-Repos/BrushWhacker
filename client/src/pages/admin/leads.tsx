import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
  Users, Search, Download, Loader2, ChevronLeft, ChevronRight, Eye
} from "lucide-react";
import AdminLayout from "@/components/admin/admin-layout";
import type { Lead } from "@shared/schema";

interface PaginatedLeads {
  leads: Lead[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

const STATUS_COLORS: Record<string, string> = {
  New: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  Contacted: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  Scheduled: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  Won: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  Lost: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
};

const COUNTIES = ["Mecklenburg", "Union", "Cabarrus", "Gaston", "Iredell", "Lincoln", "Rowan", "Stanly", "York (SC)", "Lancaster (SC)"];
const SERVICES = [
  { value: "land-clearing", label: "Land Clearing" },
  { value: "brush-removal", label: "Brush Removal" },
  { value: "forestry-mulching", label: "Forestry Mulching" },
  { value: "lot-clearing", label: "Lot Clearing" },
  { value: "stump-grinding", label: "Stump Grinding" },
  { value: "driveway-trail-cutting", label: "Driveway & Trail Cutting" },
  { value: "storm-cleanup", label: "Storm Cleanup" },
];

function formatDate(d: string | Date | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function serviceLabel(slug: string) {
  const svc = SERVICES.find(s => s.value === slug);
  return svc ? svc.label : slug;
}

export default function AdminLeads() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [countyFilter, setCountyFilter] = useState("all");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const queryParams = new URLSearchParams();
  queryParams.set("page", String(page));
  queryParams.set("pageSize", String(pageSize));
  if (search) queryParams.set("search", search);
  if (statusFilter !== "all") queryParams.set("status", statusFilter);
  if (countyFilter !== "all") queryParams.set("county", countyFilter);
  if (serviceFilter !== "all") queryParams.set("service", serviceFilter);

  const { data, isLoading } = useQuery<PaginatedLeads>({
    queryKey: ["/api/admin/leads", `?${queryParams.toString()}`],
  });

  const handleExport = () => {
    window.open("/api/admin/leads/export.csv", "_blank");
  };

  return (
    <AdminLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <div className="flex items-center gap-3">
            <Users className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold" data-testid="text-admin-leads-title">Leads</h1>
            {data && (
              <Badge variant="outline" className="no-default-hover-elevate no-default-active-elevate">
                {data.total} total
              </Badge>
            )}
          </div>
          <Button variant="outline" onClick={handleExport} className="gap-2" data-testid="button-export-csv">
            <Download className="h-4 w-4" /> Export CSV
          </Button>
        </div>

        <div className="flex flex-wrap gap-3 mb-4">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search name, email, phone..."
              className="pl-9"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              data-testid="input-search-leads"
            />
          </div>

          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
            <SelectTrigger className="w-36" data-testid="select-status-filter">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="New">New</SelectItem>
              <SelectItem value="Contacted">Contacted</SelectItem>
              <SelectItem value="Scheduled">Scheduled</SelectItem>
              <SelectItem value="Won">Won</SelectItem>
              <SelectItem value="Lost">Lost</SelectItem>
            </SelectContent>
          </Select>

          <Select value={countyFilter} onValueChange={(v) => { setCountyFilter(v); setPage(1); }}>
            <SelectTrigger className="w-36" data-testid="select-county-filter">
              <SelectValue placeholder="All Counties" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Counties</SelectItem>
              {COUNTIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={serviceFilter} onValueChange={(v) => { setServiceFilter(v); setPage(1); }}>
            <SelectTrigger className="w-44" data-testid="select-service-filter">
              <SelectValue placeholder="All Services" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Services</SelectItem>
              {SERVICES.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : !data?.leads.length ? (
              <div className="text-center py-16 text-muted-foreground" data-testid="text-no-leads">
                No leads found matching your filters.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm" data-testid="table-leads">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left px-4 py-3 font-medium">Date</th>
                      <th className="text-left px-4 py-3 font-medium">Name</th>
                      <th className="text-left px-4 py-3 font-medium">County</th>
                      <th className="text-left px-4 py-3 font-medium">Services</th>
                      <th className="text-left px-4 py-3 font-medium">Status</th>
                      <th className="text-left px-4 py-3 font-medium">Timeline</th>
                      <th className="text-right px-4 py-3 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.leads.map((lead) => (
                      <tr key={lead.id} className="border-b last:border-0" data-testid={`row-lead-${lead.id}`}>
                        <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{formatDate(lead.createdAt)}</td>
                        <td className="px-4 py-3">
                          <div className="font-medium">{lead.fullName}</div>
                          <div className="text-xs text-muted-foreground">{lead.email}</div>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{lead.county}</td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {(lead.servicesNeeded || []).slice(0, 2).map(s => (
                              <Badge key={s} variant="outline" className="text-xs no-default-hover-elevate no-default-active-elevate">
                                {serviceLabel(s)}
                              </Badge>
                            ))}
                            {(lead.servicesNeeded || []).length > 2 && (
                              <Badge variant="outline" className="text-xs no-default-hover-elevate no-default-active-elevate">
                                +{lead.servicesNeeded.length - 2}
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            variant="outline"
                            className={`text-xs no-default-hover-elevate no-default-active-elevate ${STATUS_COLORS[lead.status] || ""}`}
                          >
                            {lead.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground text-sm">{lead.timeline}</td>
                        <td className="px-4 py-3 text-right">
                          <Link href={`/admin/leads/${lead.id}`}>
                            <Button variant="ghost" size="sm" className="gap-1" data-testid={`button-view-lead-${lead.id}`}>
                              <Eye className="h-3.5 w-3.5" /> View
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 gap-4">
            <p className="text-sm text-muted-foreground">
              Page {data.page} of {data.totalPages} ({data.total} leads)
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage(p => p - 1)}
                data-testid="button-prev-page"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= data.totalPages}
                onClick={() => setPage(p => p + 1)}
                data-testid="button-next-page"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
