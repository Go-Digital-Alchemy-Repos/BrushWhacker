import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { useState, useRef, useCallback, useEffect } from "react";
import { Loader2, Eye, Star, MapPin, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/layout/site-layout";
import { usePageMeta } from "@/hooks/use-page-meta";
import { getServiceIcon, ICON_SIZES } from "@/lib/service-icons";
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
              {(block.props.features || []).map((f: any, i: number) => {
                const IconComp = f.icon ? getServiceIcon(f.icon) : Sparkles;
                return (
                  <Card key={i} className="hover-elevate">
                    <CardContent className="p-6">
                      <div className="h-10 w-10 rounded-full flex items-center justify-center mb-3" style={{ background: "hsl(var(--primary) / 0.1)" }}>
                        <IconComp className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-semibold mb-2">{f.title}</h3>
                      <p className="text-sm text-muted-foreground">{f.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
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
              {(block.props.services || []).map((s: any, i: number) => {
                const iconKey = s.icon || s.slug?.split("/").pop() || s.title || "";
                const IconComp = getServiceIcon(iconKey);
                return (
                  <a key={i} href={s.slug}>
                    <Card className="hover-elevate cursor-pointer h-full">
                      <CardContent className="p-6">
                        <div className="h-10 w-10 rounded-full flex items-center justify-center mb-3" style={{ background: "hsl(var(--primary) / 0.1)" }}>
                          <IconComp className="h-5 w-5 text-primary" />
                        </div>
                        <h3 className="font-semibold mb-2">{s.title}</h3>
                        <p className="text-sm text-muted-foreground">{s.description}</p>
                      </CardContent>
                    </Card>
                  </a>
                );
              })}
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

    case "before_after_gallery":
      return <BeforeAfterGalleryBlock block={block} />;

    case "featured_projects":
      return <FeaturedProjectsBlock block={block} />;

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

function BeforeAfterCompareSlider({ beforeUrl, beforeAlt, afterUrl, afterAlt }: {
  beforeUrl: string; beforeAlt: string; afterUrl: string; afterAlt: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const isDragging = useRef(false);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setPosition((x / rect.width) * 100);
  }, []);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (isDragging.current) { e.preventDefault(); handleMove(e.clientX); }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (isDragging.current && e.touches[0]) { handleMove(e.touches[0].clientX); }
    };
    const onEnd = () => { isDragging.current = false; };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onEnd);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onEnd);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onEnd);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onEnd);
    };
  }, [handleMove]);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[4/3] overflow-hidden rounded-md select-none cursor-col-resize"
      onMouseDown={(e) => { isDragging.current = true; handleMove(e.clientX); }}
      onTouchStart={(e) => { isDragging.current = true; if (e.touches[0]) handleMove(e.touches[0].clientX); }}
      data-testid="before-after-slider"
    >
      <img src={afterUrl} alt={afterAlt} className="absolute inset-0 w-full h-full object-cover" draggable={false} />
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${position}%` }}>
        <img src={beforeUrl} alt={beforeAlt} className="absolute inset-0 w-full h-full object-cover" style={{ minWidth: containerRef.current ? `${containerRef.current.offsetWidth}px` : "100%" }} draggable={false} />
      </div>
      <div className="absolute top-0 bottom-0 z-10" style={{ left: `${position}%`, transform: "translateX(-50%)" }}>
        <div className="w-0.5 h-full bg-white shadow-md" />
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M5 3L2 8L5 13M11 3L14 8L11 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      <div className="absolute top-2 left-2 z-10 px-2 py-0.5 bg-black/60 text-white text-xs rounded-md">Before</div>
      <div className="absolute top-2 right-2 z-10 px-2 py-0.5 bg-black/60 text-white text-xs rounded-md">After</div>
    </div>
  );
}

function BeforeAfterGalleryBlock({ block }: { block: BlockInstance }) {
  const layout = block.props.layout || "compare";
  const items = Array.isArray(block.props.items) ? block.props.items : [];

  return (
    <section className="py-16 sm:py-20 px-6" data-testid={`block-before-after-gallery-${block.id}`}>
      <div className="max-w-5xl mx-auto">
        {block.props.headline && <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">{block.props.headline}</h2>}
        {block.props.subheadline && <p className="text-muted-foreground text-center mb-10 max-w-2xl mx-auto">{block.props.subheadline}</p>}
        {items.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm">No before/after items added yet.</p>
        ) : (
          <div className={layout === "compare" ? "space-y-10" : "grid md:grid-cols-2 gap-6"}>
            {items.map((item: any, i: number) => (
              <div key={item.id || i}>
                {item.title && (
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">{item.title}</h3>
                    {item.location && <span className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" />{item.location}</span>}
                  </div>
                )}
                {layout === "compare" && item.beforeImageUrl && item.afterImageUrl ? (
                  <BeforeAfterCompareSlider
                    beforeUrl={item.beforeImageUrl}
                    beforeAlt={item.beforeAlt || "Before"}
                    afterUrl={item.afterImageUrl}
                    afterAlt={item.afterAlt || "After"}
                  />
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {item.beforeImageUrl && (
                      <div>
                        <div className="aspect-[4/3] rounded-md overflow-hidden bg-muted">
                          <img src={item.beforeImageUrl} alt={item.beforeAlt || "Before"} className="w-full h-full object-cover" loading="lazy" />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 text-center">Before</p>
                      </div>
                    )}
                    {item.afterImageUrl && (
                      <div>
                        <div className="aspect-[4/3] rounded-md overflow-hidden bg-muted">
                          <img src={item.afterImageUrl} alt={item.afterAlt || "After"} className="w-full h-full object-cover" loading="lazy" />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 text-center">After</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        {block.props.ctaText && (
          <div className="text-center mt-10">
            <a href={block.props.ctaHref || "/quote"} className="inline-block">
              <Button data-testid={`link-before-after-cta-${block.id}`}>{block.props.ctaText}</Button>
            </a>
          </div>
        )}
      </div>
    </section>
  );
}

function FeaturedProjectsBlock({ block }: { block: BlockInstance }) {
  const limit = block.props.limit || 6;
  const featured = block.props.showOnlyFeatured !== false;
  const queryParams = new URLSearchParams();
  if (featured) queryParams.set("featured", "true");
  queryParams.set("limit", String(limit));
  
  const { data: projects } = useQuery<CrmProject[]>({
    queryKey: ["/api/public/projects", { featured, limit }],
    queryFn: async () => {
      const res = await fetch(`/api/public/projects?${queryParams}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  const visible = (projects || []).slice(0, limit);

  return (
    <section className="py-16 sm:py-20 px-6" data-testid={`block-featured-projects-${block.id}`}>
      <div className="max-w-5xl mx-auto">
        {block.props.headline && <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">{block.props.headline}</h2>}
        {block.props.subheadline && <p className="text-muted-foreground text-center mb-10 max-w-2xl mx-auto">{block.props.subheadline}</p>}
        {visible.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm">No projects to display yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visible.map((project) => {
              const images = Array.isArray(project.beforeAfter) ? (project.beforeAfter as { url: string; label?: string }[]) : [];
              const services = Array.isArray(project.services) ? (project.services as string[]) : [];
              return (
                <Card key={project.id} className="overflow-hidden hover-elevate" data-testid={`featured-project-${project.id}`}>
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
        {block.props.ctaText && (
          <div className="text-center mt-8">
            <a href={block.props.ctaHref || "/projects"} className="inline-block">
              <Button data-testid={`link-featured-projects-cta-${block.id}`}>{block.props.ctaText}</Button>
            </a>
          </div>
        )}
      </div>
    </section>
  );
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
