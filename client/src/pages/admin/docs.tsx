import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TreePine, ArrowLeft, BookOpen, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface DocsData {
  phase: string;
  overview: string;
  frontendRoutes: { path: string; description: string }[];
  backendRoutes: { method: string; path: string; description: string }[];
  components: { name: string; description: string }[];
  envVars: { name: string; description: string }[];
  runLocally: string[];
}

export default function AdminDocs() {
  const { data: docs, isLoading, error } = useQuery<DocsData>({
    queryKey: ["/api/admin/docs"],
  });

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
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold" data-testid="text-admin-docs-title">Docs Library</h1>
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

        {docs && (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <Badge className="mb-3">{docs.phase}</Badge>
                <h2 className="text-xl font-semibold mb-2">Overview</h2>
                <p className="text-muted-foreground leading-relaxed" data-testid="text-docs-overview">{docs.overview}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Frontend Routes</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm" data-testid="table-frontend-routes">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-left px-4 py-2 font-medium">Path</th>
                        <th className="text-left px-4 py-2 font-medium">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {docs.frontendRoutes.map((r) => (
                        <tr key={r.path} className="border-b last:border-0">
                          <td className="px-4 py-2 font-mono text-xs">{r.path}</td>
                          <td className="px-4 py-2 text-muted-foreground">{r.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Backend Routes</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm" data-testid="table-backend-routes">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-left px-4 py-2 font-medium">Method</th>
                        <th className="text-left px-4 py-2 font-medium">Path</th>
                        <th className="text-left px-4 py-2 font-medium">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {docs.backendRoutes.map((r) => (
                        <tr key={`${r.method}-${r.path}`} className="border-b last:border-0">
                          <td className="px-4 py-2">
                            <Badge variant="outline">{r.method}</Badge>
                          </td>
                          <td className="px-4 py-2 font-mono text-xs">{r.path}</td>
                          <td className="px-4 py-2 text-muted-foreground">{r.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Components Introduced</h2>
                <div className="space-y-2">
                  {docs.components.map((c) => (
                    <div key={c.name} className="flex items-start gap-3 text-sm">
                      <code className="text-xs bg-muted px-2 py-0.5 rounded-md shrink-0">{c.name}</code>
                      <span className="text-muted-foreground">{c.description}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
                <div className="space-y-2">
                  {docs.envVars.map((v) => (
                    <div key={v.name} className="flex items-start gap-3 text-sm">
                      <code className="text-xs bg-muted px-2 py-0.5 rounded-md shrink-0">{v.name}</code>
                      <span className="text-muted-foreground">{v.description}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">How to Run Locally</h2>
                <ol className="space-y-2 text-sm">
                  {docs.runLocally.map((step, i) => (
                    <li key={i} className="flex gap-2 text-muted-foreground">
                      <span className="font-bold text-foreground">{i + 1}.</span>
                      {step}
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
