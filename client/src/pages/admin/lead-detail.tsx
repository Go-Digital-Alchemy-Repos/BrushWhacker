import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, Link, useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
  ArrowLeft, Loader2, Mail, Phone, MapPin, Calendar,
  Clock, Tag, MessageSquare, Activity, Send, FolderPlus
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import AdminLayout from "@/components/admin/admin-layout";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Lead, LeadNote, LeadActivity } from "@shared/schema";

const STATUS_COLORS: Record<string, string> = {
  New: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  Contacted: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  Scheduled: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  Won: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  Lost: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
};

const SERVICES_MAP: Record<string, string> = {
  "forestry-mulching": "Forestry Mulching",
  "trail-cutting": "Trail Cutting",
  "hillside-mulching": "Hillside Mulching",
  "brush-hogging": "Brush Hogging",
  "fence-line-clearing": "Fence Line Clearing",
  "invasive-growth-removal": "Invasive Growth Removal",
};

function formatDate(d: string | Date | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

function formatDateTime(d: string | Date | null) {
  if (!d) return "—";
  return new Date(d).toLocaleString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "numeric", minute: "2-digit",
  });
}

function activityDescription(act: LeadActivity) {
  const payload = act.payload as any;
  switch (act.type) {
    case "STATUS_CHANGE":
      return `Status changed from "${payload?.from}" to "${payload?.to}"`;
    case "NOTE_ADDED":
      return `Note added: "${payload?.preview || "..."}"`;
    case "ASSIGNED":
      return `Assigned from "${payload?.from || "unassigned"}" to "${payload?.to || "unassigned"}"`;
    case "EXPORTED":
      return `Leads exported (${payload?.count} leads)`;
    default:
      return act.type;
  }
}

