import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
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
import { Blocks, Plus, Loader2, Box, Lock } from "lucide-react";
import type { CmsBlock } from "@shared/schema";

export default function AdminCmsBlocks() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [key, setKey] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const { toast } = useToast();

  const { data: blocks = [], isLoading } = useQuery<CmsBlock[]>({
    queryKey: ["/api/admin/cms/blocks"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: { key: string; name: string; category: string; description: string }) => {
      const res = await apiRequest("POST", "/api/admin/cms/blocks", { ...data, isSystem: false });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/cms/blocks"] });
      toast({ title: "Block created" });
      setDialogOpen(false);
      setKey("");
      setName("");
      setCategory("");
      setDescription("");
    },
  });

  const grouped = blocks.reduce<Record<string, CmsBlock[]>>((acc, block) => {
    const cat = block.category || "Uncategorized";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(block);
    return acc;
  }, {});

  const sortedCategories = Object.keys(grouped).sort();

  return (
    <AdminLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <div className="flex items-center gap-3">
            <Blocks className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold" data-testid="text-admin-blocks-title">Block Library</h1>
            <Badge variant="secondary">{blocks.length} blocks</Badge>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" data-testid="button-create-block">
                <Plus className="h-4 w-4" /> Create Custom Block
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Custom Block</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label htmlFor="block-key">Key</Label>
                  <Input
                    id="block-key"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    placeholder="e.g. custom-cta"
                    data-testid="input-block-key"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="block-name">Name</Label>
                  <Input
                    id="block-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Custom CTA"
                    data-testid="input-block-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="block-category">Category</Label>
                  <Input
                    id="block-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g. Marketing"
                    data-testid="input-block-category"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="block-description">Description</Label>
                  <Textarea
                    id="block-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description"
                    data-testid="input-block-description"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={() => createMutation.mutate({ key, name, category, description })}
                  disabled={!key || !name || !category || createMutation.isPending}
                  data-testid="button-submit-block"
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
        ) : blocks.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              No blocks in the library yet.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {sortedCategories.map((cat) => (
              <div key={cat}>
                <h2 className="text-lg font-semibold mb-3" data-testid={`text-category-${cat}`}>{cat}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {grouped[cat].map((block) => (
                    <Card key={block.id} data-testid={`card-block-${block.id}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="h-9 w-9 rounded-md bg-muted flex items-center justify-center shrink-0">
                            <Box className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-medium text-sm" data-testid={`text-block-name-${block.id}`}>{block.name}</h3>
                              {block.isSystem && (
                                <Badge variant="outline" className="text-xs gap-1 no-default-hover-elevate no-default-active-elevate" data-testid={`badge-system-${block.id}`}>
                                  <Lock className="h-3 w-3" /> System
                                </Badge>
                              )}
                            </div>
                            {block.icon && (
                              <span className="text-xs text-muted-foreground">{block.icon}</span>
                            )}
                            {block.description && (
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{block.description}</p>
                            )}
                            <Badge variant="secondary" className="mt-2 text-xs">{block.category}</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
