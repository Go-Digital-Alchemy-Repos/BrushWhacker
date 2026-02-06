import type { ReactNode, ElementType } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SectionProps {
  children: ReactNode;
  variant?: "default" | "tinted" | "gradient" | "pattern";
  className?: string;
  id?: string;
  "data-testid"?: string;
}

export function Section({ children, variant = "default", className, id, ...props }: SectionProps) {
  const variantClasses: Record<string, string> = {
    default: "",
    tinted: "bg-gradient-tinted",
    gradient: "bg-gradient-section",
    pattern: "bg-dot-pattern-light",
  };

  return (
    <section
      id={id}
      className={cn("py-16 sm:py-20 lg:py-24", variantClasses[variant], className)}
      data-testid={props["data-testid"]}
    >
      {children}
    </section>
  );
}

interface SectionHeaderProProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
  "data-testid"?: string;
}

export function SectionHeaderPro({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className,
  ...props
}: SectionHeaderProProps) {
  const alignClasses = align === "center" ? "text-center mx-auto" : "";

  return (
    <div className={cn("mb-10 sm:mb-12", alignClasses, className)} data-testid={props["data-testid"]}>
      {eyebrow && (
        <div className="inline-flex flex-wrap items-center gap-2 px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 mb-4">
          {eyebrow}
        </div>
      )}
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className={cn("mt-3 text-muted-foreground leading-relaxed", align === "center" ? "max-w-2xl mx-auto" : "max-w-2xl")}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

interface ImageFloatProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string;
  "data-testid"?: string;
}

export function ImageFloat({ src, alt, className, aspectRatio = "4/3", ...props }: ImageFloatProps) {
  return (
    <div
      className={cn("image-float overflow-hidden", className)}
      style={{ aspectRatio }}
      data-testid={props["data-testid"]}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        loading="lazy"
      />
    </div>
  );
}

interface TrustBadgeProps {
  items: { icon: ElementType; text: string }[];
  className?: string;
}

export function TrustRow({ items, className }: TrustBadgeProps) {
  return (
    <div className={cn("flex flex-wrap items-center justify-center gap-x-6 gap-y-3 py-4", className)}>
      {items.map((item) => (
        <div key={item.text} className="flex items-center gap-2 text-sm text-muted-foreground">
          <item.icon className="h-4 w-4 text-primary" />
          <span className="font-medium">{item.text}</span>
        </div>
      ))}
    </div>
  );
}

interface CtaBandProps {
  headline: string;
  description?: string;
  primaryCta?: { text: string; href: string };
  secondaryCta?: { text: string; href: string };
  variant?: "primary" | "image";
  backgroundImage?: string;
  className?: string;
  "data-testid"?: string;
}

export function CtaBand({
  headline,
  description,
  primaryCta,
  secondaryCta,
  variant = "primary",
  backgroundImage,
  className,
  ...props
}: CtaBandProps) {
  if (variant === "image" && backgroundImage) {
    return (
      <section className={cn("relative overflow-hidden", className)} data-testid={props["data-testid"]}>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.45) 100%)" }} />
        <div className="relative max-w-3xl mx-auto px-6 py-20 sm:py-28 text-center text-white">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">{headline}</h2>
          {description && <p className="mt-4 text-white/80 max-w-xl mx-auto text-lg">{description}</p>}
          {(primaryCta || secondaryCta) && (
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              {primaryCta && (
                <a href={primaryCta.href}>
                  <Button size="lg">{primaryCta.text}</Button>
                </a>
              )}
              {secondaryCta && (
                <a href={secondaryCta.href}>
                  <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm text-white border-white/25">{secondaryCta.text}</Button>
                </a>
              )}
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className={cn("py-16 px-6 bg-primary text-primary-foreground", className)} data-testid={props["data-testid"]}>
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">{headline}</h2>
        {description && <p className="mb-6 opacity-90">{description}</p>}
        {(primaryCta || secondaryCta) && (
          <div className="flex flex-wrap justify-center gap-3">
            {primaryCta && (
              <a href={primaryCta.href}>
                <Button variant="secondary">{primaryCta.text}</Button>
              </a>
            )}
            {secondaryCta && (
              <a href={secondaryCta.href}>
                <Button variant="link" className="text-primary-foreground underline underline-offset-4">{secondaryCta.text}</Button>
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
