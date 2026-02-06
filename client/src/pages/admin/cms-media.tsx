import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger
} from "@/components/ui/dialog";
import AdminLayout from "@/components/admin/admin-layout";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Image, Plus, Trash2, Loader2, Search } from "lucide-react";
import type { CmsMediaItem } from "@shared/schema";

export default function AdminCmsMedia() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [alt, setAlt] = useState("");
  const [title, setTitle] = useState("");
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  const { data: media = [], isLoading } = useQuery<CmsMediaItem[]>({
    queryKey: ["/api/admin/cms/media"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: { url: string; alt: string; title: string }) => {
      const res = await apiRequest("POST", "/api/admin/cms/media", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/cms/media"] });
      toast({ title: "Media added" });
      setDialogOpen(false);
      setUrl("");
      setAlt("");
      setTitle("");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/cms/media/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/cms/media"] });
      toast({ title: "Media deleted" });
    },
  });

  const filtered = useMemo(() => {
    if (!search) return media;
    const q = search.toLowerCase();
    return media.filter(
      (item) =>
        (item.title || "").toLowerCase().includes(q) ||
        (item.alt || "").toLowerCase().includes(q)
    );
  }, [media, search]);

  return (
    <AdminLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <div className="flex items-center gap-3">
            <Image className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold" data-testid="text-admin-media-title">Media Library</h1>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" data-testid="button-add-media">
                <Plus className="h-4 w-4" /> Add Media
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Media</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label htmlFor="media-url">URL</Label>
                  <Input
                    id="media-url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    data-testid="input-media-url"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="media-title">Title</Label>
                  <Input
                    id="media-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Image title"
                    data-testid="input-media-title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="media-alt">Alt Text</Label>
                  <Input
                    id="media-alt"
                    value={alt}
                    onChange={(e) => setAlt(e.target.value)}
                    placeholder="Descriptive alt text"
                    data-testid="input-media-alt"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={() => createMutation.mutate({ url, alt, title })}
                  disabled={!url || createMutation.isPending}
                  data-testid="button-submit-media"
                >
                  {createMutation.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                  Add
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mb-6">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search media..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
              data-testid="input-search-media"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : filtered.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground" data-testid="text-media-empty">
              {search ? "No media items match your search." : "No media items yet. Add your first image to get started."}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((item) => (
              <Card key={item.id} className="overflow-visible" data-testid={`card-media-${item.id}`}>
                <CardContent className="p-0">
                  <div className="aspect-square bg-muted rounded-t-md overflow-hidden">
                    <img
                      src={item.url}
                      alt={item.alt || item.title || ""}
                      className="w-full h-full object-cover"
                      data-testid={`img-media-${item.id}`}
                    />
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium truncate" data-testid={`text-media-title-${item.id}`}>
                      {item.title || "Untitled"}
                    </p>
                    {item.alt && (
                      <p className="text-xs text-muted-foreground truncate mt-0.5">{item.alt}</p>
                    )}
                    <div className="mt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1 text-destructive"
                        onClick={() => {
                          if (confirm("Delete this media item?")) deleteMutation.mutate(item.id);
                        }}
                        data-testid={`button-delete-media-${item.id}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </Button>
                    </div>
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
