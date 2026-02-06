import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SiteLayout } from "@/components/layout/site-layout";
import { SERVICES } from "@/lib/services-data";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { STOCK_IMAGES } from "@/lib/stock-images";
import { usePageMeta } from "@/hooks/use-page-meta";

export default function Services() {
  usePageMeta({
    title: "Forestry Mulching & Land Clearing Services | BrushWhackers Charlotte, NC",
    description: "BrushWhackers offers forestry mulching, trail cutting, hillside mulching, brush hogging, fence line clearing, and invasive growth removal across the Charlotte, NC area.",
    canonicalUrl: "/services",
    jsonLd: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Land Clearing Services",
      "description": "Professional land clearing and forestry mulching services offered by BrushWhackers in the Charlotte, NC area.",
      "numberOfItems": 6,
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Forestry Mulching", "url": `${window.location.origin}/services/forestry-mulching` },
        { "@type": "ListItem", "position": 2, "name": "Trail Cutting", "url": `${window.location.origin}/services/trail-cutting` },
        { "@type": "ListItem", "position": 3, "name": "Hillside Mulching", "url": `${window.location.origin}/services/hillside-mulching` },
        { "@type": "ListItem", "position": 4, "name": "Brush Hogging", "url": `${window.location.origin}/services/brush-hogging` },
        { "@type": "ListItem", "position": 5, "name": "Fence Line Clearing", "url": `${window.location.origin}/services/fence-line-clearing` },
        { "@type": "ListItem", "position": 6, "name": "Invasive Growth Removal", "url": `${window.location.origin}/services/invasive-growth-removal` }
      ]
    }),
  });

  return (
    <SiteLayout>
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${STOCK_IMAGES.forest})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight" data-testid="text-services-title">
            Forestry Mulching & Land Clearing Services in Charlotte, NC
          </h1>
          <p className="mt-4 text-gray-300 max-w-2xl mx-auto text-lg">
            BrushWhackers specializes in forestry mulching and land clearing across Charlotte, Mecklenburg County, Union County, Cabarrus County, and surrounding areas. From overgrown lots to steep hillsides, invasive growth to fence line clearing, we bring the right equipment to every job.
          </p>
          <Link href="/quote">
            <Button size="lg" className="mt-6 gap-2" data-testid="services-hero-cta">
              Get a Fast Quote <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {SERVICES.map((service, i) => (
            <Card key={service.slug} data-testid={`card-service-${service.slug}`}>
              <CardContent className={`p-0 grid md:grid-cols-2 gap-0 ${i % 2 === 1 ? "md:[direction:rtl]" : ""}`}>
                <div className="aspect-video md:aspect-auto overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className={`p-6 sm:p-8 flex flex-col justify-center space-y-4 ${i % 2 === 1 ? "md:[direction:ltr]" : ""}`}>
                  <h2 className="text-2xl font-bold">{service.title}</h2>
                  <p className="text-muted-foreground leading-relaxed">{service.shortDesc}</p>
                  <ul className="space-y-2">
                    {service.bestFor.slice(0, 3).map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="pt-2">
                    <Link href={`/services/${service.slug}`}>
                      <Button variant="outline" className="gap-2" data-testid={`link-service-detail-${service.slug}`}>
                        Learn More <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center text-white">
          <h2 className="text-2xl sm:text-3xl font-bold">Not Sure Which Service You Need?</h2>
          <p className="mt-3 text-white/80 max-w-xl mx-auto">
            Contact us for a free consultation. We serve Charlotte, Huntersville, Matthews, Mint Hill, Concord, Fort Mill, Belmont, Lake Norman, and surrounding areas within about an hour.
          </p>
          <Link href="/quote">
            <Button size="lg" variant="secondary" className="mt-6 gap-2" data-testid="services-cta-quote">
              Get a Free Quote <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
