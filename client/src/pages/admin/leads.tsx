import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TreePine, ArrowLeft, Users, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const sampleLeads = [
  { id: 1, name: "John Smith", email: "john@example.com", service: "Land Clearing", status: "New", date: "Jan 15, 2026" },
  { id: 2, name: "Sarah Johnson", email: "sarah@example.com", service: "Brush Removal", status: "Contacted", date: "Jan 14, 2026" },
  { id: 3, name: "Mike Davis", email: "mike@example.com", service: "Forestry Mulching", status: "Quoted", date: "Jan 12, 2026" },
  { id: 4, name: "Emily Brown", email: "emily@example.com", service: "Storm Cleanup", status: "New", date: "Jan 11, 2026" },
];

function statusVariant(status: string) {
  if (status === "New") return "default" as const;
  if (status === "Contacted") return "secondary" as const;
  return "outline" as const;
}

export default function AdminLeads() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14 gap-4">
          <div className="flex items-center gap-2">
            <TreePine className="h-6 w-6 text-primary" />
            <span className="font-bold">BrushWhackers <span className="text-muted-foreground font-normal text-sm">Admin</span></span>
          </div>
          <Link href="/">
            <Button variant="ghost" size="sm">Back to Site</Button>
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link href="/admin" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Dashboard
        </Link>
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <div className="flex items-center gap-3">
            <Users className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold" data-testid="text-admin-leads-title">CRM Leads</h1>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search leads..." className="pl-9" data-testid="input-search-leads" />
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm" data-testid="table-leads">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left px-4 py-3 font-medium">Name</th>
                    <th className="text-left px-4 py-3 font-medium">Email</th>
                    <th className="text-left px-4 py-3 font-medium">Service</th>
                    <th className="text-left px-4 py-3 font-medium">Status</th>
                    <th className="text-left px-4 py-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {sampleLeads.map((lead) => (
                    <tr key={lead.id} className="border-b last:border-0 hover-elevate" data-testid={`row-lead-${lead.id}`}>
                      <td className="px-4 py-3 font-medium">{lead.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{lead.email}</td>
                      <td className="px-4 py-3">{lead.service}</td>
                      <td className="px-4 py-3">
                        <Badge variant={statusVariant(lead.status)}>{lead.status}</Badge>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{lead.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground mt-4">
          This is a shell view. CRM functionality will be fully implemented in a future phase.
        </p>
      </div>
    </div>
  );
}
