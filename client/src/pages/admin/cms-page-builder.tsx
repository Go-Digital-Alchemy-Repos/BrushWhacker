import { useState, useEffect, useMemo } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  DndContext, DragOverlay, closestCenter,
  KeyboardSensor, PointerSensor, useSensor, useSensors,
  DragStartEvent, DragEndEvent, DragOverEvent
} from "@dnd-kit/core";
import {
  SortableContext, sortableKeyboardCoordinates,
  verticalListSortingStrategy, useSortable, arrayMove
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminLayout from "@/components/admin/admin-layout";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  GripVertical, Plus, Trash2, Copy, Save, Eye, ArrowLeft,
  Settings, Search, ChevronDown, Type, Image, Layout, Loader2
} from "lucide-react";
import type { BlockInstance, CmsPage, CmsBlock } from "@shared/schema";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

interface SortableBlockProps {
  block: BlockInstance;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

function SortableBlock({ block, isSelected, onSelect, onDelete, onDuplicate }: SortableBlockProps) {
  const {
    attributes, listeners, setNodeRef, transform, transition, isDragging
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const propsPreview = Object.entries(block.props || {})
    .filter(([, v]) => typeof v === "string")
    .slice(0, 2)
    .map(([k, v]) => `${k}: ${String(v).slice(0, 40)}${String(v).length > 40 ? "..." : ""}`)
    .join(" | ");

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative rounded-md border transition-colors cursor-pointer ${
        isSelected
          ? "border-primary bg-primary/5 ring-1 ring-primary/20"
          : "border-border bg-card hover-elevate"
      }`}
      onClick={onSelect}
      data-testid={`canvas-block-${block.id}`}
    >
      <div className="flex items-start gap-2 p-3">
        <button
          className="mt-0.5 cursor-grab text-muted-foreground hover:text-foreground shrink-0"
          {...attributes}
          {...listeners}
          data-testid={`drag-handle-${block.id}`}
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-sm" data-testid={`text-block-label-${block.id}`}>
              {block.meta?.label || block.type}
            </span>
            <Badge variant="secondary" className="text-xs">
              {block.type}
            </Badge>
          </div>
          {propsPreview && (
            <p className="text-xs text-muted-foreground mt-1 truncate">
              {propsPreview}
            </p>
          )}
        </div>
        <div className="flex items-center gap-0.5 shrink-0 invisible group-hover:visible">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => { e.stopPropagation(); onDuplicate(); }}
            data-testid={`button-duplicate-block-${block.id}`}
          >
            <Copy className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            data-testid={`button-delete-block-${block.id}`}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function BlockOverlay({ block }: { block: BlockInstance }) {
  return (
    <div className="rounded-md border border-primary bg-card shadow-lg p-3 w-64">
      <div className="flex items-center gap-2">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
        <span className="font-medium text-sm">{block.meta?.label || block.type}</span>
        <Badge variant="secondary" className="text-xs">{block.type}</Badge>
      </div>
    </div>
  );
}

function LibraryBlockOverlay({ name, type }: { name: string; type: string }) {
  return (
    <div className="rounded-md border border-primary bg-card shadow-lg p-3 w-56">
      <div className="flex items-center gap-2">
        <Plus className="h-4 w-4 text-primary" />
        <span className="font-medium text-sm">{name}</span>
        <Badge variant="secondary" className="text-xs">{type}</Badge>
      </div>
    </div>
  );
}

export default function CmsPageBuilder() {
  const [, matchNew] = useRoute("/admin/cms/pages/new");
  const [, matchEdit] = useRoute("/admin/cms/pages/:id");
  const pageId = matchEdit?.id;
  const isNew = !!matchNew;
  const editId = !isNew && pageId ? pageId : null;

  const [, navigate] = useLocation();
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugManual, setSlugManual] = useState(false);
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("draft");
  const [blocks, setBlocks] = useState<BlockInstance[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showLeftPanel, setShowLeftPanel] = useState(true);
  const [showRightPanel, setShowRightPanel] = useState(true);

  const [seoTitle, setSeoTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [ogTitle, setOgTitle] = useState("");
  const [ogDescription, setOgDescription] = useState("");
  const [ogImage, setOgImage] = useState("");

  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [activeDragSource, setActiveDragSource] = useState<"canvas" | "library" | null>(null);
  const [activeLibraryBlock, setActiveLibraryBlock] = useState<CmsBlock | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const { data: libraryBlocks = [], isLoading: blocksLoading } = useQuery<CmsBlock[]>({
    queryKey: ["/api/admin/cms/blocks"],
  });

  const { data: existingPage, isLoading: pageLoading } = useQuery<CmsPage>({
    queryKey: ["/api/admin/cms/pages", editId],
    enabled: !!editId,
  });

  useEffect(() => {
    if (existingPage && editId) {
      setTitle(existingPage.title);
      setSlug(existingPage.slug);
      setSlugManual(true);
      setDescription(existingPage.description || "");
      setStatus(existingPage.status);
      setBlocks(Array.isArray(existingPage.blocks) ? existingPage.blocks as BlockInstance[] : []);
      const seo = (existingPage.seo || {}) as Record<string, any>;
      setSeoTitle(seo.title || "");
      setMetaDescription(seo.metaDescription || seo.description || "");
      setOgTitle(seo.ogTitle || seo.og?.title || "");
      setOgDescription(seo.ogDescription || seo.og?.description || "");
      setOgImage(seo.ogImage || seo.og?.image || "");
    }
  }, [existingPage, editId]);

  useEffect(() => {
    if (!slugManual && title) {
      setSlug(slugify(title));
    }
  }, [title, slugManual]);

  const selectedBlock = useMemo(
    () => blocks.find((b) => b.id === selectedBlockId) || null,
    [blocks, selectedBlockId]
  );

  const selectedBlockDef = useMemo(() => {
    if (!selectedBlock) return null;
    return libraryBlocks.find((lb) => lb.key === selectedBlock.type) || null;
  }, [selectedBlock, libraryBlocks]);

  const groupedBlocks = useMemo(() => {
    const filtered = searchQuery
      ? libraryBlocks.filter(
          (b) =>
            b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            b.key.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : libraryBlocks;
    const groups: Record<string, CmsBlock[]> = {};
    for (const block of filtered) {
      const cat = block.category || "Other";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(block);
    }
    return groups;
  }, [libraryBlocks, searchQuery]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        title,
        slug,
        description: description || undefined,
        status,
        pageType: "page" as const,
        blocks,
        seo: { title: seoTitle, metaDescription, ogTitle, ogDescription, ogImage },
      };
      if (editId) {
        return apiRequest("PATCH", `/api/admin/cms/pages/${editId}`, payload);
      }
      return apiRequest("POST", "/api/admin/cms/pages", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/cms/pages"] });
      toast({ title: editId ? "Page updated" : "Page created" });
      navigate("/admin/cms/pages");
    },
    onError: (err: any) => {
      toast({
        title: "Error",
        description: err.message || "Failed to save page",
        variant: "destructive",
      });
    },
  });

  function handleDragStart(event: DragStartEvent) {
    const id = String(event.active.id);
    if (id.startsWith("library-")) {
      const blockKey = id.replace("library-", "");
      const libBlock = libraryBlocks.find((b) => b.key === blockKey);
      setActiveDragSource("library");
      setActiveDragId(id);
      setActiveLibraryBlock(libBlock || null);
    } else {
      setActiveDragSource("canvas");
      setActiveDragId(id);
      setActiveLibraryBlock(null);
    }
  }

  function handleDragOver(_event: DragOverEvent) {}

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (activeDragSource === "library" && activeLibraryBlock) {
      const newBlock: BlockInstance = {
        id: crypto.randomUUID(),
        type: activeLibraryBlock.key,
        props: { ...(activeLibraryBlock.defaultProps as Record<string, any> || {}) },
        meta: { label: activeLibraryBlock.name },
      };

      if (over) {
        const overIndex = blocks.findIndex((b) => b.id === String(over.id));
        if (overIndex >= 0) {
          const updated = [...blocks];
          updated.splice(overIndex, 0, newBlock);
          setBlocks(updated);
        } else {
          setBlocks((prev) => [...prev, newBlock]);
        }
      } else {
        setBlocks((prev) => [...prev, newBlock]);
      }
      setSelectedBlockId(newBlock.id);
    } else if (activeDragSource === "canvas" && over) {
      const oldIndex = blocks.findIndex((b) => b.id === String(active.id));
      const newIndex = blocks.findIndex((b) => b.id === String(over.id));
      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        setBlocks((prev) => arrayMove(prev, oldIndex, newIndex));
      }
    }

    setActiveDragId(null);
    setActiveDragSource(null);
    setActiveLibraryBlock(null);
  }

  function addBlockFromLibrary(libBlock: CmsBlock) {
    const newBlock: BlockInstance = {
      id: crypto.randomUUID(),
      type: libBlock.key,
      props: { ...(libBlock.defaultProps as Record<string, any> || {}) },
      meta: { label: libBlock.name },
    };
    setBlocks((prev) => [...prev, newBlock]);
    setSelectedBlockId(newBlock.id);
  }

  function deleteBlock(id: string) {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
    if (selectedBlockId === id) setSelectedBlockId(null);
  }

  function duplicateBlock(id: string) {
    const block = blocks.find((b) => b.id === id);
    if (!block) return;
    const newBlock: BlockInstance = {
      ...block,
      id: crypto.randomUUID(),
      meta: { ...block.meta, label: `${block.meta?.label || block.type} (copy)` },
    };
    const idx = blocks.findIndex((b) => b.id === id);
    const updated = [...blocks];
    updated.splice(idx + 1, 0, newBlock);
    setBlocks(updated);
    setSelectedBlockId(newBlock.id);
  }

  function updateBlockProp(blockId: string, key: string, value: any) {
    setBlocks((prev) =>
      prev.map((b) =>
        b.id === blockId ? { ...b, props: { ...b.props, [key]: value } } : b
      )
    );
  }

  const activeDragBlock = activeDragSource === "canvas"
    ? blocks.find((b) => b.id === activeDragId) || null
    : null;

  if (!isNew && pageLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" data-testid="loader-page-builder" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex flex-col h-[calc(100vh-3.5rem)]">
        <div className="sticky top-0 z-10 border-b bg-card px-4 py-2.5 flex items-center gap-3 flex-wrap">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/admin/cms/pages")}
            data-testid="button-back-to-pages"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <div className="flex-1 min-w-[200px] flex items-center gap-3 flex-wrap">
            <Input
              placeholder="Page title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="max-w-xs"
              data-testid="input-page-title"
            />
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <span>/</span>
              <Input
                placeholder="slug"
                value={slug}
                onChange={(e) => { setSlug(e.target.value); setSlugManual(true); }}
                className="w-40"
                data-testid="input-page-slug"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-[120px]" data-testid="select-page-status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowLeftPanel(!showLeftPanel)}
              className="lg:hidden"
              data-testid="button-toggle-left-panel"
            >
              <Layout className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowRightPanel(!showRightPanel)}
              className="lg:hidden"
              data-testid="button-toggle-right-panel"
            >
              <Settings className="h-4 w-4" />
            </Button>

            <Button
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending || !title || !slug}
              className="gap-2"
              data-testid="button-save-page"
            >
              <Save className="h-4 w-4" />
              {saveMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex flex-1 overflow-hidden">
            <aside
              className={`w-60 border-r bg-card flex flex-col shrink-0 overflow-hidden ${
                showLeftPanel ? "block" : "hidden lg:block"
              }`}
              data-testid="panel-block-library"
            >
              <div className="p-3 border-b">
                <h2 className="text-sm font-semibold mb-2">Blocks</h2>
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Search blocks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 text-sm"
                    data-testid="input-search-blocks"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-2 space-y-3">
                {blocksLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                ) : Object.keys(groupedBlocks).length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-4">No blocks found</p>
                ) : (
                  Object.entries(groupedBlocks).map(([category, catBlocks]) => (
                    <div key={category}>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1 mb-1">
                        {category}
                      </p>
                      <div className="space-y-1">
                        {catBlocks.map((lb) => (
                          <LibraryBlockItem
                            key={lb.key}
                            block={lb}
                            onAdd={() => addBlockFromLibrary(lb)}
                          />
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </aside>

            <div
              className="flex-1 overflow-y-auto bg-muted/30 p-4"
              data-testid="canvas-area"
            >
              {blocks.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Layout className="h-12 w-12 text-muted-foreground/40 mb-3" />
                  <p className="text-muted-foreground text-sm mb-1">No blocks added yet</p>
                  <p className="text-xs text-muted-foreground">
                    Drag blocks from the left panel or click the + button to add blocks
                  </p>
                </div>
              ) : (
                <SortableContext
                  items={blocks.map((b) => b.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2 max-w-2xl mx-auto">
                    {blocks.map((block) => (
                      <SortableBlock
                        key={block.id}
                        block={block}
                        isSelected={selectedBlockId === block.id}
                        onSelect={() => setSelectedBlockId(block.id)}
                        onDelete={() => deleteBlock(block.id)}
                        onDuplicate={() => duplicateBlock(block.id)}
                      />
                    ))}
                  </div>
                </SortableContext>
              )}
            </div>

            <aside
              className={`w-[300px] border-l bg-card flex flex-col shrink-0 overflow-hidden ${
                showRightPanel ? "block" : "hidden lg:block"
              }`}
              data-testid="panel-inspector"
            >
              <Tabs defaultValue="block" className="flex flex-col h-full">
                <div className="border-b px-3 pt-2">
                  <TabsList className="w-full">
                    <TabsTrigger value="block" className="flex-1" data-testid="tab-block">
                      Block
                    </TabsTrigger>
                    <TabsTrigger value="seo" className="flex-1" data-testid="tab-seo">
                      SEO
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="block" className="flex-1 overflow-y-auto p-3 mt-0 space-y-4">
                  {!selectedBlock ? (
                    <div className="flex flex-col items-center justify-center h-full text-center py-8">
                      <Settings className="h-8 w-8 text-muted-foreground/40 mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Select a block on the canvas to edit its properties
                      </p>
                    </div>
                  ) : (
                    <>
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <h3 className="text-sm font-semibold">
                            {selectedBlock.meta?.label || selectedBlock.type}
                          </h3>
                          <Badge variant="secondary" className="text-xs">{selectedBlock.type}</Badge>
                        </div>
                      </div>
                      <BlockPropertyEditor
                        block={selectedBlock}
                        blockDef={selectedBlockDef}
                        onPropChange={(key, value) => updateBlockProp(selectedBlock.id, key, value)}
                      />
                    </>
                  )}
                </TabsContent>

                <TabsContent value="seo" className="flex-1 overflow-y-auto p-3 mt-0 space-y-4">
                  <div>
                    <Label htmlFor="seo-title" className="text-xs">SEO Title</Label>
                    <Input
                      id="seo-title"
                      value={seoTitle}
                      onChange={(e) => setSeoTitle(e.target.value)}
                      placeholder="Page title for search engines"
                      data-testid="input-seo-title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="seo-meta-desc" className="text-xs">Meta Description</Label>
                    <Textarea
                      id="seo-meta-desc"
                      value={metaDescription}
                      onChange={(e) => setMetaDescription(e.target.value)}
                      placeholder="Brief description for search results"
                      rows={3}
                      data-testid="textarea-seo-meta-description"
                    />
                  </div>
                  <div>
                    <Label htmlFor="seo-og-title" className="text-xs">OG Title</Label>
                    <Input
                      id="seo-og-title"
                      value={ogTitle}
                      onChange={(e) => setOgTitle(e.target.value)}
                      placeholder="Open Graph title"
                      data-testid="input-seo-og-title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="seo-og-desc" className="text-xs">OG Description</Label>
                    <Textarea
                      id="seo-og-desc"
                      value={ogDescription}
                      onChange={(e) => setOgDescription(e.target.value)}
                      placeholder="Open Graph description"
                      rows={3}
                      data-testid="textarea-seo-og-description"
                    />
                  </div>
                  <div>
                    <Label htmlFor="seo-og-image" className="text-xs">OG Image URL</Label>
                    <Input
                      id="seo-og-image"
                      value={ogImage}
                      onChange={(e) => setOgImage(e.target.value)}
                      placeholder="https://..."
                      data-testid="input-seo-og-image"
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </aside>
          </div>

          <DragOverlay>
            {activeDragId && activeDragSource === "canvas" && activeDragBlock ? (
              <BlockOverlay block={activeDragBlock} />
            ) : null}
            {activeDragId && activeDragSource === "library" && activeLibraryBlock ? (
              <LibraryBlockOverlay name={activeLibraryBlock.name} type={activeLibraryBlock.key} />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </AdminLayout>
  );
}

function LibraryBlockItem({ block, onAdd }: { block: CmsBlock; onAdd: () => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useSortable({
    id: `library-${block.key}`,
    data: { type: "library", block },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  const iconMap: Record<string, any> = {
    Layers: Layout,
    FileText: Type,
    Image: Image,
    Grid3x3: Layout,
    Briefcase: Layout,
    MessageSquare: Type,
    Megaphone: Type,
    HelpCircle: Type,
    FormInput: Type,
    MapPin: Layout,
    BarChart3: Layout,
  };
  const IconComp = iconMap[block.icon || ""] || Type;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sm cursor-grab hover-elevate"
      data-testid={`library-block-${block.key}`}
    >
      <IconComp className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
      <span className="flex-1 truncate text-sm">{block.name}</span>
      <button
        className="text-muted-foreground hover:text-foreground shrink-0"
        onClick={(e) => {
          e.stopPropagation();
          onAdd();
        }}
        data-testid={`button-add-block-${block.key}`}
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

interface BlockPropertyEditorProps {
  block: BlockInstance;
  blockDef: CmsBlock | null;
  onPropChange: (key: string, value: any) => void;
}

function BlockPropertyEditor({ block, blockDef, onPropChange }: BlockPropertyEditorProps) {
  const schema = blockDef?.schema as { fields?: Array<{
    key: string;
    label: string;
    type: string;
    options?: string[];
    itemFields?: Array<{ key: string; label: string; type: string }>;
  }> } | null;

  const fields = schema?.fields || [];

  if (fields.length === 0) {
    return (
      <div className="space-y-3">
        {Object.entries(block.props).map(([key, value]) => (
          <div key={key}>
            <Label className="text-xs capitalize">{key}</Label>
            {typeof value === "string" && value.length > 80 ? (
              <Textarea
                value={value}
                onChange={(e) => onPropChange(key, e.target.value)}
                rows={3}
                data-testid={`input-prop-${key}`}
              />
            ) : typeof value === "string" ? (
              <Input
                value={value}
                onChange={(e) => onPropChange(key, e.target.value)}
                data-testid={`input-prop-${key}`}
              />
            ) : (
              <Input
                value={JSON.stringify(value)}
                readOnly
                className="text-muted-foreground"
                data-testid={`input-prop-${key}`}
              />
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {fields.map((field) => {
        const value = block.props[field.key];

        if (field.type === "text") {
          return (
            <div key={field.key}>
              <Label className="text-xs">{field.label}</Label>
              <Input
                value={typeof value === "string" ? value : ""}
                onChange={(e) => onPropChange(field.key, e.target.value)}
                data-testid={`input-prop-${field.key}`}
              />
            </div>
          );
        }

        if (field.type === "textarea") {
          return (
            <div key={field.key}>
              <Label className="text-xs">{field.label}</Label>
              <Textarea
                value={typeof value === "string" ? value : ""}
                onChange={(e) => onPropChange(field.key, e.target.value)}
                rows={3}
                data-testid={`textarea-prop-${field.key}`}
              />
            </div>
          );
        }

        if (field.type === "select" && field.options) {
          return (
            <div key={field.key}>
              <Label className="text-xs">{field.label}</Label>
              <Select
                value={typeof value === "string" ? value : ""}
                onValueChange={(v) => onPropChange(field.key, v)}
              >
                <SelectTrigger data-testid={`select-prop-${field.key}`}>
                  <SelectValue placeholder={`Select ${field.label}`} />
                </SelectTrigger>
                <SelectContent>
                  {field.options.map((opt) => (
                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          );
        }

        if (field.type === "array") {
          const items = Array.isArray(value) ? value : [];
          return (
            <div key={field.key}>
              <Label className="text-xs">{field.label}</Label>
              <div className="space-y-2 mt-1">
                {items.map((item: any, idx: number) => (
                  <Card key={idx} className="p-2">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-xs text-muted-foreground">Item {idx + 1}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          const updated = items.filter((_: any, i: number) => i !== idx);
                          onPropChange(field.key, updated);
                        }}
                        data-testid={`button-remove-array-item-${field.key}-${idx}`}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    {field.itemFields ? (
                      <div className="space-y-1.5">
                        {field.itemFields.map((subField) => (
                          <div key={subField.key}>
                            <Label className="text-xs text-muted-foreground">{subField.label}</Label>
                            <Input
                              value={typeof item[subField.key] === "string" ? item[subField.key] : ""}
                              onChange={(e) => {
                                const updated = [...items];
                                updated[idx] = { ...updated[idx], [subField.key]: e.target.value };
                                onPropChange(field.key, updated);
                              }}
                              className="text-sm"
                              data-testid={`input-array-${field.key}-${idx}-${subField.key}`}
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <Input
                        value={typeof item === "string" ? item : JSON.stringify(item)}
                        onChange={(e) => {
                          const updated = [...items];
                          updated[idx] = e.target.value;
                          onPropChange(field.key, updated);
                        }}
                        data-testid={`input-array-${field.key}-${idx}`}
                      />
                    )}
                  </Card>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full gap-1"
                  onClick={() => {
                    const newItem = field.itemFields
                      ? Object.fromEntries(field.itemFields.map((f) => [f.key, ""]))
                      : "";
                    onPropChange(field.key, [...items, newItem]);
                  }}
                  data-testid={`button-add-array-item-${field.key}`}
                >
                  <Plus className="h-3 w-3" /> Add Item
                </Button>
              </div>
            </div>
          );
        }

        return (
          <div key={field.key}>
            <Label className="text-xs">{field.label}</Label>
            <Input
              value={typeof value === "string" ? value : JSON.stringify(value || "")}
              onChange={(e) => onPropChange(field.key, e.target.value)}
              data-testid={`input-prop-${field.key}`}
            />
          </div>
        );
      })}
    </div>
  );
}
