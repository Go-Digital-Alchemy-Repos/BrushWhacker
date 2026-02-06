import { SiteLayout } from "@/components/layout/site-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { SERVICES } from "@/lib/services-data";

export default function Quote() {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast({
        title: "Quote Request Submitted",
        description: "We'll get back to you within 24 hours with a detailed estimate.",
      });
      (e.target as HTMLFormElement).reset();
    }, 1000);
  };

  return (
    <SiteLayout>
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight" data-testid="text-quote-title">
              Get a Free Quote
            </h1>
            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto text-lg">
              Tell us about your project and we'll provide a detailed, no-obligation estimate within 24 hours.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6 sm:p-8">
                  <form onSubmit={handleSubmit} className="space-y-5" data-testid="form-quote">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" placeholder="John Smith" required data-testid="input-name" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="john@example.com" required data-testid="input-email" />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" type="tel" placeholder="(704) 555-0123" data-testid="input-phone" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="service">Service Needed</Label>
                        <Select>
                          <SelectTrigger data-testid="select-service">
                            <SelectValue placeholder="Select a service" />
                          </SelectTrigger>
                          <SelectContent>
                            {SERVICES.map((s) => (
                              <SelectItem key={s.slug} value={s.slug}>{s.title}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Property Address</Label>
                      <Input id="address" placeholder="123 Main St, Charlotte, NC 28202" data-testid="input-address" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lotSize">Approximate Lot Size</Label>
                      <Select>
                        <SelectTrigger data-testid="select-lot-size">
                          <SelectValue placeholder="Select lot size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="under-quarter">Under 1/4 acre</SelectItem>
                          <SelectItem value="quarter-half">1/4 to 1/2 acre</SelectItem>
                          <SelectItem value="half-one">1/2 to 1 acre</SelectItem>
                          <SelectItem value="one-five">1 to 5 acres</SelectItem>
                          <SelectItem value="five-plus">5+ acres</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="details">Project Details</Label>
                      <Textarea
                        id="details"
                        placeholder="Describe your project, including any specific requirements or timeline..."
                        className="min-h-[120px]"
                        data-testid="input-details"
                      />
                    </div>
                    <Button type="submit" size="lg" className="w-full gap-2" disabled={submitting} data-testid="button-submit-quote">
                      <Send className="h-4 w-4" />
                      {submitting ? "Submitting..." : "Submit Quote Request"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="font-semibold text-lg">Contact Info</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 text-sm">
                      <Phone className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <div>
                        <div className="font-medium">Phone</div>
                        <div className="text-muted-foreground">(704) 555-0123</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 text-sm">
                      <Mail className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <div>
                        <div className="font-medium">Email</div>
                        <div className="text-muted-foreground">info@brushwhackers.com</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 text-sm">
                      <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <div>
                        <div className="font-medium">Service Area</div>
                        <div className="text-muted-foreground">Charlotte, NC & 50mi radius</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 text-sm">
                      <Clock className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <div>
                        <div className="font-medium">Response Time</div>
                        <div className="text-muted-foreground">Within 24 hours</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">What Happens Next?</h3>
                  <ol className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">1.</span>
                      We review your request and call to discuss details.
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">2.</span>
                      We schedule a free on-site visit to assess the property.
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">3.</span>
                      You receive a detailed written estimate with no obligation.
                    </li>
                  </ol>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
