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
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Plus, Loader2, Trash2, Pencil, MessageSquareQuote, Star,
} from "lucide-react";
import { useState } from "react";
import type { CmsTestimonial } from "@shared/schema";
import AdminLayout from "@/components/admin/admin-layout";

function StarRating({ value, onChange }: { value: number | null; onChange: (v: number | null) => void }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(value === n ? null : n)}
          className="p-0.5"
          data-testid={`star-rating-${n}`}
        >
          <Star
            className={`h-5 w-5 ${n <= (value || 0) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40"}`}
          />
        </button>
      ))}
    </div>
  );
}

function TestimonialForm({
  testimonial,
  onClose,
}: {
  testimonial?: CmsTestimonial;
  onClose: () => void;
}) {
  const { toast } = useToast();
  const [name, setName] = useState(testimonial?.name || "");
  const [area, setArea] = useState(testimonial?.area || "");
  const [quote, setQuote] = useState(testimonial?.quote || "");
  const [rating, setRating] = useState<number | null>(testimonial?.rating ?? null);
  const [publish, setPublish] = useState(testimonial?.publish ?? true);

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/admin/testimonials", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/testimonials"] });
      toast({ title: "Testimonial created" });
      onClose();
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("PATCH", `/api/admin/testimonials/${testimonial!.id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/testimonials"] });
      toast({ title: "Testimonial updated" });
      onClose();
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name: name || null,
      area: area || null,
      quote,
      rating,
      publish,
    };
    if (testimonial) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="test-name">Name</Label>
        <Input id="test-name" value={name} onChange={e => setName(e.target.value)} placeholder="John Smith" data-testid="input-testimonial-name" />
      </div>
      <div>
        <Label htmlFor="test-area">Area / Location</Label>
        <Input id="test-area" value={area} onChange={e => setArea(e.target.value)} placeholder="Huntersville, NC" data-testid="input-testimonial-area" />
      </div>
      <div>
        <Label htmlFor="test-quote">Quote</Label>
        <Textarea id="test-quote" value={quote} onChange={e => setQuote(e.target.value)} rows={3} required placeholder="They did an amazing job..." data-testid="input-testimonial-quote" />
      </div>
      <div>
        <Label>Rating</Label>
        <StarRating value={rating} onChange={setRating} />
      </div>
      <div className="flex items-center gap-2">
        <Switch checked={publish} onCheckedChange={setPublish} id="test-publish" data-testid="switch-testimonial-publish" />
        <Label htmlFor="test-publish">Published</Label>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onClose} data-testid="button-testimonial-cancel">Cancel</Button>
        <Button type="submit" disabled={isPending} data-testid="button-testimonial-save">
          {isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {testimonial ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  );
}

export default function AdminCmsTestimonials() {
  const { data: testimonials, isLoading } = useQuery<CmsTestimonial[]>({
    queryKey: ["/api/admin/testimonials"],
  });
  const { toast } = useToast();
  const [editingTestimonial, setEditingTestimonial] = useState<CmsTestimonial | null>(null);
  const [creating, setCreating] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/testimonials/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/testimonials"] });
      toast({ title: "Testimonial deleted" });
    },
  });

  return (
    <AdminLayout>
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold" data-testid="text-testimonials-heading">Testimonials</h1>
            <p className="text-sm text-muted-foreground">Manage customer testimonials for use in CMS blocks.</p>
          </div>
          <Dialog open={creating} onOpenChange={setCreating}>
            <DialogTrigger asChild>
              <Button data-testid="button-create-testimonial"><Plus className="h-4 w-4 mr-2" />Add Testimonial</Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader><DialogTitle>New Testimonial</DialogTitle></DialogHeader>
              <TestimonialForm onClose={() => setCreating(false)} />
            </DialogContent>
          </Dialog>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {!isLoading && (!testimonials || testimonials.length === 0) && (
          <Card className="p-10 text-center">
            <MessageSquareQuote className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">No testimonials yet. Add your first customer review.</p>
          </Card>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {(testimonials || []).map((t) => (
            <Card key={t.id} className="p-4 space-y-2" data-testid={`card-testimonial-${t.id}`}>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  {t.name && <p className="font-semibold text-sm">{t.name}</p>}
                  {t.area && <p className="text-xs text-muted-foreground">{t.area}</p>}
                </div>
                <Badge variant={t.publish ? "default" : "secondary"}>
                  {t.publish ? "Published" : "Draft"}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground italic line-clamp-3">"{t.quote}"</p>

              {t.rating && (
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star
                      key={n}
                      className={`h-3.5 w-3.5 ${n <= t.rating! ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`}
                    />
                  ))}
                </div>
              )}

              <div className="flex items-center gap-2 pt-1">
                <Dialog open={editingTestimonial?.id === t.id} onOpenChange={(o) => !o && setEditingTestimonial(null)}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline" onClick={() => setEditingTestimonial(t)} data-testid={`button-edit-testimonial-${t.id}`}>
                      <Pencil className="h-3.5 w-3.5 mr-1.5" />Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader><DialogTitle>Edit Testimonial</DialogTitle></DialogHeader>
                    <TestimonialForm testimonial={t} onClose={() => setEditingTestimonial(null)} />
                  </DialogContent>
                </Dialog>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => deleteMutation.mutate(t.id)}
                  disabled={deleteMutation.isPending}
                  data-testid={`button-delete-testimonial-${t.id}`}
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
