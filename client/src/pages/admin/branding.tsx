import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Palette } from "lucide-react";
import AdminLayout from "@/components/admin/admin-layout";

export default function AdminBranding() {
  return (
    <AdminLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Palette className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold" data-testid="text-admin-branding-title">Branding Settings</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold">Brand Colors</h3>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label>Primary Color</Label>
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-md bg-primary border" />
                    <Input defaultValue="#3B82F6" className="max-w-[140px]" data-testid="input-primary-color" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Background Color</Label>
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-md bg-background border" />
                    <Input defaultValue="#FFFFFF" className="max-w-[140px]" data-testid="input-bg-color" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold">Company Info</h3>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label>Company Name</Label>
                  <Input defaultValue="BrushWhackers" data-testid="input-company-name" />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input defaultValue="(704) 555-0123" data-testid="input-phone" />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input defaultValue="info@brushwhackers.com" data-testid="input-email" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <Button data-testid="button-save-branding">Save Changes</Button>
        </div>

        <p className="text-xs text-muted-foreground mt-4">
          Branding settings will be fully implemented in a future phase.
        </p>
      </div>
    </AdminLayout>
  );
}
