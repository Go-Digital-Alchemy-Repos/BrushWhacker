import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Loader2, Save, Globe, Mail, MessageSquare } from "lucide-react";
import type { SiteSettings } from "@shared/schema";

export default function AdminSettings() {
  const { toast } = useToast();
  const { data: settings, isLoading } = useQuery<SiteSettings>({
    queryKey: ["/api/admin/settings"],
  });

  const mutation = useMutation({
    mutationFn: async (values: Partial<SiteSettings>) => {
      const res = await apiRequest("PUT", "/api/admin/settings", values);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/settings"] });
      toast({ title: "Settings updated successfully" });
    },
  });

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">System Settings</h1>
        </div>

        <Tabs defaultValue="integrations" className="space-y-6">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Globe className="h-5 w-5" /> General Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label>Company Name</Label>
                  <Input 
                    defaultValue={settings?.companyName}
                    onBlur={(e) => mutation.mutate({ companyName: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" /> ChatGPT API
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <Label>OpenAI API Key</Label>
                    <Input 
                      type="password"
                      placeholder="sk-..."
                      defaultValue={settings?.chatgptApiKey || ""}
                      onBlur={(e) => mutation.mutate({ chatgptApiKey: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground">
                      Required for the SEO AI Assistant and content generation features.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Mail className="h-5 w-5 text-primary" /> Mailgun
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <Label>API Key</Label>
                      <Input 
                        type="password"
                        placeholder="key-..."
                        defaultValue={settings?.mailgunApiKey || ""}
                        onBlur={(e) => mutation.mutate({ mailgunApiKey: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Domain</Label>
                      <Input 
                        placeholder="mg.yourdomain.com"
                        defaultValue={settings?.mailgunDomain || ""}
                        onBlur={(e) => mutation.mutate({ mailgunDomain: e.target.value })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
