import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus, Loader2, Trash2, Pencil, MapPin, FolderOpen, Image as ImageIcon, X,
} from "lucide-react";
import { useState } from "react";
import type { CrmProject } from "@shared/schema";
import AdminLayout from "@/components/admin/admin-layout";

function MediaPicker({ images, onChange }: { images: { url: string; label?: string }[]; onChange: (imgs: { url: string; label?: string }[]) => void }) {
  const { data: mediaItems } = useQuery<{ items: { id: string; url: string; filename: string }[]; total: number }>({
    queryKey: ["/api/admin/cms/media", { page: 1, pageSize: 50 }],
    queryFn: async () => {
      const res = await fetch("/api/admin/cms/media?page=1&pageSize=50", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load media");
      return res.json();
    },
  });
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-2">
      <Label>Before/After Images</Label>
      <div className="flex flex-wrap gap-2">
        {images.map((img, i) => (
          <div key={i} className="relative w-20 h-20 rounded-md overflow-hidden border group">
            <img src={img.url} alt={img.label || ""} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => onChange(images.filter((_, j) => j !== i))}
              className="absolute top-0.5 right-0.5 p-0.5 bg-black/60 rounded-full text-white invisible group-hover:visible"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button
              type="button"
              className="w-20 h-20 rounded-md border border-dashed flex items-center justify-center text-muted-foreground hover:bg-muted/30 transition-colors"
              data-testid="button-add-project-image"
            >
              <ImageIcon className="h-5 w-5" />
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[70vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Select from Media Library</DialogTitle></DialogHeader>
            <div className="grid grid-cols-4 gap-2 mt-2">
              {(mediaItems?.items || []).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onChange([...images, { url: item.url, label: item.filename }]);
                    setOpen(false);
                  }}
                  className="aspect-square rounded-md overflow-hidden border hover-elevate"
                  data-testid={`media-pick-${item.id}`}
                >
                  <img src={item.url} alt={item.filename} className="w-full h-full object-cover" />
                </button>
              ))}
              {(!mediaItems?.items || mediaItems.items.length === 0) && (
                <p className="col-span-4 text-sm text-muted-foreground text-center py-6">No media uploaded yet. Upload images in CMS &gt; Media.</p>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

function ProjectForm({
  project,
  onClose,
}: {
  project?: CrmProject;
  onClose: () => void;
}) {
  const { toast } = useToast();
  const [title, setTitle] = useState(project?.title || "");
  const [location, setLocation] = useState(project?.location || "");
  const [summary, setSummary] = useState(project?.summary || "");
  const [services, setServices] = useState((project?.services as string[] || []).join(", "));
  const [publish, setPublish] = useState(project?.publish || false);
  const [beforeAfter, setBeforeAfter] = useState<{ url: string; label?: string }[]>(
    (project?.beforeAfter as any[]) || []
  );

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/admin/projects", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/projects"] });
      toast({ title: "Project created" });
      onClose();
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("PATCH", `/api/admin/projects/${project!.id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/projects"] });
      toast({ title: "Project updated" });
      onClose();
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      title,
      location: location || null,
      summary: summary || null,
      services: services.split(",").map(s => s.trim()).filter(Boolean),
      publish,
      beforeAfter,
    };
    if (project) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="proj-title">Title</Label>
        <Input id="proj-title" value={title} onChange={e => setTitle(e.target.value)} required data-testid="input-project-title" />
      </div>
      <div>
        <Label htmlFor="proj-location">Location</Label>
        <Input id="proj-location" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Huntersville, NC" data-testid="input-project-location" />
      </div>
      <div>
        <Label htmlFor="proj-summary">Summary</Label>
        <Textarea id="proj-summary" value={summary} onChange={e => setSummary(e.target.value)} rows={3} data-testid="input-project-summary" />
      </div>
      <div>
        <Label htmlFor="proj-services">Services (comma-separated)</Label>
        <Input id="proj-services" value={services} onChange={e => setServices(e.target.value)} placeholder="Forestry Mulching, Trail Cutting" data-testid="input-project-services" />
      </div>
      <MediaPicker images={beforeAfter} onChange={setBeforeAfter} />
      <div className="flex items-center gap-2">
        <Switch checked={publish} onCheckedChange={setPublish} id="proj-publish" data-testid="switch-project-publish" />
        <Label htmlFor="proj-publish">Published (visible on public pages)</Label>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onClose} data-testid="button-project-cancel">Cancel</Button>
        <Button type="submit" disabled={isPending} data-testid="button-project-save">
          {isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {project ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  );
}

export default function AdminCrmProjects() {
  const { data: projects, isLoading } = useQuery<CrmProject[]>({
    queryKey: ["/api/admin/projects"],
  });
  const { toast } = useToast();
  const [editingProject, setEditingProject] = useState<CrmProject | null>(null);
  const [creating, setCreating] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/projects/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/projects"] });
      toast({ title: "Project deleted" });
    },
  });

  return (
    <AdminLayout>
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold" data-testid="text-projects-heading">Projects</h1>
            <p className="text-sm text-muted-foreground">Convert completed leads into portfolio projects for your public gallery.</p>
          </div>
          <Dialog open={creating} onOpenChange={setCreating}>
            <DialogTrigger asChild>
              <Button data-testid="button-create-project"><Plus className="h-4 w-4 mr-2" />New Project</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
              <DialogHeader><DialogTitle>New Project</DialogTitle></DialogHeader>
              <ProjectForm onClose={() => setCreating(false)} />
            </DialogContent>
          </Dialog>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {!isLoading && (!projects || projects.length === 0) && (
          <Card className="p-10 text-center">
            <FolderOpen className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">No projects yet. Create one or convert a lead.</p>
          </Card>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          {(projects || []).map((project) => (
            <Card key={project.id} className="p-4 space-y-3" data-testid={`card-project-${project.id}`}>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="font-semibold truncate">{project.title}</h3>
                  {project.location && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5"><MapPin className="h-3 w-3 shrink-0" />{project.location}</p>
                  )}
                </div>
                <Badge variant={project.publish ? "default" : "secondary"}>
                  {project.publish ? "Published" : "Draft"}
                </Badge>
              </div>

              {project.summary && <p className="text-sm text-muted-foreground line-clamp-2">{project.summary}</p>}

              {Array.isArray(project.services) && (project.services as string[]).length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {(project.services as string[]).map((s, i) => (
                    <Badge key={i} variant="outline" className="text-xs">{s}</Badge>
                  ))}
                </div>
              )}

              {Array.isArray(project.beforeAfter) && (project.beforeAfter as any[]).length > 0 && (
                <div className="flex gap-1 overflow-x-auto">
                  {(project.beforeAfter as any[]).slice(0, 4).map((img: any, i: number) => (
                    <img key={i} src={img.url} alt={img.label || ""} className="w-14 h-14 rounded-md object-cover shrink-0" />
                  ))}
                  {(project.beforeAfter as any[]).length > 4 && (
                    <div className="w-14 h-14 rounded-md bg-muted flex items-center justify-center text-xs text-muted-foreground shrink-0">
                      +{(project.beforeAfter as any[]).length - 4}
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center gap-2 pt-1">
                <Dialog open={editingProject?.id === project.id} onOpenChange={(o) => !o && setEditingProject(null)}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline" onClick={() => setEditingProject(project)} data-testid={`button-edit-project-${project.id}`}>
                      <Pencil className="h-3.5 w-3.5 mr-1.5" />Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
                    <DialogHeader><DialogTitle>Edit Project</DialogTitle></DialogHeader>
                    <ProjectForm project={project} onClose={() => setEditingProject(null)} />
                  </DialogContent>
                </Dialog>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => deleteMutation.mutate(project.id)}
                  disabled={deleteMutation.isPending}
                  data-testid={`button-delete-project-${project.id}`}
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1.5" />Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
