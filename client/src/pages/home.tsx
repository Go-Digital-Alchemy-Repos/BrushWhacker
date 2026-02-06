import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SiteLayout } from "@/components/layout/site-layout";
import { STOCK_IMAGES } from "@/lib/stock-images";
import { SERVICES } from "@/lib/services-data";
import { usePageMeta } from "@/hooks/use-page-meta";
import {
  TreePine, Axe, Mountain, Trees, Truck,
  Shield, Clock, Star, ArrowRight, Phone, CheckCircle2,
  MapPin, Leaf, Zap, Users, Eye, HardHat
} from "lucide-react";

const SERVICE_ICONS: Record<string, typeof Mountain> = {
  "land-clearing": Mountain,
  "brush-removal": Axe,
  "forestry-mulching": TreePine,
  "lot-clearing": Trees,
  "stump-grinding": Zap,
  "driveway-trail-cutting": Leaf,
  "storm-cleanup": Truck,
};

const stats = [
  { value: "500+", label: "Projects Completed" },
  { value: "15+", label: "Years Experience" },
  { value: "100%", label: "Insured & Licensed" },
  { value: "4.9", label: "Average Rating" },
];

const whatWeClear = [
  { icon: Axe, title: "Brush & overgrowth" },
  { icon: TreePine, title: "Small trees & saplings" },
  { icon: Shield, title: "Fence lines & property edges" },
  { icon: Leaf, title: "Trails & access lanes" },
  { icon: Truck, title: "Storm debris & downed limbs" },
  { icon: HardHat, title: "Building pads & lot prep" },
];

const processSteps = [
  { step: "1", title: "Tell us about your property", desc: "Fill out our quick quote form with your property details, goals, and photos if available." },
  { step: "2", title: "We confirm access, scope, and timeline", desc: "We review your request, confirm site access, and outline what to expect." },
  { step: "3", title: "We clear, mulch, and leave it clean", desc: "Our crew arrives with the right equipment and gets the job done right." },
  { step: "4", title: "Optional haul-off, grading, or follow-up pass", desc: "Need more? We offer haul-off, finish grading, or a second pass as needed." },
];

const whyBrushWhackers = [
  { icon: MapPin, text: "Locally serving Charlotte & surrounding counties" },
  { icon: HardHat, text: "Commercial-grade equipment & attachments" },
  { icon: Eye, text: "Clear communication + photo updates available" },
  { icon: Shield, text: "Respect for property lines, utilities, and drainage" },
  { icon: Users, text: "Safety-first crew and jobsite standards" },
];

const testimonials = [
  {
    text: "They cleared our overgrown half-acre in a single day. The crew was professional, on time, and left the lot looking better than we imagined.",
    name: "(Customer name, neighborhood)",
  },
  {
    text: "We needed storm debris removed fast after a big storm took down several trees. BrushWhackers responded quickly and handled everything start to finish.",
    name: "(Customer name, neighborhood)",
  },
  {
    text: "Great communication throughout the entire project. They sent us photo updates and the final result was exactly what we needed for our new build.",
    name: "(Customer name, neighborhood)",
  },
];

