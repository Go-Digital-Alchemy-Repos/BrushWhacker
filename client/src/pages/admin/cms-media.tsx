import { useState, useMemo, useCallback, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import AdminLayout from "@/components/admin/admin-layout";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Image, Upload, Trash2, Loader2, Search, Copy, X,
  FileImage, ChevronLeft, ChevronRight, Check
} from "lucide-react";
import type { CmsMediaItem } from "@shared/schema";

interface MediaResponse {
  items: CmsMediaItem[];
  total: number;
}

function formatBytes(bytes: number | null | undefined): string {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AdminCmsMedia() {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState<CmsMediaItem | null>(null);
  const [editAlt, setEditAlt] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editTags, setEditTags] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { toast } = useToast();
  const pageSize = 24;

  const { data, isLoading } = useQuery<MediaResponse>({
    queryKey: ["/api/admin/cms/media", { search, page, pageSize }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      params.set("page", String(page));
      params.set("pageSize", String(pageSize));
      const res = await fetch(`/api/admin/cms/media?${params}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch media");
      return res.json();
    },
  });

  const items = data?.items || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / pageSize);

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/cms/media/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/cms/media"] });
      toast({ title: "Media deleted" });
      if (selectedItem) setSelectedItem(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, alt, title, tags }: { id: string; alt: string; title: string; tags: string[] }) => {
      const res = await apiRequest("PATCH", `/api/admin/cms/media/${id}`, { alt, title, tags });
      return res.json();
    },
    onSuccess: (updated: CmsMediaItem) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/cms/media"] });
      setSelectedItem(updated);
      toast({ title: "Media updated" });
    },
  });

  function selectItem(item: CmsMediaItem) {
    setSelectedItem(item);
    setEditAlt(item.alt || "");
    setEditTitle(item.title || "");
    setEditTags(Array.isArray(item.tags) ? (item.tags as string[]).join(", ") : "");
  }

  function copyUrl(url: string, id: string) {
    const full = url.startsWith("http") ? url : `${window.location.origin}${url}`;
    navigator.clipboard.writeText(full);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast({ title: "URL copied to clipboard" });
  }

  return (
    <AdminLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <div className="flex items-center gap-3">
            <Image className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold" data-testid="text-admin-media-title">Media Library</h1>
            <Badge variant="secondary">{total} items</Badge>
          </div>
          <Button className="gap-2" onClick={() => setUploadDialogOpen(true)} data-testid="button-upload-media">
            <Upload className="h-4 w-4" /> Upload
          </Button>
        </div>

        <div className="flex items-center gap-4 mb-6 flex-wrap">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search media..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-9"
              data-testid="input-search-media"
            />
          </div>
          {totalPages > 1 && (
            <div className="flex items-center gap-2 ml-auto">
              <Button
                variant="outline"
                size="icon"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                data-testid="button-media-prev-page"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                data-testid="button-media-next-page"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        <div className="flex gap-6">
          <div className="flex-1 min-w-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : items.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground" data-testid="text-media-empty">
                  {search ? "No media items match your search." : "No media items yet. Upload your first image to get started."}
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className={`group cursor-pointer rounded-md border overflow-hidden transition-colors ${
                      selectedItem?.id === item.id
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-border"
                    }`}
                    onClick={() => selectItem(item)}
                    data-testid={`card-media-${item.id}`}
                  >
                    <div className="aspect-square bg-muted overflow-hidden relative">
                      <img
                        src={item.url}
                        alt={item.alt || item.title || ""}
                        className="w-full h-full object-cover"
                        data-testid={`img-media-${item.id}`}
                      />
                      <div className="absolute top-1.5 right-1.5 flex gap-1 invisible group-hover:visible">
                        <Button
                          variant="secondary"
                          size="icon"
                          className="h-7 w-7"
                          onClick={(e) => { e.stopPropagation(); copyUrl(item.url, item.id); }}
                          data-testid={`button-copy-url-${item.id}`}
                        >
                          {copiedId === item.id ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                        </Button>
                      </div>
                    </div>
                    <div className="p-2">
                      <p className="text-xs font-medium truncate" data-testid={`text-media-title-${item.id}`}>
                        {item.title || "Untitled"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {item.mimeType?.split("/")[1]?.toUpperCase() || "IMAGE"} {formatBytes(item.sizeBytes)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {selectedItem && (
            <div className="w-72 shrink-0">
              <Card>
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="font-semibold text-sm">Details</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedItem(null)}
                      data-testid="button-close-detail"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="aspect-video bg-muted rounded-md overflow-hidden">
                    <img
                      src={selectedItem.url}
                      alt={selectedItem.alt || ""}
                      className="w-full h-full object-contain"
                      data-testid="img-detail-preview"
                    />
                  </div>

                  <div className="text-xs text-muted-foreground space-y-1">
                    {selectedItem.width && selectedItem.height && (
                      <p>{selectedItem.width} x {selectedItem.height}px</p>
                    )}
                    <p>{selectedItem.mimeType || "Unknown type"}</p>
                    <p>{formatBytes(selectedItem.sizeBytes)}</p>
                  </div>

                  <div>
                    <Label className="text-xs">Title</Label>
                    <Input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      data-testid="input-detail-title"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Alt Text</Label>
                    <Textarea
                      value={editAlt}
                      onChange={(e) => setEditAlt(e.target.value)}
                      rows={2}
                      data-testid="textarea-detail-alt"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Tags (comma-separated)</Label>
                    <Input
                      value={editTags}
                      onChange={(e) => setEditTags(e.target.value)}
                      placeholder="landscape, nature"
                      data-testid="input-detail-tags"
                    />
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <Button
                      size="sm"
                      onClick={() => updateMutation.mutate({
                        id: selectedItem.id,
                        alt: editAlt,
                        title: editTitle,
                        tags: editTags.split(",").map((t) => t.trim()).filter(Boolean),
                      })}
                      disabled={updateMutation.isPending}
                      data-testid="button-save-detail"
                    >
                      {updateMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : null}
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1"
                      onClick={() => copyUrl(selectedItem.url, selectedItem.id)}
                      data-testid="button-copy-detail-url"
                    >
                      <Copy className="h-3.5 w-3.5" /> Copy URL
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1 text-destructive ml-auto"
                      onClick={() => {
                        if (confirm("Delete this media item?")) deleteMutation.mutate(selectedItem.id);
                      }}
                      data-testid="button-delete-detail"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        <UploadDialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen} />
      </div>
    </AdminLayout>
  );
}

function UploadDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<Record<string, "pending" | "uploading" | "done" | "error">>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const { toast } = useToast();

  const handleFiles = useCallback((newFiles: FileList | File[]) => {
    const valid = Array.from(newFiles).filter((f) =>
      ["image/jpeg", "image/png", "image/webp"].includes(f.type) && f.size <= 10 * 1024 * 1024
    );
    if (valid.length < newFiles.length) {
      toast({ title: "Some files were skipped", description: "Only JPEG, PNG, and WebP under 10MB are allowed." });
    }
    setFiles((prev) => [...prev, ...valid]);
  }, [toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  async function uploadAll() {
    if (files.length === 0) return;
    setUploading(true);
    const newProgress: Record<string, "pending" | "uploading" | "done" | "error"> = {};
    files.forEach((f) => { newProgress[f.name] = "pending"; });
    setProgress(newProgress);

    for (const file of files) {
      setProgress((p) => ({ ...p, [file.name]: "uploading" }));
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", file.name.replace(/\.[^.]+$/, ""));
      try {
        const res = await fetch("/api/admin/cms/media/upload", {
          method: "POST",
          body: formData,
          credentials: "include",
        });
        if (!res.ok) throw new Error(await res.text());
        setProgress((p) => ({ ...p, [file.name]: "done" }));
      } catch {
        setProgress((p) => ({ ...p, [file.name]: "error" }));
      }
    }

    queryClient.invalidateQueries({ queryKey: ["/api/admin/cms/media"] });
    setUploading(false);

    const allDone = files.every((f) => progress[f.name] !== "error");
    toast({ title: allDone ? "All uploads complete" : "Some uploads failed" });

    setTimeout(() => {
      setFiles([]);
      setProgress({});
      onOpenChange(false);
    }, 1000);
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!uploading) { onOpenChange(v); setFiles([]); setProgress({}); } }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Upload Media</DialogTitle>
        </DialogHeader>

        <div
          className={`border-2 border-dashed rounded-md p-8 text-center transition-colors cursor-pointer ${
            dragOver ? "border-primary bg-primary/5" : "border-border"
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          data-testid="dropzone-upload"
        >
          <FileImage className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
          <p className="text-sm font-medium">Drop images here or click to browse</p>
          <p className="text-xs text-muted-foreground mt-1">JPEG, PNG, WebP up to 10MB</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
            onChange={(e) => { if (e.target.files) handleFiles(e.target.files); e.target.value = ""; }}
            data-testid="input-file-upload"
          />
        </div>

        {files.length > 0 && (
          <div className="max-h-48 overflow-y-auto space-y-2">
            {files.map((file, idx) => (
              <div key={`${file.name}-${idx}`} className="flex items-center gap-3 text-sm">
                <FileImage className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="truncate flex-1">{file.name}</span>
                <span className="text-xs text-muted-foreground shrink-0">{formatBytes(file.size)}</span>
                {progress[file.name] === "uploading" && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
                {progress[file.name] === "done" && <Check className="h-4 w-4 text-green-600" />}
                {progress[file.name] === "error" && <X className="h-4 w-4 text-destructive" />}
                {!uploading && (
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeFile(idx)}>
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}

        <DialogFooter>
          <Button
            onClick={uploadAll}
            disabled={files.length === 0 || uploading}
            className="gap-2"
            data-testid="button-start-upload"
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {uploading ? "Uploading..." : `Upload ${files.length} file${files.length !== 1 ? "s" : ""}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}