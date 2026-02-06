import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Loader2, Eye, Star, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SiteLayout } from "@/components/layout/site-layout";
import { usePageMeta } from "@/hooks/use-page-meta";
import type { BlockInstance, CrmProject, CmsTestimonial } from "@shared/schema";

interface CmsPageData {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  blocks: BlockInstance[];
  seo: {
    title?: string;
    metaDescription?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
  };
  status: string;
  _preview?: boolean;
}

function BlockRenderer({ block }: { block: BlockInstance }) {
  if (block.meta?.hidden) return null;

  switch (block.type) {
    case "hero":
      return (
        <section className="relative w-full min-h-[400px] flex items-center justify-center overflow-hidden" data-testid={`block-hero-${block.id}`}>
          {block.props.imageUrl && (
            <img
              src={block.props.imageUrl}
              alt={block.props.imageAlt || ""}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.3) 100%)" }} />
          <div className="relative z-10 text-center px-6 py-16 max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{block.props.headline}</h1>
            {block.props.subheadline && (
              <p className="text-lg text-white/90 mb-6">{block.props.subheadline}</p>
            )}
            {block.props.primaryCtaText && (
              <a
                href={block.props.primaryCtaHref || "/quote"}
                className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover-elevate"
                data-testid={`link-hero-cta-${block.id}`}
              >
                {block.props.primaryCtaText}
              </a>
            )}
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-16" style={{ background: "linear-gradient(to top, hsl(var(--background)), transparent)" }} />
        </section>
      );

    case "rich_text":
      return (
        <section className="py-16 sm:py-20 px-6 max-w-4xl mx-auto" data-testid={`block-rich-text-${block.id}`}>
          <div className="prose prose-lg dark:prose-invert max-w-none whitespace-pre-wrap prose-premium">
            {block.props.content}
          </div>
        </section>
      );

    case "image_banner": {
      const heightMap: Record<string, string> = { sm: "h-48", md: "h-64", lg: "h-96" };
      return (
        <section className={`relative w-full ${heightMap[block.props.height] || "h-64"} overflow-hidden`} data-testid={`block-image-banner-${block.id}`}>
          <img
            src={block.props.imageUrl}
            alt={block.props.alt || ""}
            className="w-full h-full object-cover"
          />
          {block.props.overlayText && (
            <>
              <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.3) 100%)" }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-2xl md:text-3xl font-bold text-white text-center px-6">{block.props.overlayText}</p>
              </div>
            </>
          )}
        </section>
      );
    }

    case "feature_grid":
      return (
        <section className="py-16 sm:py-20 px-6 bg-gradient-section" data-testid={`block-feature-grid-${block.id}`}>
          <div className="max-w-5xl mx-auto">
            {block.props.heading && <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">{block.props.heading}</h2>}
            {block.props.subheading && <p className="text-muted-foreground text-center mb-10 max-w-2xl mx-auto">{block.props.subheading}</p>}
            <div className="grid md:grid-cols-3 gap-6">
              {(block.props.features || []).map((f: any, i: number) => (
                <Card key={i} className="hover-elevate">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">{f.title}</h3>
                    <p className="text-sm text-muted-foreground">{f.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      );

    case "service_cards":
      return (
        <section className="py-16 sm:py-20 px-6" data-testid={`block-service-cards-${block.id}`}>
          <div className="max-w-5xl mx-auto">
            {block.props.heading && <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">{block.props.heading}</h2>}
            <div className="grid md:grid-cols-3 gap-6">
              {(block.props.services || []).map((s: any, i: number) => (
                <a key={i} href={s.slug}>
                  <Card className="hover-elevate cursor-pointer h-full">
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-2">{s.title}</h3>
                      <p className="text-sm text-muted-foreground">{s.description}</p>
                    </CardContent>
                  </Card>
                </a>
              ))}
            </div>
          </div>
        </section>
      );

    case "testimonial_row":
      return (
        <section className="py-16 sm:py-20 px-6 bg-gradient-section" data-testid={`block-testimonials-${block.id}`}>
          <div className="max-w-5xl mx-auto">
            {block.props.heading && <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">{block.props.heading}</h2>}
            {block.props.subheading && <p className="text-muted-foreground text-center mb-10 max-w-2xl mx-auto">{block.props.subheading}</p>}
            <div className="grid md:grid-cols-3 gap-6">
              {(block.props.testimonials || []).map((t: any, i: number) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <p className="text-sm text-muted-foreground italic mb-4">"{t.text}"</p>
                    <p className="text-sm font-medium">{t.name}</p>
                    {t.location && <p className="text-xs text-muted-foreground">{t.location}</p>}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      );

    case "cta_band": {
      const variants: Record<string, string> = {
        primary: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        dark: "bg-foreground text-background",
      };
      return (
        <section className={`py-16 sm:py-20 px-6 ${variants[block.props.variant] || variants.primary}`} data-testid={`block-cta-band-${block.id}`}>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">{block.props.heading}</h2>
            {block.props.description && <p className="opacity-90 mb-6">{block.props.description}</p>}
            {block.props.buttonText && (
              <a
                href={block.props.buttonHref || "/quote"}
                className="inline-block px-6 py-3 bg-background text-foreground rounded-md font-medium hover-elevate"
                data-testid={`link-cta-band-${block.id}`}
              >
                {block.props.buttonText}
              </a>
            )}
          </div>
        </section>
      );
    }

    case "faq":
      return (
        <section className="py-16 sm:py-20 px-6" data-testid={`block-faq-${block.id}`}>
          <div className="max-w-3xl mx-auto">
            {block.props.heading && <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">{block.props.heading}</h2>}
            <div className="space-y-4">
              {(block.props.faqs || []).map((faq: any, i: number) => (
                <details key={i} className="group">
                  <Card>
                    <CardContent className="p-0">
                      <summary className="font-medium cursor-pointer list-none flex items-center justify-between gap-2 p-4">
                        {faq.question}
                        <span className="text-muted-foreground text-sm group-open:rotate-180 transition-transform">&#9660;</span>
                      </summary>
                      <div className="px-4 pb-4">
                        <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
                      </div>
                    </CardContent>
                  </Card>
                </details>
              ))}
            </div>
          </div>
        </section>
      );

    case "pricing_table":
      return (
        <section className="py-16 sm:py-20 px-6" data-testid={`block-pricing-${block.id}`}>
          <div className="max-w-5xl mx-auto">
            {block.props.heading && <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">{block.props.heading}</h2>}
            <div className="grid md:grid-cols-3 gap-6">
              {(block.props.tiers || []).map((tier: any, i: number) => (
                <Card key={i} className={tier.highlighted ? "ring-2 ring-primary border-primary" : ""}>
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg mb-1">{tier.name}</h3>
                    <p className="text-xl font-semibold text-primary mb-3">{tier.price}</p>
                    <p className="text-sm text-muted-foreground mb-4">{tier.description}</p>
                    {Array.isArray(tier.features) && (
                      <ul className="space-y-2">
                        {tier.features.map((f: string, j: number) => (
                          <li key={j} className="text-sm flex items-start gap-2">
                            <span className="text-primary mt-0.5">&#10003;</span>
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      );

    case "contact_cta":
      return (
        <section className="py-16 sm:py-20 px-6 bg-gradient-section spotlight-glow" data-testid={`block-contact-cta-${block.id}`}>
          <div className="max-w-2xl mx-auto text-center relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">{block.props.heading}</h2>
            {block.props.description && <p className="text-muted-foreground mb-6">{block.props.description}</p>}
            <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 mb-6">
              {block.props.phone && (
                <a href={`tel:${block.props.phone}`} className="text-primary font-medium hover:underline" data-testid={`link-contact-phone-${block.id}`}>{block.props.phone}</a>
              )}
              {block.props.email && (
                <a href={`mailto:${block.props.email}`} className="text-primary font-medium hover:underline" data-testid={`link-contact-email-${block.id}`}>{block.props.email}</a>
              )}
            </div>
            {block.props.buttonText && (
              <a
                href={block.props.buttonHref || "/quote"}
                className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover-elevate"
                data-testid={`link-contact-cta-${block.id}`}
              >
                {block.props.buttonText}
              </a>
            )}
          </div>
        </section>
      );

    case "project_gallery":
      return <ProjectGalleryBlock block={block} />;

    case "testimonials_slider":
      return <TestimonialsSliderBlock block={block} />;

    default:
      return (
        <section className="py-8 px-6 max-w-4xl mx-auto" data-testid={`block-unknown-${block.id}`}>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">
                Block type "{block.type}" is not recognized.
              </p>
            </CardContent>
          </Card>
        </section>
      );
  }
}

function ProjectGalleryBlock({ block }: { block: BlockInstance }) {
  const maxItems = block.props.maxItems || 6;
  const { data: projects } = useQuery<CrmProject[]>({
    queryKey: ["/api/public/projects"],
  });

  const visible = (projects || []).slice(0, maxItems);

  return (
    <section className="py-16 sm:py-20 px-6" data-testid={`block-project-gallery-${block.id}`}>
      <div className="max-w-5xl mx-auto">
        {block.props.heading && <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">{block.props.heading}</h2>}
        {block.props.subheading && <p className="text-muted-foreground text-center mb-10 max-w-2xl mx-auto">{block.props.subheading}</p>}
        {visible.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm">No projects published yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visible.map((project) => {
              const images = Array.isArray(project.beforeAfter) ? (project.beforeAfter as { url: string; label?: string }[]) : [];
              const services = Array.isArray(project.services) ? (project.services as string[]) : [];
              return (
                <Card key={project.id} className="overflow-hidden" data-testid={`gallery-project-${project.id}`}>
                  {images.length > 0 && (
                    <div className="aspect-video overflow-hidden">
                      <img src={images[0].url} alt={images[0].label || project.title} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                  )}
                  <CardContent className="p-4 space-y-2">
                    <h3 className="font-semibold">{project.title}</h3>
                    {project.location && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" />{project.location}</p>
                    )}
                    {project.summary && <p className="text-sm text-muted-foreground line-clamp-2">{project.summary}</p>}
                    {services.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {services.map((s, i) => (
                          <span key={i} className="text-xs bg-muted px-2 py-0.5 rounded-md">{s}</span>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

function TestimonialsSliderBlock({ block }: { block: BlockInstance }) {
  const maxItems = block.props.maxItems || 6;
  const { data: testimonials } = useQuery<CmsTestimonial[]>({
    queryKey: ["/api/public/testimonials"],
  });

  const visible = (testimonials || []).slice(0, maxItems);

  return (
    <section className="py-16 sm:py-20 px-6 bg-gradient-section" data-testid={`block-testimonials-slider-${block.id}`}>
      <div className="max-w-5xl mx-auto">
        {block.props.heading && <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">{block.props.heading}</h2>}
        {block.props.subheading && <p className="text-muted-foreground text-center mb-10 max-w-2xl mx-auto">{block.props.subheading}</p>}
        {visible.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm">No testimonials published yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visible.map((t) => (
              <Card key={t.id} data-testid={`testimonial-card-${t.id}`}>
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground italic mb-4">"{t.quote}"</p>
                  {t.rating && (
                    <div className="flex items-center gap-0.5 mb-3">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star
                          key={n}
                          className={`h-3.5 w-3.5 ${n <= t.rating! ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`}
                        />
                      ))}
                    </div>
                  )}
                  <div>
                    {t.name && <p className="text-sm font-medium">{t.name}</p>}
                    {t.area && <p className="text-xs text-muted-foreground">{t.area}</p>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default function CmsPage() {
  const [, params] = useRoute("/p/:slug");
  const slug = params?.slug || "";
  const searchParams = new URLSearchParams(window.location.search);
  const previewToken = searchParams.get("previewToken") || undefined;

  const queryUrl = previewToken
    ? `/api/public/pages/${slug}?previewToken=${encodeURIComponent(previewToken)}`
    : `/api/public/pages/${slug}`;

  const { data: page, isLoading, error } = useQuery<CmsPageData>({
    queryKey: ["/api/public/pages", slug, previewToken || ""],
    queryFn: async () => {
      const res = await fetch(queryUrl, { credentials: "include" });
      if (!res.ok) throw new Error(`${res.status}: ${await res.text()}`);
      return res.json();
    },
    enabled: !!slug,
  });

  usePageMeta({
    title: page?.seo?.title || page?.title || "Page",
    description: page?.seo?.metaDescription || page?.description || "",
  });

  if (isLoading) {
    return (
      <SiteLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </SiteLayout>
    );
  }

  if (error || !page) {
    return (
      <SiteLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Page Not Found</h1>
            <p className="text-muted-foreground">The page you're looking for doesn't exist or hasn't been published yet.</p>
          </div>
        </div>
      </SiteLayout>
    );
  }

  const blocks = Array.isArray(page.blocks) ? page.blocks : [];
  const isPreview = !!page._preview;

  return (
    <SiteLayout>
      {isPreview && (
        <div className="sticky top-0 z-50 bg-amber-500 text-amber-950 px-4 py-2 text-center text-sm font-medium flex items-center justify-center gap-2" data-testid="preview-banner">
          <Eye className="h-4 w-4" />
          Draft Preview - This page is not published
        </div>
      )}
      <div data-testid="cms-page-content">
        {blocks.map((block) => (
          <BlockRenderer key={block.id} block={block} />
        ))}
        {blocks.length === 0 && (
          <div className="min-h-[40vh] flex items-center justify-center">
            <p className="text-muted-foreground">This page has no content yet.</p>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
