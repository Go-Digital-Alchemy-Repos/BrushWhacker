import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TreePine, ArrowLeft, FileText, Plus } from "lucide-react";

const pages = [
  { name: "Home", path: "/", status: "Published" },
  { name: "Services", path: "/services", status: "Published" },
  { name: "Pricing", path: "/pricing", status: "Published" },
  { name: "Blog", path: "/blog", status: "Published" },
  { name: "Get a Quote", path: "/quote", status: "Published" },
];

export default function AdminCMS() {
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
          This is a shell view. CMS functionality will be fully implemented in a future phase.
        </p>
      </div>
    </div>
  );
}
