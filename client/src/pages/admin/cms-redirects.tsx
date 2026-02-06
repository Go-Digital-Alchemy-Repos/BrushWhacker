import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger
} from "@/components/ui/dialog";
import AdminLayout from "@/components/admin/admin-layout";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ArrowRightLeft, Plus, Trash2, Loader2, Calendar } from "lucide-react";
import type { CmsRedirect } from "@shared/schema";

export default function AdminCmsRedirects() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [fromPath, setFromPath] = useState("");
  const [toPath, setToPath] = useState("");
  const [code, setCode] = useState("301");
  const { toast } = useToast();

  const { data: redirects = [], isLoading } = useQuery<CmsRedirect[]>({
    queryKey: ["/api/admin/cms/redirects"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: { fromPath: string; toPath: string; code: number }) => {
      const res = await apiRequest("POST", "/api/admin/cms/redirects", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/cms/redirects"] });
      toast({ title: "Redirect created" });
      setDialogOpen(false);
      setFromPath("");
      setToPath("");
      setCode("301");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/cms/redirects/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/cms/redirects"] });
      toast({ title: "Redirect deleted" });
    },
  });

  return (
    <AdminLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <div className="flex items-center gap-3">
            <ArrowRightLeft className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold" data-testid="text-admin-redirects-title">Redirects</h1>
            <Badge variant="secondary">{redirects.length} redirects</Badge>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" data-testid="button-add-redirect">
                <Plus className="h-4 w-4" /> Add Redirect
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Redirect</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label htmlFor="redirect-from">From Path</Label>
                  <Input
                    id="redirect-from"
                    value={fromPath}
                    onChange={(e) => setFromPath(e.target.value)}
                    placeholder="/old-page"
                    data-testid="input-redirect-from"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="redirect-to">To Path</Label>
                  <Input
                    id="redirect-to"
                    value={toPath}
                    onChange={(e) => setToPath(e.target.value)}
                    placeholder="/new-page"
                    data-testid="input-redirect-to"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="redirect-code">Status Code</Label>
                  <Select value={code} onValueChange={setCode}>
                    <SelectTrigger data-testid="select-redirect-code">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="301">301 - Permanent</SelectItem>
                      <SelectItem value="302">302 - Temporary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={() => createMutation.mutate({ fromPath, toPath, code: parseInt(code) })}
                  disabled={!fromPath || !toPath || createMutation.isPending}
                  data-testid="button-submit-redirect"
                >
                  {createMutation.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                  Add
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : redirects.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground" data-testid="text-redirects-empty">
                No redirects configured yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm" data-testid="table-redirects">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left px-4 py-3 font-medium">From Path</th>
                      <th className="text-left px-4 py-3 font-medium">To Path</th>
                      <th className="text-left px-4 py-3 font-medium">Status Code</th>
                      <th className="text-left px-4 py-3 font-medium">Created</th>
                      <th className="text-right px-4 py-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {redirects.map((redirect) => (
                      <tr key={redirect.id} className="border-b last:border-0" data-testid={`row-redirect-${redirect.id}`}>
                        <td className="px-4 py-3 font-mono text-sm" data-testid={`text-from-${redirect.id}`}>
                          {redirect.fromPath}
                        </td>
                        <td className="px-4 py-3 font-mono text-sm" data-testid={`text-to-${redirect.id}`}>
                          {redirect.toPath}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={redirect.code === 301 ? "default" : "secondary"} data-testid={`badge-code-${redirect.id}`}>
                            {redirect.code}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(redirect.createdAt).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              if (confirm("Delete this redirect?")) deleteMutation.mutate(redirect.id);
                            }}
                            data-testid={`button-delete-redirect-${redirect.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
