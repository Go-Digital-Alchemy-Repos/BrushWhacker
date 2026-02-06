import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SiteLayout } from "@/components/layout/site-layout";
import { STOCK_IMAGES } from "@/lib/stock-images";
import {
  TreePine, Axe, Mountain, Trees, Truck,
  Shield, Clock, Star, ArrowRight, Phone, CheckCircle2
} from "lucide-react";

const services = [
  { title: "Land Clearing", icon: Mountain, href: "/services/land-clearing", desc: "Complete land clearing for residential and commercial properties." },
  { title: "Brush Removal", icon: Axe, href: "/services/brush-removal", desc: "Thorough brush and undergrowth removal for cleaner property." },
  { title: "Forestry Mulching", icon: TreePine, href: "/services/forestry-mulching", desc: "Eco-friendly mulching that returns nutrients to the soil." },
  { title: "Lot Clearing", icon: Trees, href: "/services/lot-clearing", desc: "Prepare lots for construction or landscaping projects." },
  { title: "Storm Cleanup", icon: Truck, href: "/services/storm-cleanup", desc: "Fast response storm debris and fallen tree cleanup." },
];

const stats = [
  { value: "500+", label: "Projects Completed" },
  { value: "15+", label: "Years Experience" },
  { value: "100%", label: "Insured & Licensed" },
  { value: "4.9", label: "Average Rating" },
];

const benefits = [
  { icon: Shield, title: "Fully Insured", desc: "Complete liability and workers comp coverage for your peace of mind." },
  { icon: Clock, title: "Fast Turnaround", desc: "We get the job done efficiently without cutting corners on quality." },
  { icon: Star, title: "Top Rated", desc: "Consistently rated 5 stars by homeowners across the Charlotte area." },
];

export default function Home() {
  return (
    <SiteLayout>
      <section className="relative overflow-hidden" data-testid="hero-section">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${STOCK_IMAGES.hero})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/20 border border-primary/30 rounded-md text-sm text-primary-foreground">
              <TreePine className="h-4 w-4" />
              <span>Serving Charlotte, NC & Surrounding Areas</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
              Professional Land Clearing & Brush Removal
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed max-w-lg">
              Transform your overgrown property into usable land. Expert team, modern equipment, fast results.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/quote">
                <Button size="lg" className="gap-2" data-testid="hero-cta-quote">
                  Get a Free Quote
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="gap-2 bg-white/10 backdrop-blur-sm text-white border-white/20" data-testid="hero-cta-call">
                <Phone className="h-4 w-4" />
                (704) 555-0123
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-primary text-primary-foreground" data-testid="stats-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl sm:text-3xl font-bold" data-testid={`stat-value-${stat.label.toLowerCase().replace(/\s+/g, "-")}`}>
                  {stat.value}
                </div>
                <div className="text-sm text-primary-foreground/80 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20" data-testid="services-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Our Services</h2>
            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
              From small residential lots to large commercial properties, we have the equipment and expertise to handle any job.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service) => (
              <Link key={service.href} href={service.href}>
                <Card className="h-full hover-elevate transition-all cursor-pointer group" data-testid={`card-service-${service.href.split("/").pop()}`}>
                  <CardContent className="p-6 flex flex-col gap-3">
                    <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                      <service.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg">{service.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{service.desc}</p>
                    <span className="text-sm text-primary font-medium flex items-center gap-1 mt-auto">
                      Learn more <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/services">
              <Button variant="outline" className="gap-2" data-testid="link-all-services">
                View All Services <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-card" data-testid="benefits-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Why Charlotte Trusts BrushWhackers
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                With over 15 years of experience and hundreds of satisfied customers, we're the go-to team for land clearing in the Charlotte metropolitan area.
              </p>
              <div className="mt-8 space-y-5">
                {benefits.map((b) => (
                  <div key={b.title} className="flex gap-4">
                    <div className="h-10 w-10 shrink-0 rounded-md bg-primary/10 flex items-center justify-center">
                      <b.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{b.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative rounded-md overflow-hidden aspect-[4/3]">
              <img
                src={STOCK_IMAGES.heavyMachinery}
                alt="Heavy machinery clearing land"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20" data-testid="process-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">How It Works</h2>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
            Getting your land cleared is simple with our streamlined process.
          </p>
          <div className="grid sm:grid-cols-3 gap-6 mt-10">
            {[
              { step: "1", title: "Request a Quote", desc: "Fill out our quick form or give us a call to describe your project." },
              { step: "2", title: "Free Site Visit", desc: "We'll visit your property and provide a detailed, no-obligation estimate." },
              { step: "3", title: "We Get to Work", desc: "Our crew arrives with the right equipment and transforms your land." },
            ].map((item) => (
              <div key={item.step} className="text-center space-y-3">
                <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto text-lg font-bold">
                  {item.step}
                </div>
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden" data-testid="cta-section">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${STOCK_IMAGES.forest})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-bold">Ready to Clear Your Land?</h2>
          <p className="mt-3 text-white/80 max-w-xl mx-auto">
            Get a free, no-obligation quote today. We serve the entire Charlotte metro area including Concord, Huntersville, Matthews, and more.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <Link href="/quote">
              <Button size="lg" variant="secondary" className="gap-2" data-testid="cta-get-quote">
                <CheckCircle2 className="h-4 w-4" />
                Get Your Free Quote
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
