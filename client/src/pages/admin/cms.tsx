import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, BookOpen, ArrowRight } from "lucide-react";
import AdminLayout from "@/components/admin/admin-layout";

const pages = [
  { name: "Home", path: "/", status: "Published" },
  { name: "Services", path: "/services", status: "Published" },
  { name: "Pricing", path: "/pricing", status: "Published" },
  { name: "Get a Quote", path: "/quote", status: "Published" },
];

export default function AdminCMS() {
  return (
    <AdminLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <FileText className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold" data-testid="text-admin-cms-title">Content Manager</h1>
        </div>

        <Link href="/admin/cms/blog">
          <Card className="hover-elevate mb-6 cursor-pointer" data-testid="card-cms-blog">
            <CardContent className="p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Blog Posts</h3>
                  <p className="text-sm text-muted-foreground">Create, edit, and manage blog articles</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>

        <h2 className="text-lg font-semibold mb-3">Pages</h2>
        <div className="space-y-3">
          {pages.map((page) => (
            <Card key={page.path} data-testid={`card-page-${page.name.toLowerCase().replace(/\s+/g, "-")}`}>
              <CardContent className="p-4 flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <h3 className="font-medium">{page.name}</h3>
                  <p className="text-sm text-muted-foreground">{page.path}</p>
                </div>
                <span className="text-xs text-muted-foreground">{page.status}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