export default function LeadDetail() {
  const params = useParams<{ id: string }>();
  const leadId = parseInt(params.id || "0");
  const { toast } = useToast();
  const [noteText, setNoteText] = useState("");
  const [, navigate] = useLocation();
  const [convertOpen, setConvertOpen] = useState(false);
  const [convertTitle, setConvertTitle] = useState("");
  const [convertSlug, setConvertSlug] = useState("");
  const [convertFeatured, setConvertFeatured] = useState(false);

  const { data: lead, isLoading } = useQuery<Lead>({
    queryKey: ["/api/admin/leads", leadId],
    enabled: leadId > 0,
  });

  const { data: notes = [] } = useQuery<LeadNote[]>({
    queryKey: ["/api/admin/leads", leadId, "notes"],
    enabled: leadId > 0,
  });

  const { data: activity = [] } = useQuery<LeadActivity[]>({
    queryKey: ["/api/admin/leads", leadId, "activity"],
    enabled: leadId > 0,
  });

  const statusMutation = useMutation({
    mutationFn: async (status: string) => {
      const res = await apiRequest("PATCH", `/api/admin/leads/${leadId}`, { status });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/leads", leadId] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/leads", leadId, "activity"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/leads/stats"] });
      toast({ title: "Status updated" });
    },
  });

  const noteMutation = useMutation({
    mutationFn: async (note: string) => {
      const res = await apiRequest("POST", `/api/admin/leads/${leadId}/notes`, { note });
      return res.json();
    },
    onSuccess: () => {
      setNoteText("");
      queryClient.invalidateQueries({ queryKey: ["/api/admin/leads", leadId, "notes"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/leads", leadId, "activity"] });
      toast({ title: "Note added" });
    },
  });

  const convertMutation = useMutation({
    mutationFn: async (data: { title: string; slug: string; featured: boolean }) => {
      const res = await apiRequest("POST", `/api/admin/projects/from-lead/${leadId}`, data);
      if (res.status === 409) {
        const body = await res.json();
        throw new Error(`CONFLICT:${body.projectId}`);
      }
      if (!res.ok) throw new Error("Failed to convert");
      return res.json();
    },
    onSuccess: (project: any) => {
      toast({ title: "Project created from lead" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/projects"] });
      navigate(`/admin/crm/projects`);
    },
    onError: (err: Error) => {
      if (err.message.startsWith("CONFLICT:")) {
        toast({
          title: "Project already exists",
          description: "This lead has already been converted to a project.",
          variant: "destructive",
        });
      } else {
        toast({ title: "Error", description: err.message, variant: "destructive" });
      }
    },
  });

  const openConvertModal = () => {
    if (lead) {
      const defaultTitle = `${lead.fullName} - ${(lead.servicesNeeded || []).map(s => SERVICES_MAP[s] || s).join(", ")}`;
      setConvertTitle(defaultTitle);
      setConvertSlug(defaultTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
      setConvertFeatured(false);
      setConvertOpen(true);
    }
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    noteMutation.mutate(noteText.trim());
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </AdminLayout>
    );
  }

  if (!lead) {
    return (
      <AdminLayout>
        <div className="p-6 max-w-6xl mx-auto">
          <Link href="/admin/leads" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Leads
          </Link>
          <p className="text-muted-foreground" data-testid="text-lead-not-found">Lead not found.</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <Link href="/admin/leads" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Leads
        </Link>

        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-lead-name">{lead.fullName}</h1>
            <p className="text-sm text-muted-foreground mt-1">Lead #{lead.id} &middot; {formatDate(lead.createdAt)}</p>
          </div>
          <div className="flex items-center gap-3">
            <Select
              value={lead.status}
              onValueChange={(v) => statusMutation.mutate(v)}
              disabled={statusMutation.isPending}
            >
              <SelectTrigger className="w-40" data-testid="select-lead-status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Contacted">Contacted</SelectItem>
                <SelectItem value="Scheduled">Scheduled</SelectItem>
                <SelectItem value="Won">Won</SelectItem>
                <SelectItem value="Lost">Lost</SelectItem>
              </SelectContent>
            </Select>
            <Badge
              variant="outline"
              className={`no-default-hover-elevate no-default-active-elevate ${STATUS_COLORS[lead.status] || ""}`}
              data-testid="badge-lead-status"
            >
              {lead.status}
            </Badge>
            <Button variant="outline" onClick={openConvertModal} data-testid="button-convert-to-project">
              <FolderPlus className="h-4 w-4 mr-2" />Convert to Project
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-5">
                <h2 className="font-semibold mb-4">Project Description</h2>
                <p className="text-muted-foreground leading-relaxed" data-testid="text-lead-outcome">
                  {lead.desiredOutcome || "No description provided."}
                </p>
                {lead.accessNotes && (
                  <div className="mt-3 pt-3 border-t">
                    <span className="text-sm font-medium">Access Notes:</span>
                    <p className="text-sm text-muted-foreground mt-1">{lead.accessNotes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <h2 className="font-semibold mb-4 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" /> Notes ({notes.length})
                </h2>

                <form onSubmit={handleAddNote} className="flex gap-2 mb-4">
                  <Textarea
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Add a note..."
                    className="resize-none text-sm"
                    rows={2}
                    data-testid="textarea-add-note"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={!noteText.trim() || noteMutation.isPending}
                    data-testid="button-add-note"
                  >
                    {noteMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </form>

                {notes.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No notes yet.</p>
                ) : (
                  <div className="space-y-3">
                    {notes.map((n) => (
                      <div key={n.id} className="border rounded-md p-3" data-testid={`note-${n.id}`}>
                        <p className="text-sm">{n.note}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {n.createdBy} &middot; {formatDateTime(n.createdAt)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <h2 className="font-semibold mb-4 flex items-center gap-2">
                  <Activity className="h-4 w-4" /> Activity Log ({activity.length})
                </h2>
                {activity.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No activity yet.</p>
                ) : (
                  <div className="space-y-3">
                    {activity.map((act) => (
                      <div key={act.id} className="flex gap-3 text-sm" data-testid={`activity-${act.id}`}>
                        <div className="h-2 w-2 rounded-full bg-muted-foreground mt-2 shrink-0" />
                        <div>
                          <p>{activityDescription(act)}</p>
                          <p className="text-xs text-muted-foreground">{formatDateTime(act.createdAt)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-5 space-y-4">
                <h2 className="font-semibold">Contact Info</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                    <a href={`mailto:${lead.email}`} className="text-primary hover:underline" data-testid="text-lead-email">
                      {lead.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                    <a href={`tel:${lead.phone}`} className="text-primary hover:underline" data-testid="text-lead-phone">
                      {lead.phone}
                    </a>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    <span data-testid="text-lead-address">{lead.jobAddress}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5 space-y-4">
                <h2 className="font-semibold">Property Details</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between gap-2">
                    <span className="text-muted-foreground">County</span>
                    <span className="font-medium">{lead.county}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-muted-foreground">Property Type</span>
                    <span className="font-medium">{lead.propertyType}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-muted-foreground">Area</span>
                    <span className="font-medium">{lead.approximateArea}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-muted-foreground">Timeline</span>
                    <span className="font-medium">{lead.timeline}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-muted-foreground">Budget</span>
                    <span className="font-medium">{lead.budgetComfort}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5 space-y-3">
                <h2 className="font-semibold">Services Requested</h2>
                <div className="flex flex-wrap gap-1.5">
                  {(lead.servicesNeeded || []).map(s => (
                    <Badge key={s} variant="outline" className="text-xs no-default-hover-elevate no-default-active-elevate">
                      {SERVICES_MAP[s] || s}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5 space-y-3">
                <h2 className="font-semibold">Metadata</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between gap-2">
                    <span className="text-muted-foreground">Source</span>
                    <span className="font-medium">{lead.source || "Website"}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-muted-foreground">Created</span>
                    <span className="font-medium">{formatDateTime(lead.createdAt)}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-muted-foreground">Updated</span>
                    <span className="font-medium">{formatDateTime(lead.updatedAt)}</span>
                  </div>
                  {lead.tags && lead.tags.length > 0 && (
                    <div className="flex items-start gap-2 pt-1">
                      <Tag className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                      <div className="flex flex-wrap gap-1">
                        {lead.tags.map(t => (
                          <Badge key={t} variant="outline" className="text-xs no-default-hover-elevate no-default-active-elevate">{t}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Dialog open={convertOpen} onOpenChange={setConvertOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Convert Lead to Project</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            convertMutation.mutate({ title: convertTitle, slug: convertSlug, featured: convertFeatured });
          }} className="space-y-4">
            <div>
              <Label htmlFor="convert-title">Project Title</Label>
              <Input id="convert-title" value={convertTitle} onChange={(e) => {
                setConvertTitle(e.target.value);
                setConvertSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
              }} required data-testid="input-convert-title" />
            </div>
            <div>
              <Label htmlFor="convert-slug">URL Slug</Label>
              <Input id="convert-slug" value={convertSlug} onChange={(e) => setConvertSlug(e.target.value)} required data-testid="input-convert-slug" />
              <p className="text-xs text-muted-foreground mt-1">/projects/{convertSlug}</p>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={convertFeatured} onCheckedChange={setConvertFeatured} id="convert-featured" data-testid="switch-convert-featured" />
              <Label htmlFor="convert-featured">Mark as Featured</Label>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setConvertOpen(false)} data-testid="button-convert-cancel">Cancel</Button>
              <Button type="submit" disabled={convertMutation.isPending} data-testid="button-convert-submit">
                {convertMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Create Project
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
