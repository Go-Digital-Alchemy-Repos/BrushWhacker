import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText, Layout, LayoutGrid, ImageIcon, Palette,
  ArrowRightLeft, BookOpen, Search, ChevronRight
} from "lucide-react";
import AdminLayout from "@/components/admin/admin-layout";

const seoTips = [
  "Use descriptive, keyword-rich page titles under 60 characters.",
  "Write unique meta descriptions (150–160 chars) for every page.",
  "Structure content with proper heading hierarchy (H1 → H2 → H3).",
  "Add alt text to all images describing their content.",
  "Use clean, readable URLs with relevant keywords.",
  "Ensure fast page load times — compress images and minimize scripts.",
  "Link related pages together with descriptive anchor text.",
];

const cmsTools = [
  {
    title: "Pages",
    icon: FileText,
    href: "/admin/cms/pages",
    description: "Create and manage custom pages with the drag-and-drop builder",
  },
  {
    title: "Templates",
    icon: Layout,
    href: "/admin/cms/templates",
    description: "Design reusable page templates",
  },
  {
    title: "Block Library",
    icon: LayoutGrid,
    href: "/admin/cms/blocks",
    description: "Browse available content blocks for your pages",
  },
  {
    title: "Media Library",
    icon: ImageIcon,
    href: "/admin/cms/media",
    description: "Manage images and media assets",
  },
  {
    title: "Themes",
    icon: Palette,
    href: "/admin/cms/themes",
    description: "Choose and customize theme presets",
  },
  {
    title: "Redirects",
    icon: ArrowRightLeft,
    href: "/admin/cms/redirects",
    description: "Manage URL redirects for SEO",
  },
  {
    title: "Blog Posts",
    icon: BookOpen,
    href: "/admin/cms/blog",
    description: "Write and manage blog content",
  },
  {
    title: "SEO Guide",
    icon: Search,
    href: "",
    description: "Tips for optimizing your site's search visibility",
  },
];

export default function CmsHome() {
  const [seoOpen, setSeoOpen] = useState(false);

  return (
    <AdminLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold" data-testid="text-cms-title">Content Management</h1>
          <p className="text-muted-foreground mt-1" data-testid="text-cms-subtitle">
            Build pages, manage content, and customize your site
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {cmsTools.map((tool) => {
            const Icon = tool.icon;
            const isSeo = tool.title === "SEO Guide";

            if (isSeo) {
              return (
                <div key={tool.title} data-testid={`card-cms-${tool.title.toLowerCase().replace(/\s+/g, "-")}`}>
                  <Card
                    className="h-full flex flex-col cursor-pointer hover-elevate"
                    onClick={() => setSeoOpen(!seoOpen)}
                  >
                    <CardContent className="p-4 flex flex-col flex-1 gap-3">
                      <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center shrink-0">
                        <Icon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-sm mb-1">{tool.title}</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">{tool.description}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full gap-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSeoOpen(!seoOpen);
                        }}
                        data-testid="button-seo-toggle"
                      >
                        {seoOpen ? "Hide Tips" : "View Tips"}
                        <ChevronRight className={`h-3.5 w-3.5 transition-transform ${seoOpen ? "rotate-90" : ""}`} />
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              );
            }

            return (
              <Card key={tool.title} className="h-full flex flex-col hover-elevate" data-testid={`card-cms-${tool.title.toLowerCase().replace(/\s+/g, "-")}`}>
                <CardContent className="p-4 flex flex-col flex-1 gap-3">
                  <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center shrink-0">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-sm mb-1">{tool.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{tool.description}</p>
                  </div>
                  <Link href={tool.href}>
                    <Button variant="outline" size="sm" className="w-full gap-1" data-testid={`button-cms-${tool.title.toLowerCase().replace(/\s+/g, "-")}`}>
                      Open
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {seoOpen && (
          <Card className="mt-4" data-testid="card-seo-tips">
            <CardContent className="p-4">
              <h3 className="font-medium mb-3">SEO Quick Tips</h3>
              <ul className="space-y-2">
                {seoTips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-primary font-medium shrink-0">{i + 1}.</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
