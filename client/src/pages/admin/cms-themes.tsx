import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AdminLayout from "@/components/admin/admin-layout";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Palette, Loader2, Check } from "lucide-react";
import type { ThemePreset } from "@shared/schema";

interface ThemeTokens {
  colors?: Record<string, string>;
  fontFamily?: string;
  borderRadius?: string;
  [key: string]: unknown;
}

export default function AdminCmsThemes() {
  const { toast } = useToast();

  const { data: themes = [], isLoading } = useQuery<ThemePreset[]>({
    queryKey: ["/api/admin/cms/themes"],
  });

  const activateMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("POST", `/api/admin/cms/themes/${id}/activate`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/cms/themes"] });
      toast({ title: "Theme activated" });
    },
  });

  return (
    <AdminLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Palette className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold" data-testid="text-admin-themes-title">Themes</h1>
          <Badge variant="secondary">{themes.length} themes</Badge>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : themes.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              No theme presets found.
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {themes.map((theme) => {
              const tokens = (theme.tokens || {}) as ThemeTokens;
              const colors = tokens.colors || {};
              const colorEntries = Object.entries(colors).slice(0, 6);

              return (
                <Card
                  key={theme.id}
                  className={theme.isActive ? "ring-2 ring-primary" : ""}
                  data-testid={`card-theme-${theme.id}`}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold" data-testid={`text-theme-name-${theme.id}`}>{theme.name}</h3>
                          {theme.isActive && (
                            <Badge variant="default" className="gap-1" data-testid={`badge-active-${theme.id}`}>
                              <Check className="h-3 w-3" /> Active
                            </Badge>
                          )}
                        </div>
                        {theme.description && (
                          <p className="text-sm text-muted-foreground mt-1">{theme.description}</p>
                        )}
                      </div>
                    </div>

                    {colorEntries.length > 0 && (
                      <div className="flex gap-1.5 mb-3 flex-wrap">
                        {colorEntries.map(([name, value]) => (
                          <div key={name} className="flex flex-col items-center gap-1">
                            <div
                              className="h-7 w-7 rounded-md border"
                              style={{ backgroundColor: String(value) }}
                              title={`${name}: ${value}`}
                              data-testid={`swatch-${theme.id}-${name}`}
                            />
                            <span className="text-[10px] text-muted-foreground">{name}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="space-y-1 text-xs text-muted-foreground mb-4">
                      {tokens.fontFamily && (
                        <p data-testid={`text-font-${theme.id}`}>Font: {tokens.fontFamily}</p>
                      )}
                      {tokens.borderRadius && (
                        <p data-testid={`text-radius-${theme.id}`}>Radius: {tokens.borderRadius}</p>
                      )}
                    </div>

                    {!theme.isActive && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => activateMutation.mutate(theme.id)}
                        disabled={activateMutation.isPending}
                        data-testid={`button-activate-theme-${theme.id}`}
                      >
                        {activateMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : null}
                        Activate
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
