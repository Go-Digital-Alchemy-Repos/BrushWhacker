import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Plus } from "lucide-react";
import AdminLayout from "@/components/admin/admin-layout";

const pages = [
  { name: "Home", path: "/", status: "Published" },
  { name: "Services", path: "/services", status: "Published" },
  { name: "Pricing", path: "/pricing", status: "Published" },
  { name: "Blog", path: "/blog", status: "Published" },
  { name: "Get a Quote", path: "/quote", status: "Published" },
];

export default function AdminCMS() {
  return (
    <AdminLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold" data-testid="text-admin-cms-title">Content Manager</h1>
          </div>
          <Button className="gap-2" data-testid="button-add-page">
            <Plus className="h-4 w-4" /> Add Page
          </Button>
        </div>

        <div className="space-y-3">
          {pages.map((page) => (
            <Card key={page.path} className="hover-elevate" data-testid={`card-page-${page.name.toLowerCase().replace(/\s+/g, "-")}`}>
              <CardContent className="p-4 flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <h3 className="font-medium">{page.name}</h3>
                  <p className="text-sm text-muted-foreground">{page.path}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{page.status}</span>
                  <Button variant="outline" size="sm" data-testid={`button-edit-${page.name.toLowerCase().replace(/\s+/g, "-")}`}>Edit</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="text-xs text-muted-foreground mt-4">
          CMS functionality will be fully implemented in a future phase.
        </p>
      </div>
    </AdminLayout>
  );
}
