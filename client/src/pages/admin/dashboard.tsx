import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard, Users, FileText, Palette, BookOpen, ArrowRight, TreePine
} from "lucide-react";

const adminLinks = [
  { title: "Leads", desc: "View and manage CRM leads and quote requests.", href: "/admin/leads", icon: Users },
  { title: "CMS", desc: "Manage website content, pages, and blog posts.", href: "/admin/cms", icon: FileText },
  { title: "Branding", desc: "Update brand colors, logo, and site-wide settings.", href: "/admin/branding", icon: Palette },
  { title: "Docs Library", desc: "Technical documentation and developer reference.", href: "/admin/docs", icon: BookOpen },
];

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14 gap-4">
          <div className="flex items-center gap-2">
            <TreePine className="h-6 w-6 text-primary" />
            <span className="font-bold">BrushWhackers <span className="text-muted-foreground font-normal text-sm">Admin</span></span>
          </div>
          <Link href="/">
            <Button variant="ghost" size="sm" data-testid="link-back-to-site">Back to Site</Button>
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-3 mb-8">
          <LayoutDashboard className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold" data-testid="text-admin-title">Admin Dashboard</h1>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {adminLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <Card className="hover-elevate cursor-pointer h-full" data-testid={`card-admin-${link.title.toLowerCase()}`}>
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                    <link.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold">{link.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{link.desc}</p>
                    <span className="text-sm text-primary font-medium flex items-center gap-1 mt-3">
                      Open <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
