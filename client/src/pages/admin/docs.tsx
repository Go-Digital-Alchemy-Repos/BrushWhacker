import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/admin-layout";

interface DocsData {
  phase: string;
  overview: string;
  frontendRoutes: { path: string; description: string }[];
  backendRoutes: { method: string; path: string; description: string }[];
  authentication?: { method: string; adminUser: string; session: string; protection: string };
  databaseSchema?: Record<string, string>;
}

export default function AdminDocs() {
  const { data: docs, isLoading, error } = useQuery<DocsData>({
    queryKey: ["/api/admin/docs"],
  });

  return (
    <AdminLayout>
      <div className="p-6 max-w-6xl mx-auto">
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

            {docs.authentication && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Authentication</h2>
                  <div className="space-y-2 text-sm">
                    {Object.entries(docs.authentication).map(([k, v]) => (
                      <div key={k} className="flex items-start gap-3">
                        <code className="text-xs bg-muted px-2 py-0.5 rounded-md shrink-0 capitalize">{k}</code>
                        <span className="text-muted-foreground">{v}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

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

            {docs.databaseSchema && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Database Schema</h2>
                  <div className="space-y-3 text-sm">
                    {Object.entries(docs.databaseSchema).map(([table, desc]) => (
                      <div key={table}>
                        <code className="text-xs bg-muted px-2 py-0.5 rounded-md font-bold">{table}</code>
                        <p className="text-muted-foreground mt-1 ml-1">{desc}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
