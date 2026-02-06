import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SiteLayout } from "@/components/layout/site-layout";
import { getServiceBySlug, SERVICES } from "@/lib/services-data";
import { ArrowRight, CheckCircle2, ArrowLeft } from "lucide-react";

export default function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const service = getServiceBySlug(slug || "");

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

  const otherServices = SERVICES.filter((s) => s.slug !== slug).slice(0, 3);

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
            {service.title}
          </h1>
          <p className="mt-4 text-gray-300 max-w-2xl text-lg">{service.shortDesc}</p>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <p className="text-lg text-muted-foreground leading-relaxed" data-testid="text-service-description">
                {service.description}
              </p>
              <div>
                <h2 className="text-xl font-semibold mb-4">What's Included</h2>
                <ul className="space-y-3">
                  {service.features.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-4">
                <Link href="/quote">
                  <Button size="lg" className="gap-2" data-testid="service-detail-cta-quote">
                    Get a Free Quote <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Other Services</h3>
              {otherServices.map((s) => (
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
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
