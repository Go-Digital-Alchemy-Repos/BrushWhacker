import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SiteLayout } from "@/components/layout/site-layout";
import { CheckCircle2, ArrowRight, HelpCircle } from "lucide-react";

const tiers = [
  {
    name: "Residential",
    desc: "Perfect for homeowners with small to medium lots.",
    price: "Starting at $500",
    features: [
      "Lots up to 1 acre",
      "Brush & undergrowth removal",
      "Stump grinding add-on",
      "Same-week scheduling",
      "Free on-site estimate",
    ],
  },
  {
    name: "Commercial",
    desc: "For builders, developers, and property managers.",
    price: "Custom Pricing",
    popular: true,
    features: [
      "Multi-acre parcels",
      "Full land clearing",
      "Forestry mulching",
      "Grading preparation",
      "Priority scheduling",
      "Dedicated project manager",
    ],
  },
  {
    name: "Emergency",
    desc: "Storm damage and emergency cleanup services.",
    price: "Call for Rates",
    features: [
      "24/7 availability",
      "Fallen tree removal",
      "Debris hauling",
      "Insurance documentation",
      "Rapid response team",
    ],
  },
];

const faqs = [
  {
    q: "How do you determine pricing?",
    a: "Pricing is based on lot size, density of vegetation, terrain accessibility, and scope of work. We provide free on-site estimates so there are no surprises.",
  },
  {
    q: "Do you offer financing?",
    a: "Yes, we offer flexible payment plans for larger projects. Contact us to discuss options that work for your budget.",
  },
  {
    q: "Is there a minimum job size?",
    a: "We handle jobs of all sizes, from single stump removal to multi-acre clearing. Our minimum is typically $300.",
  },
  {
    q: "What's included in the estimate?",
    a: "Our estimates include labor, equipment, debris removal, and any permitting assistance. We provide a detailed written breakdown.",
  },
];

export default function Pricing() {
  return (
    <SiteLayout>
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight" data-testid="text-pricing-title">
              Transparent Pricing
            </h1>
            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto text-lg">
              Competitive rates for professional land clearing in the Charlotte area. Every project is unique, so we provide custom quotes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {tiers.map((tier) => (
              <Card
                key={tier.name}
                className={`relative ${tier.popular ? "border-primary" : ""}`}
                data-testid={`card-pricing-${tier.name.toLowerCase()}`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-md">
                    Most Popular
                  </div>
                )}
                <CardContent className="p-6 flex flex-col h-full">
                  <h3 className="text-xl font-bold">{tier.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{tier.desc}</p>
                  <div className="text-2xl font-bold mt-4 text-primary">{tier.price}</div>
                  <ul className="space-y-2.5 mt-6 flex-1">
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
                      data-testid={`button-pricing-quote-${tier.name.toLowerCase()}`}
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
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center justify-center gap-2">
              <HelpCircle className="h-6 w-6 text-primary" />
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <Card key={faq.q} data-testid={`card-faq-${faqs.indexOf(faq)}`}>
                <CardContent className="p-5">
                  <h3 className="font-semibold">{faq.q}</h3>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
