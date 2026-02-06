import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  LayoutDashboard, Users, TrendingUp, Clock, ArrowRight, Loader2
} from "lucide-react";
import AdminLayout from "@/components/admin/admin-layout";

interface Stats {
  total: number;
  newThisWeek: number;
  pipeline: Record<string, number>;
}

const STATUS_COLORS: Record<string, string> = {
  New: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  Contacted: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  Scheduled: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  Won: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  Lost: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
};

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery<Stats>({
    queryKey: ["/api/admin/leads/stats"],
  });

  return (
    <AdminLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <LayoutDashboard className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold" data-testid="text-admin-title">Dashboard</h1>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              <Card data-testid="card-stat-total">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-9 w-9 rounded-md bg-primary/10 flex items-center justify-center">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm text-muted-foreground">Total Leads</span>
                  </div>
                  <p className="text-3xl font-bold" data-testid="text-stat-total">{stats?.total || 0}</p>
                </CardContent>
              </Card>

              <Card data-testid="card-stat-new-week">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-9 w-9 rounded-md bg-primary/10 flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm text-muted-foreground">New This Week</span>
                  </div>
                  <p className="text-3xl font-bold" data-testid="text-stat-new-week">{stats?.newThisWeek || 0}</p>
                </CardContent>
              </Card>

              <Card data-testid="card-stat-response">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-9 w-9 rounded-md bg-primary/10 flex items-center justify-center">
                      <Clock className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm text-muted-foreground">Avg Response</span>
                  </div>
                  <p className="text-3xl font-bold" data-testid="text-stat-response">&lt; 24h</p>
                  <p className="text-xs text-muted-foreground mt-1">Target response time</p>
                </CardContent>
              </Card>
            </div>

            <Card className="mb-8">
              <CardContent className="p-5">
                <h2 className="text-lg font-semibold mb-4">Pipeline Overview</h2>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {["New", "Contacted", "Scheduled", "Won", "Lost"].map((status) => (
                    <div
                      key={status}
                      className="text-center p-3 rounded-md bg-muted/30"
                      data-testid={`pipeline-${status.toLowerCase()}`}
                    >
                      <p className="text-2xl font-bold">{stats?.pipeline[status] || 0}</p>
                      <Badge
                        variant="outline"
                        className={`mt-1 text-xs no-default-hover-elevate no-default-active-elevate ${STATUS_COLORS[status] || ""}`}
                      >
                        {status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Link href="/admin/leads">
                <Button className="gap-2" data-testid="button-view-all-leads">
                  View All Leads <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