export default function Home() {
  usePageMeta({
    title: "BrushWhackers | Land Clearing & Brush Removal in Charlotte, NC",
    description: "BrushWhackers provides land clearing, brush removal, forestry mulching, lot clearing, stump grinding, and storm cleanup across the Charlotte, NC region. Fast quotes. Professional equipment.",
  });

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
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight" data-testid="hero-heading">
              Land Clearing & Brush Removal Done Right — Charlotte, North Carolina
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed max-w-xl" data-testid="hero-subtext">
              From overgrown lots to storm debris cleanup, BrushWhackers uses professional equipment (skid steers, forestry mulchers, and attachments) to clear land efficiently — with results you can see.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/quote">
                <Button size="lg" className="gap-2" data-testid="hero-cta-quote">
                  Get a Fast Quote
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/services">
                <Button size="lg" variant="outline" className="gap-2 bg-white/10 backdrop-blur-sm text-white border-white/20" data-testid="hero-cta-services">
                  View Services
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
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

      <section className="py-16 sm:py-20" data-testid="what-we-clear-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">What We Clear</h2>
            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
              No matter what's covering your land, we have the equipment and experience to handle it.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {whatWeClear.map((item) => (
              <Card key={item.title} className="hover-elevate" data-testid={`card-clear-${item.title.toLowerCase().replace(/\s+/g, "-")}`}>
                <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                  <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold">{item.title}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-card" data-testid="services-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Our Services</h2>
            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
              From small residential lots to large commercial properties, we have the equipment and expertise to handle any job.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SERVICES.map((service) => {
              const IconComp = SERVICE_ICONS[service.slug] || Mountain;
              return (
                <Link key={service.slug} href={`/services/${service.slug}`}>
                  <Card className="h-full hover-elevate transition-all cursor-pointer group" data-testid={`card-service-${service.slug}`}>
                    <CardContent className="p-6 flex flex-col gap-3">
                      <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                        <IconComp className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-semibold text-lg">{service.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{service.shortDesc}</p>
                      <span className="text-sm text-primary font-medium flex items-center gap-1 mt-auto">
                        Learn more <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
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

      <section className="py-16 sm:py-20" data-testid="process-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">How Our Process Works</h2>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
            From first contact to finished job, here is what to expect when you work with BrushWhackers.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            {processSteps.map((item) => (
              <div key={item.step} className="text-center space-y-3">
                <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto text-lg font-bold" data-testid={`process-step-${item.step}`}>
                  {item.step}
                </div>
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-card" data-testid="why-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Why BrushWhackers
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                With over 15 years of experience and hundreds of satisfied customers, we are the go-to team for land clearing in the Charlotte metropolitan area.
              </p>
              <div className="mt-8 space-y-5">
                {whyBrushWhackers.map((b) => (
                  <div key={b.text} className="flex gap-4 items-start">
                    <div className="h-10 w-10 shrink-0 rounded-md bg-primary/10 flex items-center justify-center">
                      <b.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex items-center min-h-[2.5rem]">
                      <p className="font-medium" data-testid={`why-bullet-${b.text.slice(0, 20).toLowerCase().replace(/\s+/g, "-")}`}>{b.text}</p>
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

      <section className="py-16 sm:py-20" data-testid="service-area-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Service Area</h2>
          </div>
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-primary" />
              <Badge variant="secondary" className="no-default-active-elevate">Charlotte Metro Region</Badge>
            </div>
            <p className="text-muted-foreground leading-relaxed" data-testid="text-service-area">
              BrushWhackers proudly serves Charlotte, Lake Norman, Huntersville, Concord, Matthews, Mint Hill, Fort Mill, Belmont, and surrounding areas within about an hour of the Charlotte metro. Whether your property is in a residential neighborhood or on rural acreage, we bring our equipment and crew to get the job done.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-card" data-testid="testimonials-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">What Our Customers Say</h2>
            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
              Real feedback from property owners across the Charlotte region.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {testimonials.map((t, i) => (
              <Card key={i} className="h-full" data-testid={`card-testimonial-${i}`}>
                <CardContent className="p-6 flex flex-col gap-4">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">{t.text}</p>
                  <p className="text-sm font-medium">{t.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden" data-testid="cta-section">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${STOCK_IMAGES.forest})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-bold">Ready to reclaim your land?</h2>
          <p className="mt-3 text-white/80 max-w-xl mx-auto">
            Get a free, no-obligation quote today. We serve the entire Charlotte metro area and beyond.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <Link href="/quote">
              <Button size="lg" variant="secondary" className="gap-2" data-testid="cta-get-quote">
                <CheckCircle2 className="h-4 w-4" />
                Get a Fast Quote
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
