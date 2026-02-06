import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SiteLayout } from "@/components/layout/site-layout";
import { CheckCircle2, ArrowRight, HelpCircle, Clock, Zap, Star, Layers } from "lucide-react";
import { usePageMeta } from "@/hooks/use-page-meta";

const tiers = [
  {
    name: "Hourly",
    icon: Clock,
    price: "$250",
    priceDetail: "minimum service call",
    subPrice: "Then $175/hr after the first hour",
    desc: "Covers travel, setup, and first hour of work.",
    bestFor: "Small brush pockets, fence lines, quick cleanups",
    features: [
      "$250 minimum covers first hour",
      "$175 per additional hour",
      "Ideal for focused, smaller tasks",
      "No commitment beyond the job",
    ],
  },
  {
    name: "Half-Day Value",
    icon: Zap,
    price: "$600",
    priceDetail: "4 hours",
    subPrice: "Effective rate: $150/hr",
    desc: "Save on the hourly rate with a half-day block.",
    bestFor: "Medium overgrowth, multiple zones, trail segments",
    popular: true,
    features: [
      "4 hours of equipment time",
      "Effective rate of $150/hr",
      "Great for medium-sized projects",
      "Covers most residential jobs",
    ],
  },
  {
    name: "Full-Day Best Value",
    icon: Star,
    price: "$1,000",
    priceDetail: "8 hours",
    subPrice: "Effective rate: $125/hr",
    desc: "The best rate for full-day projects.",
    bestFor: "Large lots, heavy brush, longer trail cuts",
    features: [
      "8 hours of equipment time",
      "Best effective rate at $125/hr",
      "Perfect for large-scale clearing",
      "Maximum value for big jobs",
    ],
  },
  {
    name: "By the Acre",
    icon: Layers,
    price: "From $900",
    priceDetail: "per acre",
    subPrice: "Price varies by vegetation density",
    desc: "For larger properties priced by area rather than time.",
    bestFor: "Open acreage cleanup and forestry mulching",
    features: [
      "Starting at $900 per acre",
      "Price depends on density and terrain",
      "Ideal for multi-acre properties",
      "Forestry mulching specialty",
    ],
  },
];

const affectsPrice = [
  "Vegetation density and stem size",
  "Terrain slope and ground conditions",
  "Access width (gates, driveways)",
  "Obstacles (fencing, rocks, debris, hidden stumps)",
  "Haul-off vs mulch-on-site",
  "Utility locate requirements",
];

const faqs = [
  {
    q: "Is the $250 a minimum?",
    a: "Yes. The $250 minimum covers our travel to your site, equipment setup, and the first hour of work. Most small jobs like fence line cleanups or brush pockets fall within this minimum. If the job takes longer, additional time is billed at $175 per hour.",
  },
  {
    q: "Do you haul debris away?",
    a: "It depends on the job. With forestry mulching, vegetation is mulched on-site so there's nothing to haul. For traditional clearing jobs, we can arrange haul-off at an additional cost, or we can pile material for you to handle. We'll discuss the best approach during your estimate.",
  },
  {
    q: "Can you work in wet conditions?",
    a: "We can work in lightly wet conditions, but heavy rain or saturated ground can cause rutting and soil compaction. We'll reschedule if conditions risk damaging your property. Safety and site quality come first.",
  },
  {
    q: "Do you require utility locates?",
    a: "Yes, for any work near underground utilities we require a locate be completed before we start. You can call NC 811 (dial 811) to schedule a free locate. We can advise you on the process.",
  },
  {
    q: "How fast can I get scheduled?",
    a: "Most projects are scheduled within 1-2 weeks. During peak season (spring and fall), lead times may be slightly longer. For urgent or emergency work, we do our best to accommodate faster turnarounds.",
  },
];

export default function Pricing() {
  usePageMeta({
    title: "Pricing | BrushWhackers Charlotte, NC",
    description: "Simple pricing options for brush removal, forestry mulching, and land clearing in the Charlotte area. Choose hourly, half-day, full-day, or by-the-acre options. Get a fast quote.",
  });

  return (
    <SiteLayout>
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight" data-testid="text-pricing-title">
              Simple, Straightforward Pricing
            </h1>
            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto text-lg">
              Final pricing depends on access, vegetation density, terrain, and disposal needs. Your quote confirms exact pricing for your specific property. Serving Charlotte, Mecklenburg County, and surrounding areas.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {tiers.map((tier) => (
              <Card
                key={tier.name}
                className={`relative ${tier.popular ? "border-primary" : ""}`}
                data-testid={`card-pricing-${tier.name.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-md">
                    Most Popular
                  </div>
                )}
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex items-center gap-2 mb-2">
                    <tier.icon className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-bold">{tier.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{tier.desc}</p>
                  <div className="mt-4">
                    <span className="text-3xl font-bold text-primary">{tier.price}</span>
                    <span className="text-sm text-muted-foreground ml-1">/{tier.priceDetail}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{tier.subPrice}</p>
                  <div className="mt-3 mb-4">
                    <Badge variant="secondary" className="text-xs">Best for: {tier.bestFor}</Badge>
                  </div>
                  <ul className="space-y-2.5 flex-1">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/quote">
                    <Button
                      className="w-full mt-6 gap-2"
                      variant={tier.popular ? "default" : "outline"}
                      data-testid={`button-pricing-quote-${tier.name.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      Get a Quote <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-card">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">What Affects Price</h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              Every property is different. Here are the main factors that influence your final quote.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {affectsPrice.map((item) => (
              <div key={item} className="flex items-center gap-3 p-3">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/quote">
              <Button className="gap-2" data-testid="pricing-affects-cta">
                Get Your Custom Quote <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center justify-center gap-2">
              <HelpCircle className="h-6 w-6 text-primary" />
              Common Questions
            </h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <Card key={i} data-testid={`card-faq-${i}`}>
                <CardContent className="p-5">
                  <h3 className="font-semibold">{faq.q}</h3>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center text-white">
          <h2 className="text-2xl sm:text-3xl font-bold">Ready to Get Started?</h2>
          <p className="mt-3 text-white/80 max-w-xl mx-auto">
            Tell us about your project and we'll provide a fast, accurate quote. We serve Charlotte, Huntersville, Matthews, Concord, Fort Mill, Lake Norman, and the surrounding region.
          </p>
          <Link href="/quote">
            <Button size="lg" variant="secondary" className="mt-6 gap-2" data-testid="pricing-final-cta">
              Get a Fast Quote <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
