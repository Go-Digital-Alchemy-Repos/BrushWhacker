import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger
} from "@/components/ui/dialog";
import AdminLayout from "@/components/admin/admin-layout";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { LayoutTemplate, Plus, Pencil, Trash2, Loader2, Calendar, Layers } from "lucide-react";
import type { CmsTemplate } from "@shared/schema";

export default function AdminCmsTemplates() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { toast } = useToast();

  const { data: templates = [], isLoading } = useQuery<CmsTemplate[]>({
    queryKey: ["/api/admin/cms/templates"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: { name: string; description: string }) => {
      const res = await apiRequest("POST", "/api/admin/cms/templates", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/cms/templates"] });
      toast({ title: "Template created" });
      setDialogOpen(false);
      setName("");
      setDescription("");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/cms/templates/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/cms/templates"] });
      toast({ title: "Template deleted" });
    },
  });

  return (
    <AdminLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <div className="flex items-center gap-3">
            <LayoutTemplate className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold" data-testid="text-admin-templates-title">Templates</h1>
            <Badge variant="secondary">{templates.length} templates</Badge>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" data-testid="button-new-template">
                <Plus className="h-4 w-4" /> New Template
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Template</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label htmlFor="template-name">Name</Label>
                  <Input
                    id="template-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Service Page"
                    data-testid="input-template-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="template-description">Description</Label>
                  <Textarea
                    id="template-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description of this template"
                    data-testid="input-template-description"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={() => createMutation.mutate({ name, description })}
                  disabled={!name || createMutation.isPending}
                  data-testid="button-submit-template"
                >
                  {createMutation.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                  Create
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : templates.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              No templates yet. Create your first template to get started.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {templates.map((template) => (
              <Card key={template.id} className="hover-elevate" data-testid={`card-template-${template.id}`}>
                <CardContent className="p-4 flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-medium" data-testid={`text-template-name-${template.id}`}>{template.name}</h3>
                      <Badge variant={template.status === "active" ? "default" : "secondary"} data-testid={`badge-template-status-${template.id}`}>
                        {template.status}
                      </Badge>
                    </div>
                    {template.description && (
                      <p className="text-sm text-muted-foreground truncate">{template.description}</p>
                    )}
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Layers className="h-3 w-3" />
                        {Array.isArray(template.blocks) ? (template.blocks as unknown[]).length : 0} blocks
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(template.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/cms/templates/${template.id}`}>
                      <Button variant="ghost" size="icon" data-testid={`button-edit-template-${template.id}`}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        if (confirm("Delete this template?")) deleteMutation.mutate(template.id);
                      }}
                      data-testid={`button-delete-template-${template.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
