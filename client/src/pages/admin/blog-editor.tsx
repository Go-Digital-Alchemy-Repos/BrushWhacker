import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminLayout from "@/components/admin/admin-layout";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Eye, FileText } from "lucide-react";
import DOMPurify from "dompurify";
import type { BlogPost } from "@shared/schema";

const CATEGORIES = [
  "Forestry Mulching", "Land Clearing", "Brush Removal", "Lot Clearing",
  "Storm Cleanup", "Stump Grinding", "Driveway/Trail Cutting", "Pricing",
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function renderMarkdown(md: string): string {
  return md
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold mt-6 mb-2">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-semibold mt-8 mb-3">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary underline">$1</a>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
    .replace(/(<li.*<\/li>\n?)+/g, (match) => `<ul class="my-3 space-y-1">${match}</ul>`)
    .replace(/\n\n/g, '</p><p class="mb-4 text-muted-foreground leading-relaxed">')
    .replace(/^(?!<[hul])/m, '<p class="mb-4 text-muted-foreground leading-relaxed">')
    + '</p>';
}

export default function AdminBlogEditor() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const isNew = id === "new";

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [featuredImageUrl, setFeaturedImageUrl] = useState("");
  const [status, setStatus] = useState("draft");
  const [slugManual, setSlugManual] = useState(false);

  const { data: post, isLoading } = useQuery<BlogPost>({
    queryKey: ["/api/admin/blog", id],
    queryFn: () => fetch(`/api/admin/blog/${id}`, { credentials: "include" }).then(r => r.json()),
    enabled: !isNew,
  });

  useEffect(() => {
    if (post && !isNew) {
      setTitle(post.title);
      setSlug(post.slug);
      setExcerpt(post.excerpt);
      setContent(post.content);
      setCategory(post.category);
      setTags((post.tags || []).join(", "));
      setFeaturedImageUrl(post.featuredImageUrl || "");
      setStatus(post.status);
      setSlugManual(true);
    }
  }, [post, isNew]);

  useEffect(() => {
    if (!slugManual && title) {
      setSlug(slugify(title));
    }
  }, [title, slugManual]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const body = {
        title,
        slug,
        excerpt,
        content,
        category,
        tags: tags.split(",").map(t => t.trim()).filter(Boolean),
        featuredImageUrl: featuredImageUrl || null,
        status,
        publishedAt: status === "published" ? (post?.publishedAt || new Date().toISOString()) : null,
      };
      if (isNew) {
        return apiRequest("POST", "/api/admin/blog", body);
      }
      return apiRequest("PATCH", `/api/admin/blog/${id}`, body);
    },
    onSuccess: async (res) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog"] });
      toast({ title: isNew ? "Post created" : "Post saved" });
      if (isNew) {
        const data = await res.json();
        navigate(`/admin/cms/blog/${data.id}`);
      }
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message || "Failed to save post", variant: "destructive" });
    },
  });

  if (!isNew && isLoading) {
    return (
      <AdminLayout>
        <div className="p-6 max-w-4xl mx-auto">
          <div className="h-8 bg-muted/30 animate-pulse rounded w-1/3 mb-6" />
          <div className="h-96 bg-muted/30 animate-pulse rounded" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/admin/cms/blog")} data-testid="button-back-to-list">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold" data-testid="text-editor-title">
              {isNew ? "New Post" : "Edit Post"}
            </h1>
            <Badge variant={status === "published" ? "default" : "secondary"}>{status}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-[130px]" data-testid="select-post-status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending || !title || !slug || !excerpt || !content || !category}
              className="gap-2"
              data-testid="button-save-post"
            >
              <Save className="h-4 w-4" />
              {saveMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Post title"
              data-testid="input-post-title"
            />
          </div>

          <div>
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => { setSlug(e.target.value); setSlugManual(true); }}
              placeholder="post-url-slug"
              data-testid="input-post-slug"
            />
            <p className="text-xs text-muted-foreground mt-1">URL: /blog/{slug || "..."}</p>
          </div>

          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger data-testid="select-post-category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="charlotte, land clearing, tips"
                data-testid="input-post-tags"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Brief description for blog listing..."
              rows={2}
              data-testid="textarea-post-excerpt"
            />
          </div>

          <div>
            <Label htmlFor="featuredImage">Featured Image URL</Label>
            <Input
              id="featuredImage"
              value={featuredImageUrl}
              onChange={(e) => setFeaturedImageUrl(e.target.value)}
              placeholder="https://..."
              data-testid="input-post-image"
            />
          </div>

          <div>
            <Tabs defaultValue="write">
              <div className="flex items-center justify-between gap-2 mb-2">
                <Label>Content (Markdown)</Label>
                <TabsList>
                  <TabsTrigger value="write" className="gap-1">
                    <FileText className="h-3 w-3" /> Write
                  </TabsTrigger>
                  <TabsTrigger value="preview" className="gap-1">
                    <Eye className="h-3 w-3" /> Preview
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="write">
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your post in markdown..."
                  rows={20}
                  className="font-mono text-sm"
                  data-testid="textarea-post-content"
                />
              </TabsContent>
              <TabsContent value="preview">
                <Card>
                  <CardContent className="p-6 prose prose-slate dark:prose-invert max-w-none" data-testid="div-post-preview">
                    <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(renderMarkdown(content || "*No content yet*")) }} />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
