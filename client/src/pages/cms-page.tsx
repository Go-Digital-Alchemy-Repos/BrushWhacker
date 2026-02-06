import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Loader2 } from "lucide-react";
import { SiteLayout } from "@/components/layout/site-layout";
import { usePageMeta } from "@/hooks/use-page-meta";
import type { BlockInstance } from "@shared/schema";

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
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40" />
          <div className="relative z-10 text-center px-6 py-16 max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{block.props.headline}</h1>
            {block.props.subheadline && (
              <p className="text-lg text-white/90 mb-6">{block.props.subheadline}</p>
            )}
            {block.props.primaryCtaText && (
              <a
                href={block.props.primaryCtaHref || "/quote"}
                className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover-elevate"
              >
                {block.props.primaryCtaText}
              </a>
            )}
          </div>
        </section>
      );

    case "rich_text":
      return (
        <section className="py-12 px-6 max-w-4xl mx-auto" data-testid={`block-rich-text-${block.id}`}>
          <div className="prose prose-lg dark:prose-invert max-w-none whitespace-pre-wrap">
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
              <div className="absolute inset-0 bg-black/40" />
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
        <section className="py-16 px-6 bg-muted/30" data-testid={`block-feature-grid-${block.id}`}>
          <div className="max-w-5xl mx-auto">
            {block.props.heading && <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">{block.props.heading}</h2>}
            {block.props.subheading && <p className="text-muted-foreground text-center mb-10 max-w-2xl mx-auto">{block.props.subheading}</p>}
            <div className="grid md:grid-cols-3 gap-6">
              {(block.props.features || []).map((f: any, i: number) => (
                <div key={i} className="bg-card rounded-md p-6 border">
                  <h3 className="font-semibold mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case "service_cards":
      return (
        <section className="py-16 px-6" data-testid={`block-service-cards-${block.id}`}>
          <div className="max-w-5xl mx-auto">
            {block.props.heading && <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">{block.props.heading}</h2>}
            <div className="grid md:grid-cols-3 gap-6">
              {(block.props.services || []).map((s: any, i: number) => (
                <a key={i} href={s.slug} className="bg-card rounded-md p-6 border hover-elevate block">
                  <h3 className="font-semibold mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.description}</p>
                </a>
              ))}
            </div>
          </div>
        </section>
      );

    case "testimonial_row":
      return (
        <section className="py-16 px-6 bg-muted/30" data-testid={`block-testimonials-${block.id}`}>
          <div className="max-w-5xl mx-auto">
            {block.props.heading && <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">{block.props.heading}</h2>}
            <div className="grid md:grid-cols-3 gap-6">
              {(block.props.testimonials || []).map((t: any, i: number) => (
                <div key={i} className="bg-card rounded-md p-6 border">
                  <p className="text-sm text-muted-foreground italic mb-4">"{t.text}"</p>
                  <p className="text-sm font-medium">{t.name}</p>
                  {t.location && <p className="text-xs text-muted-foreground">{t.location}</p>}
                </div>
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
        <section className={`py-16 px-6 ${variants[block.props.variant] || variants.primary}`} data-testid={`block-cta-band-${block.id}`}>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">{block.props.heading}</h2>
            {block.props.description && <p className="opacity-90 mb-6">{block.props.description}</p>}
            {block.props.buttonText && (
              <a
                href={block.props.buttonHref || "/quote"}
                className="inline-block px-6 py-3 bg-background text-foreground rounded-md font-medium hover-elevate"
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
        <section className="py-16 px-6" data-testid={`block-faq-${block.id}`}>
          <div className="max-w-3xl mx-auto">
            {block.props.heading && <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">{block.props.heading}</h2>}
            <div className="space-y-4">
              {(block.props.faqs || []).map((faq: any, i: number) => (
                <details key={i} className="bg-card rounded-md border p-4 group">
                  <summary className="font-medium cursor-pointer list-none flex items-center justify-between gap-2">
                    {faq.question}
                    <span className="text-muted-foreground text-sm group-open:rotate-180 transition-transform">&#9660;</span>
                  </summary>
                  <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      );

    case "pricing_table":
      return (
        <section className="py-16 px-6" data-testid={`block-pricing-${block.id}`}>
          <div className="max-w-5xl mx-auto">
            {block.props.heading && <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">{block.props.heading}</h2>}
            <div className="grid md:grid-cols-3 gap-6">
              {(block.props.tiers || []).map((tier: any, i: number) => (
                <div key={i} className={`bg-card rounded-md p-6 border ${tier.highlighted ? "ring-2 ring-primary border-primary" : ""}`}>
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
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case "contact_cta":
      return (
        <section className="py-16 px-6 bg-muted/30" data-testid={`block-contact-cta-${block.id}`}>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">{block.props.heading}</h2>
            {block.props.description && <p className="text-muted-foreground mb-6">{block.props.description}</p>}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
              {block.props.phone && (
                <a href={`tel:${block.props.phone}`} className="text-primary font-medium hover:underline">{block.props.phone}</a>
              )}
              {block.props.email && (
                <a href={`mailto:${block.props.email}`} className="text-primary font-medium hover:underline">{block.props.email}</a>
              )}
            </div>
            {block.props.buttonText && (
              <a
                href={block.props.buttonHref || "/quote"}
                className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover-elevate"
              >
                {block.props.buttonText}
              </a>
            )}
          </div>
        </section>
      );

    default:
      return (
        <section className="py-8 px-6 max-w-4xl mx-auto" data-testid={`block-unknown-${block.id}`}>
          <div className="bg-muted/30 rounded-md p-4 text-sm text-muted-foreground">
            Block type "{block.type}" is not recognized.
          </div>
        </section>
      );
  }
}

export default function CmsPage() {
  const [, params] = useRoute("/p/:slug");
  const slug = params?.slug || "";

  const { data: page, isLoading, error } = useQuery<CmsPageData>({
    queryKey: ["/api/public/pages", slug],
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

  return (
    <SiteLayout>
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
