import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SiteLayout } from "@/components/layout/site-layout";
import { getServiceBySlug, SERVICES } from "@/lib/services-data";
import { ArrowRight, CheckCircle2, ArrowLeft, Target, Wrench, MapPin, DollarSign, HelpCircle } from "lucide-react";
import { usePageMeta } from "@/hooks/use-page-meta";

export default function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const service = getServiceBySlug(slug || "");

  usePageMeta({
    title: service?.metaTitle || "Service | BrushWhackers",
    description: service?.metaDescription || "Professional land clearing services in Charlotte, NC.",
    canonicalUrl: `/services/${slug}`,
    ogType: "website",
    jsonLd: service ? JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Service",
          "name": service.title,
          "description": service.description,
          "provider": {
            "@type": "LocalBusiness",
            "name": "BrushWhackers",
            "telephone": "(704) 608-5783",
            "address": { "@type": "PostalAddress", "addressLocality": "Charlotte", "addressRegion": "NC", "addressCountry": "US" }
          },
          "areaServed": { "@type": "City", "name": "Charlotte", "addressRegion": "NC" },
          "url": `${window.location.origin}/services/${slug}`
        },
        {
          "@type": "FAQPage",
          "mainEntity": service.faqs.map(faq => ({
            "@type": "Question",
            "name": faq.q,
            "acceptedAnswer": { "@type": "Answer", "text": faq.a }
          }))
        }
      ]
    }) : undefined,
  });

  if (!service) {
    return (
      <SiteLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-2xl font-bold" data-testid="text-service-not-found">Service Not Found</h1>
          <p className="mt-3 text-muted-foreground">The service you're looking for doesn't exist.</p>
          <Link href="/services">
            <Button variant="outline" className="mt-6 gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to Services
            </Button>
          </Link>
        </div>
      </SiteLayout>
    );
  }

  const relatedServices = SERVICES.filter((s) => service.relatedSlugs.includes(s.slug));

  return (
    <SiteLayout>
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${service.image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <Link href="/services" className="inline-flex items-center gap-1 text-sm text-gray-300 hover:text-white transition-colors mb-4">
            <ArrowLeft className="h-3.5 w-3.5" /> All Services
          </Link>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight" data-testid="text-service-title">
            {service.h1}
          </h1>
          <p className="mt-4 text-gray-300 max-w-2xl text-lg">{service.intro}</p>
          <Link href="/quote">
            <Button size="lg" className="mt-6 gap-2" data-testid="service-hero-cta-quote">
              Get a Free Quote <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4" data-testid="text-service-overview-heading">
            Service Overview
          </h2>
          <p className="text-muted-foreground leading-relaxed text-base sm:text-lg" data-testid="text-service-overview">
            {service.overview}
          </p>
        </div>
      </section>

      <section className="pb-12 sm:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Best For</h3>
                </div>
                <ul className="space-y-3" data-testid="list-best-for">
                  {service.bestFor.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Wrench className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">What's Included</h3>
                </div>
                <ul className="space-y-3" data-testid="list-whats-included">
                  {service.whatsIncluded.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="sm:col-span-2 lg:col-span-1">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Typical Projects</h3>
                </div>
                <ul className="space-y-3" data-testid="list-typical-projects">
                  {service.typicalProjects.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="pb-16 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-10">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold">Pricing Factors</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed" data-testid="text-pricing-factors">
                  {service.pricingFactors}
                </p>
                <Link href="/pricing">
                  <Button variant="outline" className="mt-4 gap-2" data-testid="link-pricing">
                    View Pricing <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>

              <div className="pt-4">
                <Link href="/quote">
                  <Button size="lg" className="gap-2" data-testid="service-detail-cta-quote">
                    Get a Free Quote <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-6">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold">Frequently Asked Questions</h2>
                </div>
                <div className="space-y-4" data-testid="section-faqs">
                  {service.faqs.map((faq, i) => (
                    <Card key={i}>
                      <CardContent className="p-5">
                        <h3 className="font-semibold">{faq.q}</h3>
                        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{faq.a}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Related Services</h3>
              {relatedServices.map((s) => (
                <Link key={s.slug} href={`/services/${s.slug}`}>
                  <Card className="hover-elevate cursor-pointer" data-testid={`card-related-${s.slug}`}>
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className="h-12 w-12 rounded-md overflow-hidden shrink-0">
                        <img src={s.image} alt={s.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-medium text-sm truncate">{s.title}</h4>
                        <p className="text-xs text-muted-foreground truncate">{s.shortDesc}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}

              <Card className="mt-6">
                <CardContent className="p-5 text-center space-y-3">
                  <h3 className="font-semibold">Need This Service?</h3>
                  <p className="text-sm text-muted-foreground">Get a fast, no-obligation quote for your property in the Charlotte area.</p>
                  <Link href="/quote">
                    <Button className="w-full gap-2" data-testid="sidebar-cta-quote">
                      Get a Quote <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
